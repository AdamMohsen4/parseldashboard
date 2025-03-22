
import { BookingRequest, BookingResponse } from '@/types/booking';
import { calculateEstimatedDelivery, calculateTotalPrice, generateShipmentId, generateTrackingCode } from './bookingUtils';
import { supabase } from '@/integrations/supabase/client';

export const getBookingByTrackingCode = async (trackingCode: string, userId: string): Promise<any> => {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('tracking_code', trackingCode)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error("Error fetching booking:", error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error("Error in getBookingByTrackingCode:", error);
    return null;
  }
};

export const fetchBookingsFromSupabase = async (userId: string, limit?: number): Promise<any[]> => {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return [];
  }

  try {
    let query = supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchBookingsFromSupabase:", error);
    return [];
  }
};

export const createBooking = async (bookingDetails: BookingRequest): Promise<BookingResponse> => {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return { success: false, message: "Database error" };
  }

  try {
    const shipmentId = generateShipmentId();
    const trackingCode = generateTrackingCode();
    const totalPrice = calculateTotalPrice(
      bookingDetails.carrier.price,
      bookingDetails.includeCompliance
    );
    
    const now = new Date();
    const cancellationDeadline = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours
    const estimatedDelivery = calculateEstimatedDelivery(bookingDetails.deliverySpeed);
    
    const { error } = await supabase.from('bookings').insert({
      id: shipmentId,
      user_id: bookingDetails.userId,
      tracking_code: trackingCode,
      carrier_name: bookingDetails.carrier.name,
      carrier_price: bookingDetails.carrier.price,
      weight: bookingDetails.weight,
      dimension_length: bookingDetails.dimensions.length,
      dimension_width: bookingDetails.dimensions.width,
      dimension_height: bookingDetails.dimensions.height,
      pickup_address: bookingDetails.pickup,
      delivery_address: bookingDetails.delivery,
      delivery_speed: bookingDetails.deliverySpeed,
      include_compliance: bookingDetails.includeCompliance,
      customer_type: bookingDetails.customerType,
      business_name: bookingDetails.businessName,
      vat_number: bookingDetails.vatNumber,
      status: 'pending',
      created_at: now.toISOString(),
      pickup_time: now.toISOString(),
      total_price: totalPrice,
      estimated_delivery: estimatedDelivery,
      cancellation_deadline: cancellationDeadline.toISOString(),
      delivery_date: bookingDetails.deliveryDate // Add delivery date
    });

    if (error) {
      console.error("Error creating booking:", error);
      return { success: false, message: error.message };
    }

    return {
      success: true,
      shipmentId,
      trackingCode,
      pickupTime: now.toISOString(),
      totalPrice,
      cancellationDeadline: cancellationDeadline.toISOString(),
      canBeCancelled: true
    };
  } catch (error) {
    console.error("Error in createBooking:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};
