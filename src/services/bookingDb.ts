
import { supabase } from "@/integrations/supabase/client";
import { BookingRequest } from "@/types/booking";

export const saveBookingToSupabase = async (
  request: BookingRequest,
  trackingCode: string,
  labelUrl: string,
  pickupTime: string,
  totalPrice: number,
  estimatedDelivery: string
) => {
  try {
    // Get the current authenticated user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error("Error getting authenticated user:", authError);
      return false;
    }
    
    if (!authData.user) {
      console.error("User not authenticated, cannot save booking");
      return false;
    }
    
    console.log("Authenticated user confirmed:", authData.user.id);
    
    // Log the full data we're trying to insert
    const bookingData = {
      user_id: authData.user.id,
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
      estimated_delivery: estimatedDelivery
    };
    
    console.log("Attempting to insert booking with data:", bookingData);
    
    // Insert booking with the authenticated user ID
    const { data, error } = await supabase
      .from('booking')
      .insert(bookingData)
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

// New function to fetch bookings with optional limit
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
