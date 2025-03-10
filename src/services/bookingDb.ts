
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
    console.log("Saving booking to Supabase:", { request, trackingCode });
    
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
        estimated_delivery: estimatedDelivery
      })
      .select()
      .maybeSingle();
      
    if (error) {
      console.error("Error saving to Supabase:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Supabase insertion error:", error);
    return false;
  }
};
