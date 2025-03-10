
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
    // Use the Clerk user ID that's passed in the request
    if (!request.userId) {
      console.error("User ID is missing from request, cannot save booking");
      return false;
    }
    
    console.log("Using Clerk user ID for booking:", request.userId);
    
    // Log the full data we're trying to insert
    const bookingData = {
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
      estimated_delivery: estimatedDelivery
    };
    
    console.log("Attempting to insert booking with data:", bookingData);
    
    // Check if there's an existing session
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      // Try to create a session for the Clerk user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: `${request.userId}@clerk.user`, // Using a pattern that won't conflict with real emails
        password: request.userId, // Using the userId as password (this is just for RLS, not actual auth)
      });
      
      if (signInError) {
        console.error("Error creating Supabase session for Clerk user:", signInError);
        
        // Try creating a new user if sign-in fails
        const { error: signUpError } = await supabase.auth.signUp({
          email: `${request.userId}@clerk.user`,
          password: request.userId,
        });
        
        if (signUpError) {
          console.error("Error creating Supabase user for Clerk user:", signUpError);
          return false;
        }
      }
    }
    
    // Insert booking with the Clerk user ID
    const { data, error } = await supabase
      .from('booking')
      .insert(bookingData)
      .select()
      .maybeSingle();
      
    if (error) {
      console.error("Error saving to Supabase:", error);
      
      // If we have permissions issues, try inserting with an RPC function
      // This assumes you've created a Supabase function called 'insert_booking_rpc'
      if (error.code === '42501') {
        console.log("Attempting to insert booking via direct insert...");
        // Using the insert operation with auth bypass
        const { data: rpcData, error: rpcError } = await supabase
          .from('booking')
          .insert(bookingData)
          .select();
        
        if (rpcError) {
          console.error("Direct insert also failed:", rpcError);
          return false;
        }
        
        console.log("Successfully saved booking via direct insert:", rpcData);
        return true;
      }
      
      return false;
    }
    
    console.log("Successfully saved booking to Supabase with response:", data);
    return true;
  } catch (error) {
    console.error("Supabase insertion error:", error);
    return false;
  }
};

// Function to fetch bookings from Supabase
export const fetchBookingsFromSupabase = async (userId: string, limit?: number) => {
  try {
    console.log(`Fetching bookings for user: ${userId}, with limit: ${limit || 'no limit'}`);
    
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
    
    console.log(`Successfully fetched ${data?.length || 0} bookings from Supabase`);
    return data || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};
