
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookingStateType } from "@/hooks/useBookingState";
import DeliveryOptionsStep from "./DeliveryOptionsStep";
import AddressDetails from "./AddressDetails";
import DeliveryOptions from "./DeliveryOptions";
import BookingSummary from "./BookingSummary";
import PaymentForm from "./PaymentForm";
import LocationSelector from "./LocationSelector";
import BookingSteps from "./BookingSteps";

interface BookingFormMultistepProps {
  bookingState: BookingStateType;
}

const BookingFormMultistep: React.FC<BookingFormMultistepProps> = ({ bookingState }) => {
  const {
    currentStep,
    handleNextStep,
    handlePreviousStep,
    pickupCountry,
    setPickupCountry,
    pickupPostalCode,
    setPickupPostalCode,
    deliveryCountry,
    setDeliveryCountry,
    deliveryPostalCode,
    setDeliveryPostalCode,
    handleSwapLocations,
    selectedDeliveryOption,
    selectedVolume,
    setSelectedVolume,
    senderName,
    setSenderName,
    senderEmail,
    setSenderEmail,
    senderPhone,
    setSenderPhone,
    senderAddress,
    setSenderAddress,
    recipientName,
    setRecipientName,
    recipientEmail,
    setRecipientEmail,
    recipientPhone,
    setRecipientPhone,
    recipientAddress,
    setRecipientAddress,
    carrier,
    handlePaymentComplete
  } = bookingState;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < 4) {
      handleNextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <BookingSteps currentStep={currentStep} />
      
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
          
          <DeliveryOptionsStep bookingState={bookingState} />
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
            totalPrice={carrier.price}
            onPaymentComplete={handlePaymentComplete}
            onCancel={handlePreviousStep}
          />
        </div>
      )}
    </form>
  );
};

export default BookingFormMultistep;
