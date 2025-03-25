import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavBar from "@/components/layout/NavBar";
import { useUser } from "@clerk/clerk-react";
import { bookShipment, cancelBooking } from "@/services/bookingService";
import { Briefcase, Calendar, DollarSign, Download, Package, ShoppingCart, Truck, User, Zap } from "lucide-react";
import { getBookingByTrackingCode } from "@/services/bookingDb";
import { generateLabel } from "@/services/labelService";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
import BookingSteps from "@/components/booking/BookingSteps";
import LocationSelector from "@/components/booking/LocationSelector";
import DeliveryOptions from "@/components/booking/DeliveryOptions";
import AddressDetails from "@/components/booking/AddressDetails";
import { AddressDetails as AddressDetailsType } from "@/types/booking";
import BookingSummary from "@/components/booking/BookingSummary";
import PaymentForm from "@/components/booking/PaymentForm";
import PriceCalendarView from "@/components/priceCalendar/PriceCalendarView";
import { generateMockPricingData, DateRange } from "@/utils/pricingUtils";
import { addWeeks, startOfDay } from "date-fns";
import LabelGenerator from "@/components/labels/LabelGenerator";
import { trackShipment } from "@/services/shipmentService";
import { get } from "http";

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
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<DeliveryOption>(null);
  const [showPriceCalendar, setShowPriceCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [pricingData, setPricingData] = useState([]);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<Date | null>(null);
  
  const today = startOfDay(new Date());
  const threeWeeksFromNow = addWeeks(today, 3);
  
  const dateRange: DateRange = {
    start: today,
    end: threeWeeksFromNow
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

  useEffect(() => {
    if (showPriceCalendar) {
      loadPriceCalendarData();
    }
  }, [showPriceCalendar, currentMonth]);

  const loadPriceCalendarData = () => {
    setIsCalendarLoading(true);
    
    setTimeout(() => {
      const data = generateMockPricingData(currentMonth, dateRange);
      setPricingData(data);
      setIsCalendarLoading(false);
    }, 600);
  };

  const getCarrierPrice = () => {
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
    name: "",
    price: getCarrierPrice(),
    eta: "",
    icon: ""
  };

  const handleBookNow = async () => {
    if (currentStep < 4) {
      handleNextStep();
      return;
    }

    if (!isSignedIn || !user) {
      document.querySelector<HTMLButtonElement>("button.cl-userButtonTrigger")?.click();
      return;
    }

    setIsBooking(true);
    
    try {
      const pickupAddress: AddressDetailsType = {
        name: senderName,
        address: senderAddress,
        postalCode: pickupPostalCode,
        city: "Stockholm",
        country: pickupCountry,
        phone: senderPhone,
        email: senderEmail
      };

      const deliveryAddress: AddressDetailsType = {
        name: recipientName,
        address: recipientAddress,
        postalCode: deliveryPostalCode,
        city: "Helsinki",
        country: deliveryCountry,
        phone: recipientPhone,
        email: recipientEmail
      };
      
      const result = await bookShipment({
        weight,
        dimensions: { length, width, height },
        pickup: pickupAddress,
        delivery: deliveryAddress,
        carrier: { name: carrier.name, price: carrier.price },
        deliverySpeed,
        includeCompliance: compliance,
        userId: user.id,
        customerType: selectedCustomerType || "private",
        businessName: selectedCustomerType === "business" || selectedCustomerType === "ecommerce" ? businessName : undefined,
        vatNumber: selectedCustomerType === "business" ? vatNumber : undefined,
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
        
        toast.success(`Your shipment has been booked with tracking code: ${result.trackingCode}`);
      } else {
        toast.error(result.message || "There was a problem with your booking.");
      }
    } catch (error) {
      console.error("Error in booking flow:", error);
      toast.error("An unexpected error occurred.");
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
        
        toast.success("Your booking has been successfully cancelled.");
      } else {
        toast.error("Unable to cancel booking. Please try again or contact support.");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("An unexpected error occurred.");
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
    
    if (currentStep < 3) {
      handleNextStep();
    } else {
      handleBookNow();
    }
  };

  const handleGenerateLabel = async () => {
    if (!bookingResult) return;
    
    const trackingCode = bookingResult.trackingCode || bookingResult.tracking_code;
    const shipmentId = bookingResult.shipmentId || "SHIP-" + Math.floor(Math.random() * 1000000);
    
    if (!trackingCode) {
      toast.error("Unable to generate label: missing tracking code");
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
        
        const languageName = 
          labelLanguage === 'en' ? 'English' : 
          labelLanguage === 'fi' ? 'Finnish' : 
          labelLanguage === 'sv' ? 'Swedish' : 
          labelLanguage === 'no' ? 'Norwegian' : 'Danish';
        
        toast.success(`Label has been generated in ${languageName}`);
      } else {
        toast.error(result.message || "Unable to generate shipping label");
      }
    } catch (error) {
      console.error("Error generating label:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsGeneratingLabel(false);
    }
  };

  const handleDeliveryOptionSelect = (option: DeliveryOption) => {
    setSelectedDeliveryOption(option);
    
    if (option === 'fast') {
      setDeliverySpeed('express');
      setShowPriceCalendar(false);
      setSelectedDeliveryDate(null);
      // toast.success("Fast delivery selected - Your package will arrive in 1-2 business days");
    } else if (option === 'cheap') {
      setDeliverySpeed('economy');
      setShowPriceCalendar(true);
      // toast.success("Cheap delivery selected - Please choose a delivery date");
      loadPriceCalendarData();
    }
  };

  const handleDeliveryDateSelect = (date: Date) => {
    setSelectedDeliveryDate(date);
    // toast.success(`Delivery date selected: ${date.toLocaleDateString()}`);
  };

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <BookingConfirmation 
            bookingResult={bookingResult}
            carrier={carrier}
            canCancelBooking={canCancelBooking}
            labelLanguage={labelLanguage}
            setLabelLanguage={setLabelLanguage}
            isGeneratingLabel={isGeneratingLabel}
            handleGenerateLabel={handleGenerateLabel}
            handleCancelBooking={handleCancelBooking}
            onBookAnother={() => {
              setBookingConfirmed(false);
              setBookingResult(null);
              localStorage.removeItem('lastBooking');
              navigate('/shipment');
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <BookingSteps currentStep={currentStep} />
          
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div>
                <LocationSelector
                  pickupCountry={pickupCountry}
                  setPickupCountry={setPickupCountry}
                  pickupPostalCode={pickupPostalCode}
                  setPickupPostalCode={setPickupPostalCode}
                  deliveryCountry={deliveryCountry}
                  setDeliveryCountry={setDeliveryCountry}
                  deliveryPostalCode={deliveryPostalCode}
                  setDeliveryPostalCode={setDeliveryPostalCode}
                  onSwapLocations={handleSwapLocations}
                />
                
                <div className="mt-8 border rounded-lg shadow-sm">
                  <div className="bg-slate-700 text-white p-3 font-semibold">
                    Select Delivery Option
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleDeliveryOptionSelect('fast')}
                    type="button"
                    className={`h-20 text-left p-4 rounded-lg border transition-all duration-200 
                      ${selectedDeliveryOption === 'fast' ? ' text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  >
                    <div className="flex flex-col items-start space-y-1">
                      <span className="font-medium text-base">Fast Delivery</span>
                      <span className="text-sm text-black-600">Arrives in 2-4 business days</span>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleDeliveryOptionSelect('cheap')}
                    type="button"
                    className={`h-20 text-left p-4 rounded-lg border transition-all duration-200 
                      ${selectedDeliveryOption === 'cheap' ? 'text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  >
                    <div className="flex flex-col items-start space-y-1">
                      <span className="font-medium text-base">Cheap Delivery</span>
                      <span className="text-sm text-black-600">Save money by selecting a specific date</span>
                    </div>
                  </Button>
                </div>
                  
                  {showPriceCalendar && (
                    <div className="px-6 pb-6">
                      <div className="mt-4 mb-2 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                        <h3 className="font-medium">Select delivery date to get the best price</h3>
                      </div>
                      <div className="border rounded-lg shadow-sm bg-white">
                        <PriceCalendarView
                          currentMonth={currentMonth}
                          setCurrentMonth={setCurrentMonth}
                          pricingData={pricingData}
                          isLoading={isCalendarLoading}
                          dateRange={dateRange}
                          onDateSelect={handleDeliveryDateSelect}
                          selectedDate={selectedDeliveryDate}
                        />
                      </div>
                      {selectedDeliveryDate && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-blue-800">
                            <span className="font-medium">Delivery date selected: </span> 
                            {selectedDeliveryDate.toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    type="button" 
                    onClick={handleNextStep}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={selectedDeliveryOption === 'cheap' && !selectedDeliveryDate}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <DeliveryOptions
                  selectedVolume={selectedVolume}
                  setSelectedVolume={setSelectedVolume}
                />

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
            )}
            
            {currentStep === 3 && (
              <div>
                <AddressDetails
                  senderName={senderName}
                  setSenderName={setSenderName}
                  senderEmail={senderEmail}
                  setSenderEmail={setSenderEmail}
                  senderPhone={senderPhone}
                  setSenderPhone={setSenderPhone}
                  senderAddress={senderAddress}
                  setSenderAddress={setSenderAddress}
                  recipientName={recipientName}
                  setRecipientName={setRecipientName}
                  recipientEmail={recipientEmail}
                  setRecipientEmail={setRecipientEmail}
                  recipientPhone={recipientPhone}
                  setRecipientPhone={setRecipientPhone}
                  recipientAddress={recipientAddress}
                  setRecipientAddress={setRecipientAddress}
                  pickupCountry={pickupCountry}
                  pickupPostalCode={pickupPostalCode}
                  deliveryCountry={deliveryCountry}
                  deliveryPostalCode={deliveryPostalCode}
                />
                
                <BookingSummary
                  senderName={senderName}
                  senderAddress={senderAddress}
                  pickupPostalCode={pickupPostalCode}
                  pickupCountry={pickupCountry}
                  recipientName={recipientName}
                  recipientAddress={recipientAddress}
                  deliveryPostalCode={deliveryPostalCode}
                  deliveryCountry={deliveryCountry}
                />
                
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
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <PaymentForm 
                  totalPrice={getCarrierPrice()}
                  onPaymentComplete={handleBookNow}
                  onSubmit={handleSubmit} 
                  onCancel={handlePreviousStep}
                />

              </div>
            )}
          

            {/* {currentStep === 5 && (
              <div>
                <BookingConfirmation bookingResult={undefined} carrier={{
                  name: recipientName,
                  eta: "3 days",
                  price: getCarrierPrice()
                }} canCancelBooking={false} labelLanguage={""} setLabelLanguage={function (language: string): void {
                  labelLanguage
                } } isGeneratingLabel={false} handleGenerateLabel={function (): void {
                  LabelGenerator
                } } handleCancelBooking={function (): void {
                   cancelBooking
                } } onBookAnother={function (): void {
                  setBookingConfirmed
                } }
                />
                
              </div>
            )} */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShipmentBookingPage;
