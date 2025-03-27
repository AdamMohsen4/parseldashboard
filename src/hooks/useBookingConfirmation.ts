import { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { getBookingByTrackingCode } from "@/services/bookingDb";
import { cancelBooking, bookShipment } from "@/services/bookingService";
import { BookingRequest } from "@/types/booking";
import { useNavigate } from "react-router-dom";

export const useBookingConfirmation = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [canCancelBooking, setCanCancelBooking] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [labelLanguage, setLabelLanguage] = useState("en");
  const [isGeneratingLabel, setIsGeneratingLabel] = useState(false);

  useEffect(() => {
    const checkSavedBooking = async () => {
      if (user) {
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
  }, [user]);

  const handleBookNow = async (bookingRequest: BookingRequest) => {
    if (!user) {
      document.querySelector<HTMLButtonElement>("button.cl-userButtonTrigger")?.click();
      return;
    }

    if (isBooking) {
      return; // Prevent duplicate submissions
    }

    setIsBooking(true);
    
    try {
      console.log("Starting booking process...");
      console.log("Prepared booking request:", bookingRequest);
      
      const result = await bookShipment(bookingRequest);
      
      console.log("Booking result:", result);
      
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
      toast.error("An unexpected error occurred during booking.");
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

  const resetBooking = () => {
    setBookingConfirmed(false);
    setBookingResult(null);
    localStorage.removeItem('lastBooking');
    
    window.location.href = '/shipment';
  };

  return {
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
  };
};
