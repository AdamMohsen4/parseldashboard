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
    
    // Save to Supabase first
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
    
    // Only save to local storage if Supabase save was successful
    const booking = {
      id: shipmentId,
      tracking_code: trackingCode,
      user_id: request.userId,
      status: 'pending',
      pickup_address: typeof request.pickup === 'string' ? request.pickup : JSON.stringify(request.pickup),
      delivery_address: typeof request.delivery === 'string' ? request.delivery : JSON.stringify(request.delivery),
      weight: request.weight,
      dimension_length: request.dimensions.length,
      dimension_width: request.dimensions.width,
      dimension_height: request.dimensions.height,
      carrier_name: request.carrier.name || 'E-Parcel Nordic',
      carrier_price: request.carrier.price,
      total_price: totalPrice,
      cancellation_deadline: cancellationDeadline.toISOString(),
      can_be_cancelled: 'yes',
      created_at: new Date().toISOString(),
      customer_type: request.customerType || 'private',
      pooling_enabled: request.poolingEnabled ? 'yes' : 'no',
      delivery_date: request.deliveryDate ? new Date(request.deliveryDate).toISOString() : null,
      payment_method: request.paymentMethod,
      payment_details: request.paymentDetails ? JSON.stringify(request.paymentDetails) : null,
      terms_accepted: request.termsAccepted ? 'yes' : 'no',
      label_url: labelUrl,
      pickup_time: pickupTime.toISOString(),
      estimated_delivery: request.deliveryDate || new Date().toISOString(),
      delivery_speed: request.poolingEnabled ? 'economy' : 'express'
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
