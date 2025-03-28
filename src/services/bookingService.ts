import { generateShipmentId, generateTrackingCode, calculateTotalPrice } from './bookingUtils';
import { BookingRequest, BookingResponse } from '@/types/booking';
import { saveBookingToSupabase } from './bookingDb';

export const bookShipment = async (request: BookingRequest): Promise<BookingResponse> => {
  try {
    if (!request.pickup || !request.delivery || !request.userId) {
      return {
        success: false,
        message: 'Required fields are missing',
      };
    }
    
    const shipmentId = generateShipmentId();
    const trackingCode = generateTrackingCode();
    const totalPrice = calculateTotalPrice(request.carrier.price);
    const labelUrl = `https://api.shipping.com/labels/${trackingCode}`;
    
    const pickupTime = new Date();
    pickupTime.setHours(pickupTime.getHours() + 2);
    
    const cancellationDeadline = new Date();
    cancellationDeadline.setHours(cancellationDeadline.getHours() + 24);
    
    const savedToSupabase = await saveBookingToSupabase(
      request,
      trackingCode,
      labelUrl,
      pickupTime.toISOString(),
      totalPrice,
      request.deliveryDate || new Date().toISOString(),
      cancellationDeadline
    );
    
    if (!savedToSupabase) {
      return {
        success: false,
        message: 'Failed to save booking to database',
      };
    }
    
    return {
      success: true,
      message: 'Shipment booked successfully',
      shipmentId,
      trackingCode,
      totalPrice,
      cancellationDeadline: cancellationDeadline.toISOString(),
    };
  } catch (error) {
    console.error('ERROR in bookShipment:', error);
    return {
      success: false,
      message: 'Failed to book shipment',
    };
  }
};

export const cancelBooking = async (trackingCode: string, userId: string): Promise<boolean> => {
  try {
    const userBookings = JSON.parse(localStorage.getItem(`bookings_${userId}`) || '[]');
    const bookingIndex = userBookings.findIndex((b: any) => b.tracking_code === trackingCode);
    

    
    userBookings[bookingIndex].status = 'cancelled';
    userBookings[bookingIndex].can_be_cancelled = false;
    localStorage.setItem(`bookings_${userId}`, JSON.stringify(userBookings));
    
    return true;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return false;
  }
};
