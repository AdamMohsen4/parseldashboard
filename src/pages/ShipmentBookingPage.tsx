
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/layout/NavBar";
import { useUser } from "@clerk/clerk-react";
import { generateLabel } from "@/services/labelService";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
import BookingSteps from "@/components/booking/BookingSteps";
import LocationSelector from "@/components/booking/LocationSelector";
import DeliveryOptions from "@/components/booking/DeliveryOptions";
import AddressDetails from "@/components/booking/AddressDetails";
import { AddressDetails as AddressDetailsType, BookingRequest } from "@/types/booking";
import BookingSummary from "@/components/booking/BookingSummary";
import PaymentForm, { PaymentData } from "@/components/booking/PaymentForm";
import DeliveryOptionSelector from "@/components/booking/DeliveryOptionSelector";
import { useBookingConfirmation } from "@/hooks/useBookingConfirmation";
import { usePriceCalendar } from "@/hooks/usePriceCalendar";

type CustomerType = "business" | "private" | "ecommerce" | null;
type DeliveryOption = "fast" | "cheap" | null;

interface ShipmentBookingPageProps {
  customerType?: CustomerType;
}

const ShipmentBookingPage = ({ customerType }: ShipmentBookingPageProps) => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  
  // Form state
  const [weight, setWeight] = useState("5");
  const [length, setLength] = useState("20");
  const [width, setWidth] = useState("15");
  const [height, setHeight] = useState("10");
  const [pickup, setPickup] = useState("Stockholm, SE");
  const [pickupPostalCode, setPickupPostalCode] = useState("112 23");
  const [delivery, setDelivery] = useState("Helsinki, FI");
  const [deliveryPostalCode, setDeliveryPostalCode] = useState("00341");
  const [selectedCustomerType, setSelectedCustomerType] = useState<CustomerType>(customerType || "private");
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<DeliveryOption>(null);
  const [pickupCountry, setPickupCountry] = useState("SE");
  const [deliveryCountry, setDeliveryCountry] = useState("FI");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedVolume, setSelectedVolume] = useState("m");
  const [paymentInfo, setPaymentInfo] = useState<PaymentData | null>(null);
  
  // Address details state
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  // Custom hooks
  const {
    bookingResult,
    bookingConfirmed,
    canCancelBooking,
    isBooking,
    labelLanguage,
    isGeneratingLabel,
    setLabelLanguage,
    setIsGeneratingLabel,
    handleBookNow,
    handleCancelBooking,
    resetBooking
  } = useBookingConfirmation();

  const {
    showPriceCalendar,
    setShowPriceCalendar,
    currentMonth,
    setCurrentMonth,
    pricingData,
    isCalendarLoading,
    selectedDeliveryDate,
    dateRange,
    handleDeliveryDateSelect
  } = usePriceCalendar();

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

  const handlePaymentSubmit = (data: PaymentData) => {
    console.log("Payment data received:", data);
    setPaymentInfo(data);
  };

  const handleSubmitBooking = async () => {
    if (currentStep < 4) {
      handleNextStep();
      return;
    }

    if (!isSignedIn || !user) {
      document.querySelector<HTMLButtonElement>("button.cl-userButtonTrigger")?.click();
      return;
    }

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
    
    const bookingRequest: BookingRequest = {
      weight,
      dimensions: { length, width, height },
      pickup: pickupAddress,
      delivery: deliveryAddress,
      carrier: { name: carrier.name, price: carrier.price },
      userId: user.id,
      customerType: selectedCustomerType || "private",
      pickupSlotId: "slot-1",
      poolingEnabled: selectedDeliveryOption === 'cheap',
      deliveryDate: selectedDeliveryDate ? selectedDeliveryDate.toISOString() : undefined,
      paymentMethod: paymentInfo?.paymentMethod,
      termsAccepted: paymentInfo?.termsAccepted
    };
    
    await handleBookNow(bookingRequest);
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
      handleSubmitBooking();
    }
  };

  const handleDeliveryOptionSelect = (option: DeliveryOption) => {
    setSelectedDeliveryOption(option);
    
    if (option === 'fast') {
      setShowPriceCalendar(false);
      setSelectedDeliveryDate(null);
    } else if (option === 'cheap') {
      setShowPriceCalendar(true);
    }
  };

  const handleGenerateLabel = async () => {
    if (!bookingResult) return;
    
    const trackingCode = bookingResult.trackingCode || bookingResult.tracking_code;
    const shipmentId = bookingResult.shipmentId || "SHIP-" + Math.floor(Math.random() * 1000000);
    
    if (!trackingCode) {
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
      
      if (result.success && result.labelUrl) {
        window.open(result.labelUrl, '_blank');
      }
    } catch (error) {
      console.error("Error generating label:", error);
    } finally {
      setIsGeneratingLabel(false);
    }
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
              resetBooking();
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
                
                <DeliveryOptionSelector
                  selectedDeliveryOption={selectedDeliveryOption}
                  onOptionSelect={handleDeliveryOptionSelect}
                  showPriceCalendar={showPriceCalendar}
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  pricingData={pricingData}
                  isCalendarLoading={isCalendarLoading}
                  dateRange={dateRange}
                  selectedDeliveryDate={selectedDeliveryDate}
                  onDateSelect={handleDeliveryDateSelect}
                />
                
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
                  onPaymentComplete={handleSubmitBooking}
                  onSubmit={handlePaymentSubmit}
                  onCancel={handlePreviousStep}
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShipmentBookingPage;
