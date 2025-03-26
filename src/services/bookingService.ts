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
    const totalPrice = calculateTotalPrice(request.carrier.price, request.includeCompliance);
    const labelUrl = `https://api.shipping.com/labels/${trackingCode}`;
    
    const pickupTime = new Date();
    pickupTime.setHours(pickupTime.getHours() + 2);
    
    const cancellationDeadline = new Date();
    cancellationDeadline.setHours(cancellationDeadline.getHours() + 24);
    
    try {
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
        console.error('Failed to save booking to Supabase');
      }
    } catch (error) {
      console.error('Error saving to Supabase:', error);
    }
    
    const booking = {
      id: shipmentId,
      tracking_code: trackingCode,
      user_id: request.userId,
      status: 'pending',
      sender_address: typeof request.pickup === 'string' ? request.pickup : JSON.stringify(request.pickup),
      recipient_address: typeof request.delivery === 'string' ? request.delivery : JSON.stringify(request.delivery),
      package_weight: request.weight,
      package_dimensions: `${request.dimensions.length}x${request.dimensions.width}x${request.dimensions.height}`,
      carrier_name: request.carrier.name || 'E-Parcel Nordic',
      total_price: totalPrice,
      cancellation_deadline: cancellationDeadline.toISOString(),
      can_be_cancelled: true,
      compliance_included: request.includeCompliance,
      created_at: new Date().toISOString(),
      shipment_id: shipmentId,
      customerType: request.customerType || 'private',
      poolingEnabled: request.poolingEnabled,
      deliveryDate: request.deliveryDate,
      paymentMethod: request.paymentMethod,
      paymentDetails: request.paymentDetails,
      termsAccepted: request.termsAccepted
    };
    
    const userBookings = JSON.parse(localStorage.getItem(`bookings_${request.userId}`) || '[]');
    userBookings.push(booking);
    localStorage.setItem(`bookings_${request.userId}`, JSON.stringify(userBookings));
    
    return {
      success: true,
      message: 'Shipment booked successfully',
      shipmentId,
      trackingCode,
      totalPrice,
      cancellationDeadline: cancellationDeadline.toISOString(),
      canBeCancelled: true
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
    
    if (bookingIndex === -1 || !userBookings[bookingIndex].can_be_cancelled) {
      return false;
    }
    
    userBookings[bookingIndex].status = 'cancelled';
    userBookings[bookingIndex].can_be_cancelled = false;
    localStorage.setItem(`bookings_${userId}`, JSON.stringify(userBookings));
    
    return true;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return false;
  }
};
