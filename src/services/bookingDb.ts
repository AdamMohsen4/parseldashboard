import { supabase } from "@/integrations/supabase/client";
import { BookingRequest } from "@/types/booking";

export const saveBookingToSupabase = async (
  request: BookingRequest,
  trackingCode: string,
  labelUrl: string,
  pickupTime: string,
  totalPrice: number,
  estimatedDelivery: string,
  cancellationDeadline: Date
) => {
  try {
    console.log("Saving booking to Supabase with payload:", {
      user_id: request.userId,
      tracking_code: trackingCode,
      carrier_name: request.carrier.name,
      carrier_price: request.carrier.price,
      weight: request.weight,
      dimension_length: request.dimensions.length,
      dimension_width: request.dimensions.width,
      dimension_height: request.dimensions.height,
      pickup_address: request.pickup,
      delivery_address: request.delivery,
      delivery_speed: request.deliverySpeed,
      include_compliance: request.includeCompliance,
      label_url: labelUrl,
      pickup_time: pickupTime,
      total_price: totalPrice,
      status: 'pending',
      estimated_delivery: estimatedDelivery,
      customer_type: request.customerType || 'private',
      business_name: request.businessName,
      vat_number: request.vatNumber,
      cancellation_deadline: cancellationDeadline.toISOString()
    });
    
    const { data, error } = await supabase
      .from('booking')
      .insert({
        user_id: request.userId,
        tracking_code: trackingCode,
        carrier_name: request.carrier.name,
        carrier_price: request.carrier.price,
        weight: request.weight,
        dimension_length: request.dimensions.length,
        dimension_width: request.dimensions.width,
        dimension_height: request.dimensions.height,
        pickup_address: request.pickup,
        delivery_address: request.delivery,
        delivery_speed: request.deliverySpeed,
        include_compliance: request.includeCompliance,
        label_url: labelUrl,
        pickup_time: pickupTime,
        total_price: totalPrice,
        status: 'pending',
        estimated_delivery: estimatedDelivery,
        customer_type: request.customerType || 'private',
        business_name: request.businessName,
        vat_number: request.vatNumber,
        cancellation_deadline: cancellationDeadline.toISOString()
      })
      .select()
      .maybeSingle();
      
    if (error) {
      console.error("Error saving to Supabase:", error);
      return false;
    }
    
    console.log("Successfully saved booking to Supabase with response:", data);
    return true;
  } catch (error) {
    console.error("Supabase insertion error:", error);
    return false;
  }
};

export const fetchBookingsFromSupabase = async (userId: string, limit?: number) => {
  try {
    let query = supabase
      .from('booking')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching bookings from Supabase:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

export const findBookingByOrderNumber = async (userId: string, orderNumber: string) => {
  try {
    const { data, error } = await supabase
      .from('booking')
      .select('*')
      .eq('user_id', userId)
      .ilike('business_name', `%${orderNumber}%`)
      .maybeSingle();
    
    if (error) {
      console.error("Error finding booking by order number:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in findBookingByOrderNumber:", error);
    return null;
  }
};

export const getBookingByTrackingCode = async (trackingCode: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('booking')
      .select('*')
      .eq('tracking_code', trackingCode)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching booking by tracking code:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getBookingByTrackingCode:", error);
    return null;
  }
};
