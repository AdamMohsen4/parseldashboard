
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/layout/NavBar";
import { useUser } from "@clerk/clerk-react";
import { useBookingState } from "@/hooks/useBookingState";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
import BookingFormMultistep from "@/components/booking/BookingFormMultistep";

type CustomerType = "business" | "private" | "ecommerce" | null;

interface ShipmentBookingPageProps {
  customerType?: CustomerType;
}

const ShipmentBookingPage = ({ customerType }: ShipmentBookingPageProps) => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  
  const bookingState = useBookingState(user?.id);
  
  const {
    bookingConfirmed,
    bookingResult,
    canCancelBooking,
    labelLanguage,
    setLabelLanguage,
    isGeneratingLabel,
    carrier,
    handleGenerateLabel,
    handleCancelBooking,
    checkSavedBooking
  } = bookingState;

  // Check for saved bookings when component mounts
  useEffect(() => {
    if (isSignedIn && user) {
      checkSavedBooking();
    }
  }, [isSignedIn, user]);

  // Load pricing data when price calendar is shown
  useEffect(() => {
    if (bookingState.showPriceCalendar) {
      bookingState.loadPriceCalendarData();
    }
  }, [bookingState.showPriceCalendar, bookingState.currentMonth]);

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
              bookingState.setBookingConfirmed(false);
              bookingState.setBookingResult(null);
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
          <BookingFormMultistep bookingState={bookingState} />
        </div>
      </div>
    </div>
  );
};

export default ShipmentBookingPage;
