
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavBar from "@/components/layout/NavBar";
import { useUser } from "@clerk/clerk-react";
import { bookShipment, cancelBooking } from "@/services/bookingService";
import GooglePlacesAutocomplete from "@/components/inputs/GooglePlacesAutocomplete";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Briefcase, 
  Download, 
  MapPin, 
  Package, 
  Plus, 
  ShoppingCart, 
  Truck, 
  User 
} from "lucide-react";
import { getBookingByTrackingCode } from "@/services/bookingDb";
import LabelLanguageSelector from "@/components/labels/LabelLanguageSelector";
import { generateLabel } from "@/services/labelService";
import { 
  getCountryFlag, 
  getCountryName, 
  formatPostalCode, 
  getCountryDialCode, 
  translateLabel 
} from "@/lib/utils";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useTranslation } from "react-i18next";

type CustomerType = "business" | "private" | "ecommerce" | null;
type CurrentStep = "details" | "address" | "contents" | "summary";

interface ShipmentBookingPageProps {
  customerType?: CustomerType;
}

const ShipmentBookingPage = ({ customerType }: ShipmentBookingPageProps) => {
  const { isSignedIn, user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  
  // Booking flow state
  const [currentStep, setCurrentStep] = useState<CurrentStep>("details");
  
  // Package details
  const [weight, setWeight] = useState("5");
  const [length, setLength] = useState("20");
  const [width, setWidth] = useState("15");
  const [height, setHeight] = useState("10");
  const [packageType, setPackageType] = useState("package");
  const [quantity, setQuantity] = useState("1");
  
  // Sender information
  const [senderName, setSenderName] = useState("");
  const [senderStreetAddress, setSenderStreetAddress] = useState("");
  const [senderStreetAddress2, setSenderStreetAddress2] = useState("");
  const [senderPostalCode, setSenderPostalCode] = useState("112 23");
  const [senderCity, setSenderCity] = useState("Stockholm");
  const [senderCountry, setSenderCountry] = useState("SE");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderPersonalId, setSenderPersonalId] = useState("");
  
  // Recipient information
  const [recipientName, setRecipientName] = useState("");
  const [recipientStreetAddress, setRecipientStreetAddress] = useState("");
  const [recipientStreetAddress2, setRecipientStreetAddress2] = useState("");
  const [recipientPostalCode, setRecipientPostalCode] = useState("00341");
  const [recipientCity, setRecipientCity] = useState("HELSINKI");
  const [recipientCountry, setRecipientCountry] = useState("FI");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  
  // Service options
  const [deliverySpeed, setDeliverySpeed] = useState("standard");
  const [compliance, setCompliance] = useState(false);
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  
  // Booking state
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [selectedCustomerType, setSelectedCustomerType] = useState<CustomerType>(customerType || null);
  const [businessName, setBusinessName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [canCancelBooking, setCanCancelBooking] = useState(false);
  const [labelLanguage, setLabelLanguage] = useState("en");
  const [isGeneratingLabel, setIsGeneratingLabel] = useState(false);
  
  useEffect(() => {
    const checkSavedBooking = async () => {
      if (isSignedIn && user) {
        const savedBookingInfo = localStorage.getItem('lastBooking');
        
        if (savedBookingInfo) {
          const { trackingCode, timestamp } = JSON.parse(savedBookingInfo);
          
          const bookingData = await getBookingByTrackingCode(trackingCode, user.id);
          
          if (bookingData) {
            setBookingResult(bookingData);
            setBookingConfirmed(true);
            
            const cancellationDeadline = new Date(bookingData.cancellation_deadline);
            const now = new Date();
            
            if (now < cancellationDeadline) {
              setCanCancelBooking(true);
            } else {
              localStorage.removeItem('lastBooking');
              setCanCancelBooking(false);
            }
          } else {
            localStorage.removeItem('lastBooking');
          }
        }
      }
    };
    
    checkSavedBooking();
  }, [isSignedIn, user]);

  const showCustomerTypeSelection = !selectedCustomerType && location.pathname === "/shipment";

  useEffect(() => {
    if (customerType) {
      setSelectedCustomerType(customerType);
    }
  }, [customerType]);

  const getCarrierPrice = () => {
    switch (selectedCustomerType) {
      case "business": return 9;
      case "ecommerce": return 8;
      default: return 10;
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
    if (!bookingResult?.trackingCode && !bookingResult?.tracking_code) return;
    
    const trackingCode = bookingResult.trackingCode || bookingResult.tracking_code;
    
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
    
    const trackingCode = bookingResult.trackingCode || bookingResult.tracking_code;
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
        carrierName: bookingResult.carrier_name || "E-Parcel Nordic",
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
                    <p className="text-lg font-mono font-medium">{bookingResult?.trackingCode || bookingResult?.tracking_code}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Carrier</p>
                    <p className="text-lg font-medium">{bookingResult?.carrier_name || carrier.name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Total Price</p>
                    <p className="text-lg font-medium">€{bookingResult?.totalPrice || bookingResult?.total_price}</p>
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
                      {new Date(bookingResult.cancellationDeadline || bookingResult.cancellation_deadline).toLocaleString()}
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
                  onClick={() => {
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
                          onChange={(e) => setSenderCountry(e.target.value)}
                          required
                        >
                          <option value="SE">Sverige</option>
                          <option value="FI">Finland</option>
                          <option value="NO">Norge</option>
                          <option value="DK">Danmark</option>
                        </select>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          {getCountryFlag(senderCountry)}
                        </div>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderPhone" className="flex items-center">
                        {translateLabel("phoneNumber", currentLanguage)}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="senderPhone"
                        placeholder=""
                        prefix={getCountryDialCode(senderCountry)}
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderEmail" className="flex items-center">
                        {translateLabel("email", currentLanguage)}
                      </Label>
                      <Input
                        id="senderEmail"
                        type="email"
                        placeholder=""
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderPersonalId" className="flex items-center">
                        {translateLabel("personalId", currentLanguage)}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="senderPersonalId"
                        placeholder=""
                        value={senderPersonalId}
                        onChange={(e) => setSenderPersonalId(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* To Panel */}
                <div className="border rounded-md relative">
                  <button 
                    type="button"
                    className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-0 z-10 bg-white rounded-full p-2 border border-slate-200 hover:bg-slate-50"
                    onClick={handleSwapLocations}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 16L3 12M3 12L7 8M3 12H21M17 8L21 12M21 12L17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  <div className="bg-slate-700 text-white p-3 font-semibold">
                    {translateLabel("to", currentLanguage)}
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientName" className="flex items-center">
                        {translateLabel("recipient", currentLanguage)}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="recipientName"
                        placeholder=""
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recipientStreetAddress" className="flex items-center">
                        {translateLabel("streetAddress", currentLanguage)}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="recipientStreetAddress"
                        placeholder=""
                        value={recipientStreetAddress}
                        onChange={(e) => setRecipientStreetAddress(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recipientStreetAddress2">
                        {translateLabel("streetAddress2", currentLanguage)}
                      </Label>
                      <Input
                        id="recipientStreetAddress2"
                        placeholder=""
                        value={recipientStreetAddress2}
                        onChange={(e) => setRecipientStreetAddress2(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recipientPostalCode" className="flex items-center">
                        {translateLabel("postalCode", currentLanguage)}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="recipientPostalCode"
                        placeholder=""
                        value={recipientPostalCode}
                        onChange={(e) => setRecipientPostalCode(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recipientCity" className="flex items-center">
                        {translateLabel("city", currentLanguage)}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="recipientCity"
                        placeholder=""
                        value={recipientCity}
                        onChange={(e) => setRecipientCity(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recipientCountry" className="flex items-center">
                        {translateLabel("country", currentLanguage)}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <select
                          id="recipientCountry"
                          className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background appearance-none cursor-pointer"
                          value={recipientCountry}
                          onChange={(e) => setRecipientCountry(e.target.value)}
                          required
                        >
                          <option value="SE">Sverige</option>
                          <option value="FI">Finland</option>
                          <option value="NO">Norge</option>
                          <option value="DK">Danmark</option>
                        </select>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          {getCountryFlag(recipientCountry)}
                        </div>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recipientPhone" className="flex items-center">
                        {translateLabel("phoneNumber", currentLanguage)}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="recipientPhone"
                        placeholder=""
                        prefix={getCountryDialCode(recipientCountry)}
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recipientEmail">
                        {translateLabel("email", currentLanguage)}
                      </Label>
                      <Input
                        id="recipientEmail"
                        type="email"
                        placeholder=""
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                      />
                    </div>
                    
                    {!recipientEmail && (
                      <p className="text-xs text-muted-foreground">
                        {translateLabel("recipientWillNotBeNotified", currentLanguage)}
                      </p>
                    )}
                  </div>
                </div>
<<<<<<< HEAD
              )}
            </div>
          </form>
        
=======
              </div>
              
              <div className="bg-slate-50 p-6 rounded-lg border mb-8">
                <h3 className="text-lg font-medium mb-4">{translateLabel("summary", currentLanguage)}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-200 p-2 rounded-md">
                      <MapPin className="h-4 w-4 text-slate-700" />
                    </div>
                    <div>
                      <p className="font-medium">{translateLabel("from", currentLanguage)}</p>
                      <p>{senderPostalCode}</p>
                      <p>{senderCity}</p>
                      <p>{getCountryName(senderCountry)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-200 p-2 rounded-md">
                      <MapPin className="h-4 w-4 text-slate-700" />
                    </div>
                    <div>
                      <p className="font-medium">{translateLabel("to", currentLanguage)}</p>
                      <p>{recipientPostalCode}</p>
                      <p>{recipientCity}</p>
                      <p>{getCountryName(recipientCountry)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-200 p-2 rounded-md">
                      <Package className="h-4 w-4 text-slate-700" />
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
              
              <div className="flex justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                >
                  {translateLabel("back", currentLanguage)}
                </Button>
                
                <Button
                  type="submit"
                  disabled={isBooking}
                >
                  {translateLabel("continue", currentLanguage)}
                </Button>
              </div>
            </form>
          </div>
>>>>>>> a27342d698890ce5aa3e533b1c376cb4d7250b5c
        </div>
      </div>
    );
  }
  
  // Contents and References screen (final step)
  if (currentStep === "contents") {
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
                    {translateLabel("contentAndReferences", currentLanguage)}
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div>
                      <Label htmlFor="additionalInstructions" className="block mb-2">
                        {translateLabel("additionalInfo", currentLanguage)}
                      </Label>
                      <textarea
                        id="additionalInstructions"
                        className="w-full p-3 rounded-md border border-input min-h-24 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={additionalInstructions}
                        onChange={(e) => setAdditionalInstructions(e.target.value)}
                      ></textarea>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-medium">{translateLabel("service", currentLanguage)}</h3>
                      
                      <div className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Truck className="h-5 w-5 text-primary" />
                            <div>
                              <h4 className="font-medium">DHL Parcel Connect</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-lg border mb-8">
                <h3 className="text-lg font-medium mb-4">{translateLabel("summary", currentLanguage)}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-200 p-2 rounded-md">
                      <MapPin className="h-4 w-4 text-slate-700" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{translateLabel("from", currentLanguage)}</p>
                      <p>{senderPostalCode}</p>
                      <p>{senderCity}</p>
                      <p>{getCountryName(senderCountry)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-200 p-2 rounded-md">
                      <MapPin className="h-4 w-4 text-slate-700" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{translateLabel("to", currentLanguage)}</p>
                      <p>{recipientPostalCode}</p>
                      <p>{recipientCity}</p>
                      <p>{getCountryName(recipientCountry)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-200 p-2 rounded-md">
                      <Package className="h-4 w-4 text-slate-700" />
                    </div>
                    <div className="text-sm">
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
                
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{translateLabel("priceExcludingVAT", currentLanguage)}</p>
                    <p className="font-medium">210.96 kr</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="font-medium">{translateLabel("vat", currentLanguage)}</p>
                    <p className="font-medium">52.74 kr</p>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-lg">
                    <p className="font-bold">{translateLabel("totalPrice", currentLanguage)}</p>
                    <p className="font-bold">263.70 kr</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                >
                  {translateLabel("back", currentLanguage)}
                </Button>
                
                <Button
                  type="submit"
                  disabled={isBooking}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isBooking ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {translateLabel("continue", currentLanguage)}...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      {translateLabel("continue", currentLanguage)}
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  // This should never happen
  return null;
};

export default ShipmentBookingPage;

