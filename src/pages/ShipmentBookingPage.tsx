import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { MapPin, Package, Truck, Download, Briefcase, User, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import NavBar from "@/components/layout/NavBar";
import LabelLanguageSelector from "@/components/labels/LabelLanguageSelector";
import { CustomerType, BookingRequest, BookingResponse } from "@/types/booking";
import { getCountryFlag, getCountryName, getCountryDialCode, translateLabel } from "@/lib/utils";

// Fixed import to include needed services
import { bookShipment, cancelBooking, generateLabel } from "@/services/bookingService";

const ShipmentBookingPage: React.FC<{ customerType?: CustomerType }> = ({ customerType: initialCustomerType }) => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for steps
  const [currentStep, setCurrentStep] = useState<"details" | "address" | "contents">("details");
  const [currentLanguage, setCurrentLanguage] = useState<string>("sv");
  
  // Customer type selection
  const [showCustomerTypeSelection, setShowCustomerTypeSelection] = useState(!initialCustomerType);
  const [selectedCustomerType, setSelectedCustomerType] = useState<CustomerType | undefined>(initialCustomerType);
  
  // Package details
  const [quantity, setQuantity] = useState("1");
  const [packageType, setPackageType] = useState("package");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  
  // Sender information
  const [senderName, setSenderName] = useState("");
  const [senderStreetAddress, setSenderStreetAddress] = useState("");
  const [senderStreetAddress2, setSenderStreetAddress2] = useState("");
  const [senderPostalCode, setSenderPostalCode] = useState("");
  const [senderCity, setSenderCity] = useState("");
  const [senderCountry, setSenderCountry] = useState("SE");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderPersonalId, setSenderPersonalId] = useState("");
  
  // Recipient information
  const [recipientName, setRecipientName] = useState("");
  const [recipientStreetAddress, setRecipientStreetAddress] = useState("");
  const [recipientStreetAddress2, setRecipientStreetAddress2] = useState("");
  const [recipientPostalCode, setRecipientPostalCode] = useState("");
  const [recipientCity, setRecipientCity] = useState("");
  const [recipientCountry, setRecipientCountry] = useState("FI");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  
  // Business information
  const [businessName, setBusinessName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  
  // Shipping options
  const [deliverySpeed, setDeliverySpeed] = useState("standard");
  const [compliance, setCompliance] = useState(false);
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  
  // Booking state
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(null);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [canCancelBooking, setCanCancelBooking] = useState(false);
  
  // Label generation
  const [labelLanguage, setLabelLanguage] = useState<string>("en");
  const [isGeneratingLabel, setIsGeneratingLabel] = useState(false);

  useEffect(() => {
    if (initialCustomerType) {
      setSelectedCustomerType(initialCustomerType);
      setShowCustomerTypeSelection(false);
    }
    
    // Check if there's a saved booking in localStorage
    const savedBooking = localStorage.getItem('lastBooking');
    if (savedBooking) {
      try {
        const { trackingCode, timestamp } = JSON.parse(savedBooking);
        const bookingTime = new Date(timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - bookingTime.getTime()) / (1000 * 60 * 60);
        
        // If the booking is less than 24 hours old, show confirmation
        if (hoursDiff < 24) {
          // Set up a mock booking result
          setBookingResult({
            success: true,
            trackingCode,
            shipmentId: `SHIP-${Math.floor(Math.random() * 1000000)}`,
            totalPrice: 15.99,
            cancellationDeadline: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
            canBeCancelled: true,
            carrier: {
              name: "DHL Parcel Connect",
              price: 10
            }
          });
          setBookingConfirmed(true);
          setCanCancelBooking(true);
        }
      } catch (error) {
        console.error("Error parsing saved booking:", error);
        localStorage.removeItem('lastBooking');
      }
    }
  }, [initialCustomerType]);
  
  const getCarrierPrice = () => {
    if (selectedCustomerType === "business") {
      return 9;
    } else if (selectedCustomerType === "ecommerce") {
      return 8;
    } else {
      return 10;
    }
  };

  const carrier = {
    id: 1,
    name: "DHL Parcel Connect",
    price: getCarrierPrice(),
    eta: "3 days",
    icon: "📦"
  };

  const handleCustomerTypeSelect = (type: CustomerType) => {
    if (type) {
      navigate(`/shipment/${type}`);
    }
  };
  
  const handleBookNow = async () => {
    if (!isSignedIn || !user) {
      document.querySelector<HTMLButtonElement>("button.cl-userButtonTrigger")?.click();
      return;
    }

    setIsBooking(true);
    
    try {
      const result = await bookShipment({
        weight,
        dimensions: { length, width, height },
        pickup: `${senderStreetAddress}, ${senderCity}, ${senderCountry}`,
        delivery: `${recipientStreetAddress}, ${recipientCity}, ${recipientCountry}`,
        carrier: { name: carrier.name, price: carrier.price },
        deliverySpeed,
        includeCompliance: compliance,
        userId: user.id,
        customerType: selectedCustomerType || "private",
        businessName: selectedCustomerType === "business" || selectedCustomerType === "ecommerce" ? businessName : undefined,
        vatNumber: selectedCustomerType === "business" ? vatNumber : undefined,
        senderName,
        senderEmail,
        senderPhone,
        recipientName,
        recipientEmail,
        recipientPhone,
        additionalInstructions
      });
      
      if (result.success) {
        setBookingResult(result);
        setBookingConfirmed(true);
        setCanCancelBooking(true);
        
        localStorage.setItem('lastBooking', JSON.stringify({
          trackingCode: result.trackingCode,
          timestamp: new Date().toISOString()
        }));
        
        toast({
          title: "Shipment Booked",
          description: `Your shipment has been booked with tracking code: ${result.trackingCode}`,
        });
      } else {
        toast({
          title: "Booking Failed",
          description: result.message || "There was a problem with your booking.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in booking flow:", error);
      toast({
        title: "Booking Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingResult?.trackingCode) return;
    
    const trackingCode = bookingResult.trackingCode;
    
    if (!trackingCode || !user?.id) return;
    
    try {
      const cancelled = await cancelBooking(trackingCode, user.id);
      if (cancelled) {
        setBookingConfirmed(false);
        setBookingResult(null);
        setCanCancelBooking(false);
        localStorage.removeItem('lastBooking');
        
        toast({
          title: "Booking Cancelled",
          description: "Your booking has been successfully cancelled.",
        });
      } else {
        toast({
          title: "Cancellation Failed",
          description: "Unable to cancel booking. Please try again or contact support.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Cancellation Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleSwapLocations = () => {
    // Swap sender and recipient information
    const tempName = senderName;
    const tempStreet = senderStreetAddress;
    const tempStreet2 = senderStreetAddress2;
    const tempPostal = senderPostalCode;
    const tempCity = senderCity;
    const tempCountry = senderCountry;
    const tempPhone = senderPhone;
    const tempEmail = senderEmail;
    
    setSenderName(recipientName);
    setSenderStreetAddress(recipientStreetAddress);
    setSenderStreetAddress2(recipientStreetAddress2);
    setSenderPostalCode(recipientPostalCode);
    setSenderCity(recipientCity);
    setSenderCountry(recipientCountry);
    setSenderPhone(recipientPhone);
    setSenderEmail(recipientEmail);
    
    setRecipientName(tempName);
    setRecipientStreetAddress(tempStreet);
    setRecipientStreetAddress2(tempStreet2);
    setRecipientPostalCode(tempPostal);
    setRecipientCity(tempCity);
    setRecipientCountry(tempCountry);
    setRecipientPhone(tempPhone);
    setRecipientEmail(tempEmail);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === "details") {
      setCurrentStep("address");
    } else if (currentStep === "address") {
      setCurrentStep("contents");
    } else if (currentStep === "contents") {
      handleBookNow();
    }
  };
  
  const handleBack = () => {
    if (currentStep === "address") {
      setCurrentStep("details");
    } else if (currentStep === "contents") {
      setCurrentStep("address");
    }
  };

  const createTestBooking = () => {
    if (!isSignedIn || !user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to create a test booking.",
        variant: "destructive",
      });
      return;
    }

    setWeight("5");
    setLength("20");
    setWidth("15");
    setHeight("10");
    setSenderStreetAddress("Test Street 1");
    setSenderCity("Stockholm");
    setSenderCountry("SE");
    setSenderPostalCode("112 23");
    
    setRecipientStreetAddress("Test Street 2");
    setRecipientCity("Helsinki");
    setRecipientCountry("FI");
    setRecipientPostalCode("00341");
    
    setShowBookingConfirmation(true);
    handleBookNow();
  };

  const handleGenerateLabel = async () => {
    if (!bookingResult) return;
    
    const trackingCode = bookingResult.trackingCode;
    const shipmentId = bookingResult.shipmentId || "SHIP-" + Math.floor(Math.random() * 1000000);
    
    if (!trackingCode) {
      toast({
        title: "Error",
        description: "Unable to generate label: missing tracking code",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingLabel(true);
    
    try {
      const dimensions = `${length}x${width}x${height} cm`;
      const result = await generateLabel({
        shipmentId,
        carrierName: bookingResult.carrier?.name || "E-Parcel Nordic",
        trackingCode,
        senderAddress: `${senderStreetAddress}, ${senderCity}, ${senderCountry}`,
        recipientAddress: `${recipientStreetAddress}, ${recipientCity}, ${recipientCountry}`,
        packageDetails: {
          weight: weight,
          dimensions: dimensions
        },
        language: labelLanguage
      });
      
      if (result.success) {
        if (!bookingResult.labelUrl) {
          setBookingResult({
            ...bookingResult,
            labelUrl: result.labelUrl
          });
        }
        
        window.open(result.labelUrl, '_blank');
        
        toast({
          title: "Label Generated",
          description: `Label has been generated in ${labelLanguage === 'en' ? 'English' : 
                        labelLanguage === 'fi' ? 'Finnish' : 
                        labelLanguage === 'sv' ? 'Swedish' : 
                        labelLanguage === 'no' ? 'Norwegian' : 'Danish'}`,
        });
      } else {
        toast({
          title: "Label Generation Failed",
          description: result.message || "Unable to generate shipping label",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating label:", error);
      toast({
        title: "Label Generation Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingLabel(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center gap-4 mb-8">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep === "details" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          <span className="text-xs font-bold">1</span>
        </div>
        <h2 className="text-xl font-medium">{translateLabel("basicDetails", currentLanguage)}</h2>
        
        <div className="flex-1 flex items-center gap-4">
          <div className="flex-1 h-px bg-border"></div>
          
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep === "address" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            <span className="text-xs font-bold">2</span>
          </div>
          <span className={`text-sm ${currentStep === "address" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            {translateLabel("address", currentLanguage)}
          </span>
          
          <div className="flex-1 h-px bg-border"></div>
          
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep === "contents" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            <span className="text-xs font-bold">3</span>
          </div>
          <span className={`text-sm ${currentStep === "contents" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            {translateLabel("contentAndReferences", currentLanguage)}
          </span>
        </div>
      </div>
    );
  };

  if (showCustomerTypeSelection) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />

        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center mb-8">Select Customer Type</h1>
          
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleCustomerTypeSelect("business")}
            >
              <CardHeader className="flex flex-col items-center">
                <Briefcase className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Business</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  For registered businesses shipping commercial goods
                </p>
                <p className="text-sm font-medium text-primary">€9 base rate</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleCustomerTypeSelect("private")}
            >
              <CardHeader className="flex flex-col items-center">
                <User className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Private Customer</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  For individuals shipping personal items
                </p>
                <p className="text-sm font-medium text-primary">€10 base rate</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleCustomerTypeSelect("ecommerce")}
            >
              <CardHeader className="flex flex-col items-center">
                <ShoppingCart className="h-12 w-12 text-primary mb-2" />
                <CardTitle>E-commerce Business</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  For online retailers with regular shipments
                </p>
                <p className="text-sm font-medium text-primary">€8 base rate</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Booking Confirmed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h2 className="text-xl font-semibold text-green-800 mb-4">Your shipment is booked!</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Tracking Code</p>
                    <p className="text-lg font-mono font-medium">{bookingResult?.trackingCode}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Carrier</p>
                    <p className="text-lg font-medium">{bookingResult?.carrier?.name || carrier.name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Total Price</p>
                    <p className="text-lg font-medium">€{bookingResult?.totalPrice}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Estimated Delivery</p>
                    <p className="text-lg font-medium">{carrier.eta}</p>
                  </div>
                </div>
                
                <div className="mt-6 border-t border-green-200 pt-6">
                  <h3 className="font-medium mb-2">Shipping Label</h3>
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <LabelLanguageSelector 
                        value={labelLanguage}
                        onChange={setLabelLanguage}
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleGenerateLabel}
                      disabled={isGeneratingLabel}
                    >
                      <Download className="h-4 w-4" />
                      {isGeneratingLabel ? "Generating..." : "Generate & Download Label"}
                    </Button>
                  </div>
                </div>
              </div>
              
              {canCancelBooking && (
                <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
                  <h3 className="font-medium text-amber-800 mb-2">Need to cancel?</h3>
                  <p className="text-sm text-amber-700 mb-4">
                    You can cancel this booking until:
                    <span className="font-medium block">
                      {new Date(bookingResult?.cancellationDeadline || '').toLocaleString()}
                    </span>
                  </p>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleCancelBooking}
                  >
                    Cancel Booking
                  </Button>
                </div>
              )}
              
              <div className="flex justify-between gap-4 pt-4">
                <Button
                  variant="outline"
                  asChild
                >
                  <Link to="/dashboard">View All Shipments</Link>
                </Button>
                <Button
                  onClick={()={() => {
                    setBookingConfirmed(false);
                    setBookingResult(null);
                    localStorage.removeItem('lastBooking');
                    navigate('/shipment');
                  }}
                >
                  Book Another Shipment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Package details screen
  if (currentStep === "details") {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
  
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            {renderStepIndicator()}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <div className="border rounded-lg">
                  <div className="bg-slate-700 text-white p-3 font-semibold">
                    {translateLabel("package", currentLanguage)}
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                      <div>
                        <Label htmlFor="quantity" className="block mb-2">Antal</Label>
                        <div className="relative">
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="text-center"
                          />
                          <div className="absolute inset-y-0 right-0 flex flex-col">
                            <button 
                              type="button" 
                              className="flex-1 px-2 bg-slate-100 border-l border-b border-input hover:bg-slate-200"
                              onClick={() => setQuantity((parseInt(quantity) + 1).toString())}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M5 12L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <button 
                              type="button" 
                              className="flex-1 px-2 bg-slate-100 border-l border-input hover:bg-slate-200"
                              onClick={() => setQuantity(Math.max(1, parseInt(quantity) - 1).toString())}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="packageType" className="block mb-2">Vad skickar du</Label>
                        <div className="relative">
                          <select
                            id="packageType"
                            className="w-full h-10 pl-3 pr-10 rounded-md border border-input bg-background appearance-none"
                            value={packageType}
                            onChange={(e) => setPackageType(e.target.value)}
                          >
                            <option value="package">Paket</option>
                            <option value="document">Dokument</option>
                            <option value="pallet">Pall</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="length" className="block mb-2">Längd</Label>
                        <Input
                          id="length"
                          type="number"
                          min="1"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          postfix="cm"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="width" className="block mb-2">Bredd</Label>
                        <Input
                          id="width"
                          type="number"
                          min="1"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          postfix="cm"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="height" className="block mb-2">Höjd</Label>
                        <Input
                          id="height"
                          type="number"
                          min="1"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          postfix="cm"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="weight" className="block mb-2">Vikt</Label>
                        <Input
                          id="weight"
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          postfix="kg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-lg border mb-8">
                <h3 className="text-lg font-medium mb-4">{translateLabel("summary", currentLanguage)}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-200 p-3 rounded-md">
                      <MapPin className="h-5 w-5 text-slate-700" />
                    </div>
                    
                    <div>
                      <p className="font-medium">{translateLabel("from", currentLanguage)}</p>
                      <p>{senderPostalCode}</p>
                      <p>{senderCity}</p>
                      <p>{getCountryName(senderCountry)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-200 p-3 rounded-md">
                      <MapPin className="h-5 w-5 text-slate-700" />
                    </div>
                    
                    <div>
                      <p className="font-medium">{translateLabel("to", currentLanguage)}</p>
                      <p>{recipientPostalCode}</p>
                      <p>{recipientCity}</p>
                      <p>{getCountryName(recipientCountry)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-200 p-3 rounded-md">
                      <Package className="h-5 w-5 text-slate-700" />
                    </div>
                    
                    <div>
                      <p className="font-medium">{translateLabel("package", currentLanguage)}</p>
                      <p>
                        {quantity}x{packageType === "package" ? "Paket" : 
                        packageType === "document" ? "Dokument" : "Pall"}
                      </p>
                      <p>{length}x{width}x{height} cm</p>
                      <p>{weight} kg</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <Button
                  type="submit"
                  disabled={isBooking}
                >
                  {translateLabel("continue", currentLanguage)}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  // Address screen
  if (currentStep === "address") {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
  
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            {renderStepIndicator()}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* From Panel */}
                <div className="border rounded-md">
                  <div className="bg-slate-700 text-white p-3 font-semibold">
                    {translateLabel("from", currentLanguage)}
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="senderName" className="flex items-center">
                        {translateLabel("sender", currentLanguage)}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="senderName"
                        placeholder=""
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderStreetAddress" className="flex items-center">
                        {translateLabel("streetAddress", currentLanguage)}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="senderStreetAddress"
                        placeholder=""
                        value={senderStreetAddress}
                        onChange={(e) => setSenderStreetAddress(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderStreetAddress2">
                        {translateLabel("streetAddress2", currentLanguage)}
                      </Label>
                      <Input
                        id="senderStreetAddress2"
                        placeholder=""
                        value={senderStreetAddress2}
                        onChange={(e) => setSenderStreetAddress2(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderPostalCode" className="flex items-center">
                        {translateLabel("postalCode", currentLanguage)}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="senderPostalCode"
                        placeholder=""
                        value={senderPostalCode}
                        onChange={(e) => setSenderPostalCode(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderCity" className="flex items-center">
                        {translateLabel("city", currentLanguage)}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="senderCity"
                        placeholder=""
                        value={senderCity}
                        onChange={(e) => setSenderCity(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderCountry" className="flex items-center">
                        {translateLabel("country", currentLanguage)}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <select
                          id="senderCountry"
                          className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background appearance-none cursor-pointer"
                          value={senderCountry}
                          onChange={(e
