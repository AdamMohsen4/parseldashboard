
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
import { Briefcase, Calendar, Download, Package, ShoppingCart, Truck, User } from "lucide-react";
import { getBookingByTrackingCode } from "@/services/bookingDb";
import LabelLanguageSelector from "@/components/labels/LabelLanguageSelector";
import { generateLabel } from "@/services/labelService";
import { getCountryFlag, getCountryName } from "@/lib/utils";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import ShipmentVolume from "@/components/booking/ShipmentVolume";
import PriceCalendarView from "@/components/pricing/PriceCalendarView";
import { DateRange, PricingDay, generateMockPricingData } from "@/utils/pricingUtils";
import { addDays, format, isAfter, isBefore, startOfMonth } from "date-fns";

type CustomerType = "business" | "private" | "ecommerce" | null;
type DeliveryOption = "fast" | "cheap" | null;

interface ShipmentBookingPageProps {
  customerType?: CustomerType;
}

const ShipmentBookingPage = ({ customerType }: ShipmentBookingPageProps) => {
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
  const [selectedCustomerType, setSelectedCustomerType] = useState<CustomerType>(customerType || "private");
  const [businessName, setBusinessName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
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
  const [selectedVolume, setSelectedVolume] = useState("m");
  
  // New state for delivery options and calendar
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>(null);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [pricingData, setPricingData] = useState<PricingDay[]>([]);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);

  // Define date range for the calendar (next 30 days)
  const today = new Date();
  const dateRange: DateRange = {
    start: today,
    end: addDays(today, 30)
  };
  
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

  // Load pricing data when delivery option changes or current month changes
  useEffect(() => {
    if (deliveryOption === 'cheap') {
      setIsCalendarLoading(true);
      // Generate mock pricing data
      setTimeout(() => {
        const data = generateMockPricingData(currentMonth, dateRange);
        setPricingData(data);
        setIsCalendarLoading(false);
      }, 800);
    }
  }, [deliveryOption, currentMonth]);

  const getCarrierPrice = () => {
    // Price based on selected volume
    switch (selectedVolume) {
      case 'xxs': return 5.90;
      case 's': return 7.90;
      case 'm': return 9.90;
      case 'l': return 11.90;
      case 'xl': return 19.90;
      case 'xxl': return 39.90;
      default: return 9.90;
    }
  };

  const carrier = {
    id: 1,
    name: "E-Parcel Nordic",
    price: getCarrierPrice(),
    eta: "3 days",
    icon: "📦"
  };

  const handleBookNow = async () => {
    if (!isSignedIn || !user) {
      document.querySelector<HTMLButtonElement>("button.cl-userButtonTrigger")?.click();
      return;
    }

    // Validate delivery date when cheap delivery is selected
    if (deliveryOption === 'cheap' && !selectedDeliveryDate) {
      toast({
        title: "Select Delivery Date",
        description: "Please select a delivery date from the calendar",
        variant: "destructive",
      });
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
        customerType: selectedCustomerType || "private",
        businessName: selectedCustomerType === "business" || selectedCustomerType === "ecommerce" ? businessName : undefined,
        vatNumber: selectedCustomerType === "business" ? vatNumber : undefined,
        pickupSlotId: "slot-1", // Default slot
        poolingEnabled: deliveryOption === 'cheap',
        deliveryDate: selectedDeliveryDate ? selectedDeliveryDate.toISOString() : undefined
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

    // setWeight("5");
    // setLength("20");
    // setWidth("15");
    // setHeight("10");
    // setPickup("Stockholm, SE");
    // setDelivery("Helsinki, FI");
    // setShowBookingConfirmation(true);
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
        carrierName: bookingResult.carrier_name || "E-Parcel",
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

  const isValidDeliveryDate = (date: Date): boolean => {
    // Make sure the date is after today and within the date range
    return isAfter(date, today) && isBefore(date, dateRange.end);
  };

  const handleDeliveryDateSelect = (date: Date) => {
    if (isValidDeliveryDate(date)) {
      setSelectedDeliveryDate(date);
    }
  };

  // Check if a date is a low-cost delivery date
  const isLowCostDeliveryDate = (date: Date): boolean => {
    const dayPricing = pricingData.find(d => 
      d.date.getDate() === date.getDate() && 
      d.date.getMonth() === date.getMonth() && 
      d.date.getFullYear() === date.getFullYear()
    );
    
    return dayPricing?.loadFactor === 'low';
  };

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
                  {bookingResult?.poolingEnabled && bookingResult?.deliveryDate && (
                    <div className="space-y-2 col-span-2">
                      <p className="text-sm font-medium text-gray-500">Scheduled Delivery Date</p>
                      <p className="text-lg font-medium">{new Date(bookingResult.deliveryDate).toLocaleDateString()}</p>
                      <p className="text-sm text-green-600">
                        <span className="inline-flex items-center">
                          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 10L12 14L8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Low-cost shipping date selected
                        </span>
                      </p>
                    </div>
                  )}
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

                {/* Delivery options */}
                <div className="border rounded-lg mb-8">
                  <div className="bg-slate-700 text-white p-3 font-semibold">
                    Leverans Alternativ
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div 
                          className={`border rounded-md p-4 cursor-pointer transition-all ${deliveryOption === 'fast' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:border-primary/50'}`}
                          onClick={() => setDeliveryOption('fast')}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryOption === 'fast' ? 'border-primary' : 'border-gray-300'}`}>
                              {deliveryOption === 'fast' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                            </div>
                            <h3 className="font-medium text-lg">Fast Delivery</h3>
                          </div>
                          <div className="pl-8">
                            <p className="text-sm text-gray-600">Standard leveranstid, leverans inom 3-5 arbetsdagar.</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Truck className="h-4 w-4 text-primary" />
                              <span className="text-sm font-semibold">Snabb och pålitlig</span>
                            </div>
                          </div>
                        </div>
                        
                        <div 
                          className={`border rounded-md p-4 cursor-pointer transition-all ${deliveryOption === 'cheap' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:border-primary/50'}`}
                          onClick={() => setDeliveryOption('cheap')}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryOption === 'cheap' ? 'border-primary' : 'border-gray-300'}`}>
                              {deliveryOption === 'cheap' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                            </div>
                            <h3 className="font-medium text-lg">Cheap Delivery</h3>
                          </div>
                          <div className="pl-8">
                            <p className="text-sm text-gray-600">Miljövänlig och billigare leverans. Välj ett datum som passar dig.</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Calendar className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-semibold text-green-600">Spara pengar och miljön</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {deliveryOption === 'cheap' && (
                        <div className="mt-4">
                          <div className="border-t pt-4">
                            <h3 className="font-medium mb-3">Välj ett leveransdatum (gröna dagar är billigare)</h3>
                            <div className="bg-white rounded-lg border p-1">
                              <PriceCalendarView
                                currentMonth={currentMonth}
                                setCurrentMonth={setCurrentMonth}
                                pricingData={pricingData}
                                selectedDate={selectedDeliveryDate}
                                onSelectDate={handleDeliveryDateSelect}
                                isLoading={isCalendarLoading}
                              />
                            </div>
                            {selectedDeliveryDate && (
                              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                                <p className="text-sm font-medium">
                                  Valt leveransdatum: {format(selectedDeliveryDate, 'yyyy-MM-dd')}
                                  {isLowCostDeliveryDate(selectedDeliveryDate) && (
                                    <span className="ml-2 text-green-600">(Lågpris dag - 15% rabatt)</span>
                                  )}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button 
                    type="button"
                    variant="outline"
                    disabled={currentStep === 1}
                    onClick={handlePreviousStep}
                  >
                    Tillbaka
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleNextStep}
                    disabled={!deliveryOption || (deliveryOption === 'cheap' && !selectedDeliveryDate)}
                  >
                    Nästa
                  </Button>
                </div>
              </div>
            )}
            
            {/* Additional steps would go here */}
            {currentStep === 2 && (
              <div>
                {/* Step 2 content */}
                <div className="flex justify-between mt-8">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handlePreviousStep}
                  >
                    Tillbaka
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleNextStep}
                  >
                    Nästa
                  </Button>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div>
                {/* Step 3 content */}
                <div className="flex justify-between mt-8">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handlePreviousStep}
                  >
                    Tillbaka
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleNextStep}
                  >
                    Nästa
                  </Button>
                </div>
              </div>
            )}
            
            {currentStep === 4 && (
              <div>
                {/* Step 4 content */}
                <div className="flex justify-between mt-8">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handlePreviousStep}
                  >
                    Tillbaka
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isBooking}
                  >
                    {isBooking ? "Processing..." : "Boka Nu"}
                  </Button>
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
