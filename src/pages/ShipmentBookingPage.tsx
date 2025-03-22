
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
import { Briefcase, Download, Package, ShoppingCart, Truck, User } from "lucide-react";
import { getBookingByTrackingCode } from "@/services/bookingDb";
import LabelLanguageSelector from "@/components/labels/LabelLanguageSelector";
import { generateLabel } from "@/services/labelService";
import { getCountryFlag, getCountryName } from "@/lib/utils";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

// Comment out the customer type
// type CustomerType = "business" | "private" | "ecommerce" | null;

interface ShipmentBookingPageProps {
  // customerType?: CustomerType;
}

const ShipmentBookingPage = (/* { customerType } */: ShipmentBookingPageProps) => {
  const { isSignedIn, user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [weight, setWeight] = useState("5");
  const [length, setLength] = useState("20");
  const [width, setWidth] = useState("15");
  const [height, setHeight] = useState("10");
  const [pickup, setPickup] = useState("Stockholm, SE");
  const [pickupPostalCode, setPickupPostalCode] = useState("112 23");
  const [delivery, setDelivery] = useState("Helsinki, FI");
  const [deliveryPostalCode, setDeliveryPostalCode] = useState("00341");
  const [deliverySpeed, setDeliverySpeed] = useState("standard");
  const [compliance, setCompliance] = useState(false);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  // Comment out customer type related state
  // const [selectedCustomerType, setSelectedCustomerType] = useState<CustomerType>(customerType || null);
  // const [businessName, setBusinessName] = useState("");
  // const [vatNumber, setVatNumber] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [canCancelBooking, setCanCancelBooking] = useState(false);
  const [labelLanguage, setLabelLanguage] = useState("en");
  const [isGeneratingLabel, setIsGeneratingLabel] = useState(false);
  const [pickupCountry, setPickupCountry] = useState("SE");
  const [deliveryCountry, setDeliveryCountry] = useState("FI");
  const [packageType, setPackageType] = useState("package");
  const [quantity, setQuantity] = useState("1");
  const [currentStep, setCurrentStep] = useState(1);
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  
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

  // Comment out customer type selection check
  // const showCustomerTypeSelection = !selectedCustomerType && location.pathname === "/shipment";

  // Comment out useEffect for customer type
  /*
  useEffect(() => {
    if (customerType) {
      setSelectedCustomerType(customerType);
    }
  }, [customerType]);
  */

  // Fixed carrier price (no customer type differentiation)
  const carrier = {
    id: 1,
    name: "E-Parcel Nordic",
    price: 10,
    eta: "3 days",
    icon: "📦"
  };

  // Comment out customer type selection handling
  /*
  const handleCustomerTypeSelect = (type: CustomerType) => {
    if (type) {
      navigate(`/shipment/${type}`);
    }
  };
  */
  
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
        pickup: {
          name: senderName,
          address: senderAddress,
          postalCode: pickupPostalCode,
          city: "Stockholm",
          country: pickupCountry,
          phone: senderPhone,
          email: senderEmail
        },
        delivery: {
          name: recipientName,
          address: recipientAddress,
          postalCode: deliveryPostalCode,
          city: "Helsinki",
          country: deliveryCountry,
          phone: recipientPhone,
          email: recipientEmail
        },
        carrier: { name: carrier.name, price: carrier.price },
        deliverySpeed,
        includeCompliance: compliance,
        userId: user.id,
        customerType: "standard", // Use a default customer type
        // businessName: selectedCustomerType === "business" || selectedCustomerType === "ecommerce" ? businessName : undefined,
        // vatNumber: selectedCustomerType === "business" ? vatNumber : undefined,
        pickupSlotId: "slot-1" // Default slot
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
    const tempPickup = pickup;
    const tempPickupPostal = pickupPostalCode;
    const tempPickupCountry = pickupCountry;
    
    setPickup(delivery);
    setPickupPostalCode(deliveryPostalCode);
    setPickupCountry(deliveryCountry);
    
    setDelivery(tempPickup);
    setDeliveryPostalCode(tempPickupPostal);
    setDeliveryCountry(tempPickupCountry);
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleBookNow();
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
    setPickup("Stockholm, SE");
    setDelivery("Helsinki, FI");
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
        senderAddress: pickup,
        recipientAddress: delivery,
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

  // Remove customer type selection UI section
  /*
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
  */

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

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              <span className="text-xs font-bold">1</span>
            </div>
            <h2 className={`text-sm ${currentStep >= 1 ? 'font-medium' : 'text-muted-foreground'}`}>Grundläggande detaljer</h2>
            
            <div className="flex-1 flex items-center gap-4">
              <div className="flex-1 h-px bg-border"></div>
              
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                <span className="text-xs font-bold">2</span>
              </div>
              <span className={`text-sm ${currentStep >= 2 ? 'font-medium' : 'text-muted-foreground'}`}>Välj tjänst</span>
              
              <div className="flex-1 h-px bg-border"></div>
              
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                <span className="text-xs font-bold">3</span>
              </div>
              <span className={`text-sm ${currentStep >= 3 ? 'font-medium' : 'text-muted-foreground'}`}>Adress</span>
              
              <div className="flex-1 h-px bg-border"></div>
              
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                <span className="text-xs font-bold">4</span>
              </div>
              <span className={`text-sm ${currentStep >= 4 ? 'font-medium' : 'text-muted-foreground'}`}>Innehåll och referens</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div>
                <ResizablePanelGroup direction="horizontal" className="min-h-[200px] rounded-lg border mb-8">
                  <ResizablePanel defaultSize={50}>
                    <div className="p-0">
                      <div className="bg-slate-700 text-white p-3 font-semibold">
                        Från
                      </div>
                      
                      <div className="p-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="fromCountry">Land</Label>
                          <div className="relative">
                            <select
                              id="fromCountry"
                              className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background appearance-none cursor-pointer"
                              value={pickupCountry}
                              onChange={(e) => setPickupCountry(e.target.value)}
                            >
                              <option value="SE">Sverige</option>
                              <option value="FI">Finland</option>
                              <option value="NO">Norge</option>
                              <option value="DK">Danmark</option>
                            </select>
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                              {getCountryFlag(pickupCountry)}
                            </div>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="fromPostal">Postnummer</Label>
                          <Input
                            id="fromPostal"
                            placeholder="Enter postal code"
                            value={pickupPostalCode}
                            onChange={(e) => setPickupPostalCode(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            {pickupPostalCode}, Stockholm
                          </p>
                        </div>
                        
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="fromCompany"
                              name="fromType"
                              className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="fromCompany">Företag</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="fromPrivate"
                              name="fromType"
                              className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                              defaultChecked
                            />
                            <Label htmlFor="fromPrivate">Privatperson</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ResizablePanel>
                  
                  <ResizableHandle withHandle>
                    <div 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-200 hover:bg-slate-300 cursor-pointer z-10"
                      onClick={handleSwapLocations}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 16L3 12M3 12L7 8M3 12H21M17 8L21 12M21 12L17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </ResizableHandle>
                  
                  <ResizablePanel defaultSize={50}>
                    <div className="p-0">
                      <div className="bg-slate-700 text-white p-3 font-semibold">
                        Till
                      </div>
                      
                      <div className="p-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="toCountry">Land</Label>
                          <div className="relative">
                            <select
                              id="toCountry"
                              className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background appearance-none cursor-pointer"
                              value={deliveryCountry}
                              onChange={(e) => setDeliveryCountry(e.target.value)}
                            >
                              <option value="SE">Sverige</option>
                              <option value="FI">Finland</option>
                              <option value="NO">Norge</option>
                              <option value="DK">Danmark</option>
                            </select>
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                              {getCountryFlag(deliveryCountry)}
                            </div>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="toPostal">Postnummer</Label>
                          <Input
                            id="toPostal"
                            placeholder="Enter postal code"
                            value={deliveryPostalCode}
                            onChange={(e) => setDeliveryPostalCode(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            {deliveryPostalCode}, Helsinki
                          </p>
                        </div>
                        
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="toCompany"
                              name="toType"
                              className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="toCompany">Företag</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="toPrivate"
                              name="toType"
                              className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                              defaultChecked
                            />
                            <Label htmlFor="toPrivate">Privatperson</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={handleNextStep}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div>
                {/* Package details component would go here */}
                <div className="border rounded-lg">
                  <div className="bg-slate-700 text-white p-3 font-semibold">
                    Ange sändningsdetaljer
                  </div>
                  
                  <div className="p-6">
                    {/* Package type selection would go here */}
                    <div className="flex justify-between gap-4 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePreviousStep}
                      >
                        Previous
                      </Button>
                      
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div>
                <div className="border rounded-lg mb-8">
                  <div className="bg-slate-700 text-white p-3 font-semibold">
                    Avsändare
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="senderName">Namn</Label>
                        <Input
                          id="senderName"
                          placeholder="Avsändarens namn"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="senderPhone">Telefon</Label>
                        <Input
                          id="senderPhone"
                          placeholder="Telefonnummer"
                          value={senderPhone}
                          onChange={(e) => setSenderPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderEmail">E-post</Label>
                      <Input
                        id="senderEmail"
                        type="email"
                        placeholder="E-postadress"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderAddress">Adress</Label>
                      <Input
                        id="senderAddress"
                        placeholder="Gatunamn, husnummer"
                        value={senderAddress}
                        onChange={(e) => setSenderAddress(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg mb-8">
                  <div className="bg-slate-700 text-white p-3 font-semibold">
                    Mottagare
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipientName">Namn</Label>
                        <Input
                          id="recipientName"
                          placeholder="Mottagarens namn"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="recipientPhone">Telefon</Label>
                        <Input
                          id="recipientPhone"
                          placeholder="Telefonnummer"
                          value={recipientPhone}
                          onChange={(e) => setRecipientPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recipientEmail">E-post</Label>
                      <Input
                        id="recipientEmail"
                        type="email"
                        placeholder="E-postadress"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recipientAddress">Adress</Label>
                      <Input
                        id="recipientAddress"
                        placeholder="Gatunamn, husnummer"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-lg border mb-8">
                  <h3 className="text-lg font-medium mb-4">Sammanfattning</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-slate-500">Från</h4>
                      <div className="bg-white p-3 rounded border">
                        <p className="font-medium">{senderName}</p>
                        <p>{senderAddress}</p>
                        <p>{pickupPostalCode}, Stockholm</p>
                        <p>{getCountryName(pickupCountry)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-slate-500">Till</h4>
                      <div className="bg-white p-3 rounded border">
                        <p className="font-medium">{recipientName}</p>
                        <p>{recipientAddress}</p>
                        <p>{deliveryPostalCode}, Helsinki</p>
                        <p>{getCountryName(deliveryCountry)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between gap-4 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePreviousStep}
                    >
                      Previous
                    </Button>
                    
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 4 && (
              <div>
                <div className="border rounded-lg mb-8">
                  <div className="bg-slate-700 text-white p-3 font-semibold">
                    Slutför bokning
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4">Packetets detaljer</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="packageType">Pakettyp</Label>
                            <select
                              id="packageType"
                              className="w-full h-10 px-3 rounded-md border border-input bg-background"
                              value={packageType}
                              onChange={(e) => setPackageType(e.target.value)}
                            >
                              <option value="package">Paket</option>
                              <option value="document">Dokument</option>
                              <option value="pallet">Pall</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="weight">Vikt (kg)</Label>
                            <Input
                              id="weight"
                              type="number"
                              min="0"
                              step="0.1"
                              placeholder="Vikt i kg"
                              value={weight}
                              onChange={(e) => setWeight(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Dimensioner (cm)</Label>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <Label htmlFor="length" className="text-xs">Längd</Label>
                                <Input
                                  id="length"
                                  type="number"
                                  min="0"
                                  value={length}
                                  onChange={(e) => setLength(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="width" className="text-xs">Bredd</Label>
                                <Input
                                  id="width"
                                  type="number"
                                  min="0"
                                  value={width}
                                  onChange={(e) => setWidth(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="height" className="text-xs">Höjd</Label>
                                <Input
                                  id="height"
                                  type="number"
                                  min="0"
                                  value={height}
                                  onChange={(e) => setHeight(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="quantity">Antal</Label>
                            <Input
                              id="quantity"
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4">Leverans och Service</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Leveranstid</Label>
                          <RadioGroup
                            value={deliverySpeed}
                            onValueChange={setDeliverySpeed}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="economy" id="economy" />
                              <Label htmlFor="economy" className="font-normal">Ekonomi (4-5 arbetsdagar) - €8</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="standard" id="standard" />
                              <Label htmlFor="standard" className="font-normal">Standard (2-3 arbetsdagar) - €10</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="express" id="express" />
                              <Label htmlFor="express" className="font-normal">Express (1-2 arbetsdagar) - €15</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox
                            id="compliance"
                            checked={compliance}
                            onCheckedChange={(checked) => setCompliance(checked as boolean)}
                          />
                          <Label htmlFor="compliance" className="font-normal text-sm">
                            Lägg till efterlevnadstjänst (+€2) - Hjälper dig med tullrelaterade dokument
                          </Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg border">
                      <h3 className="font-medium mb-3">Sammanfattning av kostnad</h3>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span>Grundavgift ({carrier.name})</span>
                          <span>€{carrier.price}</span>
                        </div>
                        {deliverySpeed === "express" && (
                          <div className="flex justify-between">
                            <span>Expressleverans</span>
                            <span>+€5</span>
                          </div>
                        )}
                        {compliance && (
                          <div className="flex justify-between">
                            <span>Efterlevnadstjänst</span>
                            <span>+€2</span>
                          </div>
                        )}
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Totalt</span>
                          <span>€{
                            carrier.price +
                            (deliverySpeed === "express" ? 5 : 0) +
                            (compliance ? 2 : 0)
                          }</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between gap-4 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePreviousStep}
                      >
                        Previous
                      </Button>
                      
                      <Button
                        type="submit"
                        disabled={isBooking}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isBooking ? "Processing..." : "Book Shipment"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShipmentBookingPage;
