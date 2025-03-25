
import { useState } from "react";
import { toast } from "sonner";
import { DateRange } from "@/utils/pricingUtils";
import { addWeeks, startOfDay } from "date-fns";
import { PaymentData } from "@/components/booking/PaymentForm";
import { generateMockPricingData } from "@/utils/pricingUtils";
import { AddressDetailsType } from "@/types/booking";
import { bookShipment, cancelBooking } from "@/services/bookingService";
import { getBookingByTrackingCode } from "@/services/bookingDb";

type CustomerType = "business" | "private" | "ecommerce" | null;
type DeliveryOption = "fast" | "cheap" | null;

export const useBookingState = (userId?: string) => {
  // Form state
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
  const [selectedCustomerType, setSelectedCustomerType] = useState<CustomerType>("private");
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
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  
  const today = startOfDay(new Date());
  const threeWeeksFromNow = addWeeks(today, 3);
  
  const dateRange: DateRange = {
    start: today,
    end: threeWeeksFromNow
  };

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
    name: "E-Parcel Nordic",
    price: getCarrierPrice(),
    eta: "3 days",
    icon: "📦"
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

  const handleDeliveryOptionSelect = (option: DeliveryOption) => {
    setSelectedDeliveryOption(option);
    
    if (option === 'fast') {
      setDeliverySpeed('express');
      setShowPriceCalendar(false);
      setSelectedDeliveryDate(null);
      toast.success("Fast delivery selected - Your package will arrive in 1-2 business days");
    } else if (option === 'cheap') {
      setDeliverySpeed('economy');
      setShowPriceCalendar(true);
      toast.success("Cheap delivery selected - Please choose a delivery date");
      loadPriceCalendarData();
    }
  };

  const handleDeliveryDateSelect = (date: Date) => {
    setSelectedDeliveryDate(date);
    toast.success(`Delivery date selected: ${date.toLocaleDateString()}`);
  };

  const checkSavedBooking = async () => {
    if (userId) {
      const savedBookingInfo = localStorage.getItem('lastBooking');
      
      if (savedBookingInfo) {
        const { trackingCode, timestamp } = JSON.parse(savedBookingInfo);
        
        const bookingData = await getBookingByTrackingCode(trackingCode, userId);
        
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

  const handleBookShipment = async () => {
    if (!userId) {
      document.querySelector<HTMLButtonElement>("button.cl-userButtonTrigger")?.click();
      return;
    }

    if (!paymentData) {
      toast.error("Payment information is missing");
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
        userId,
        customerType: selectedCustomerType || "private",
        businessName: selectedCustomerType === "business" || selectedCustomerType === "ecommerce" ? businessName : undefined,
        vatNumber: selectedCustomerType === "business" ? vatNumber : undefined,
        pickupSlotId: "slot-1", // Default slot
        paymentMethod: paymentData.paymentMethod,
        paymentDetails: {
          cardNumber: paymentData.cardNumber,
          expiryDate: paymentData.expiryDate,
          cardholderName: paymentData.cardholderName,
          swishNumber: paymentData.swishNumber,
          bankName: paymentData.bankName
        },
        termsAccepted: paymentData.termsAccepted,
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
    if (!bookingResult?.trackingCode && !bookingResult?.tracking_code || !userId) return;
    
    const trackingCode = bookingResult.trackingCode || bookingResult.tracking_code;
    
    try {
      const cancelled = await cancelBooking(trackingCode, userId);
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

  const handlePaymentComplete = (data: PaymentData) => {
    setPaymentData(data);
    handleBookShipment();
  };

  return {
    // State
    weight,
    length,
    width,
    height,
    pickup,
    pickupPostalCode,
    delivery,
    deliveryPostalCode,
    deliverySpeed,
    compliance,
    isBooking,
    bookingResult,
    selectedCustomerType,
    businessName,
    vatNumber,
    bookingConfirmed,
    canCancelBooking,
    labelLanguage,
    isGeneratingLabel,
    pickupCountry,
    deliveryCountry,
    currentStep,
    senderName,
    senderEmail,
    senderPhone,
    senderAddress,
    recipientName,
    recipientEmail,
    recipientPhone,
    recipientAddress,
    selectedVolume,
    selectedDeliveryOption,
    showPriceCalendar,
    currentMonth,
    pricingData,
    isCalendarLoading,
    selectedDeliveryDate,
    paymentData,
    dateRange,
    carrier,
    
    // Setters
    setWeight,
    setLength,
    setWidth,
    setHeight,
    setPickup,
    setPickupPostalCode,
    setDelivery,
    setDeliveryPostalCode,
    setDeliverySpeed,
    setCompliance,
    setSelectedCustomerType,
    setBusinessName,
    setVatNumber,
    setLabelLanguage,
    setPickupCountry,
    setDeliveryCountry,
    setCurrentStep,
    setSenderName,
    setSenderEmail,
    setSenderPhone,
    setSenderAddress,
    setRecipientName,
    setRecipientEmail,
    setRecipientPhone,
    setRecipientAddress,
    setSelectedVolume,
    setCurrentMonth,
    
    // Actions
    loadPriceCalendarData,
    handleSwapLocations,
    handleNextStep,
    handlePreviousStep,
    handleDeliveryOptionSelect,
    handleDeliveryDateSelect,
    checkSavedBooking,
    handleBookShipment,
    handleCancelBooking,
    handleGenerateLabel,
    handlePaymentComplete
  };
};

export type BookingStateType = ReturnType<typeof useBookingState>;
