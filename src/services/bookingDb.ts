
import { supabase } from "@/integrations/supabase/client";
import { BookingRequest } from "@/types/booking";

// Add cache for bookings
const bookingsCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

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
      .from('booking')  // 'booking' is the correct table name in Supabase, not 'bookings'
      .insert([{
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
      }])
      .select()
      .maybeSingle();
      
    if (error) {
      console.error("Error saving to Supabase:", error);
      return false;
    }
    
    // Clear cache after new booking
    clearCacheForUser(request.userId);
    
    console.log("Successfully saved booking to Supabase with response:", data);
    return true;
  } catch (error) {
    console.error("Supabase insertion error:", error);
    return false;
  }
};

const clearCacheForUser = (userId: string) => {
  const keysToDelete = [];
  for (const key of bookingsCache.keys()) {
    if (key.includes(userId)) {
      keysToDelete.push(key);
    }
  }
  
  keysToDelete.forEach(key => bookingsCache.delete(key));
};

export const fetchBookingsFromSupabase = async (userId: string, limit?: number) => {
  try {
    const cacheKey = `bookings-${userId}-${limit || 'all'}`;
    
    // Check cache first
    const cachedData = bookingsCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRY)) {
      console.log("Returning bookings from cache");
      return cachedData.data;
    }
    
    let query = supabase
      .from('booking')  // 'booking' is the correct table name, not 'bookings'
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
    
    // Store in cache
    bookingsCache.set(cacheKey, {
      data: data || [],
      timestamp: Date.now()
    });
    
    return data || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

export const findBookingByOrderNumber = async (userId: string, orderNumber: string) => {
  try {
    const cacheKey = `booking-order-${userId}-${orderNumber}`;
    
    // Check cache first
    const cachedData = bookingsCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRY)) {
      console.log("Returning booking from cache");
      return cachedData.data;
    }
    
    const { data, error } = await supabase
      .from('booking')  // 'booking' is the correct table name, not 'bookings'
      .select('*')
      .eq('user_id', userId)
      .ilike('business_name', `%${orderNumber}%`)
      .maybeSingle();
    
    if (error) {
      console.error("Error finding booking by order number:", error);
      return null;
    }
    
    // Store in cache
    bookingsCache.set(cacheKey, {
      data: data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error("Error in findBookingByOrderNumber:", error);
    return null;
  }
};

export const getBookingByTrackingCode = async (trackingCode: string, userId: string) => {
  try {
    const cacheKey = `booking-tracking-${userId}-${trackingCode}`;
    
    // Check cache first
    const cachedData = bookingsCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRY)) {
      console.log("Returning booking from cache");
      return cachedData.data;
    }
    
    const { data, error } = await supabase
      .from('booking')  // 'booking' is the correct table name, not 'bookings'
      .select('*')
      .eq('tracking_code', trackingCode)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching booking by tracking code:", error);
      return null;
    }
    
    // Store in cache
    bookingsCache.set(cacheKey, {
      data: data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error("Error in getBookingByTrackingCode:", error);
    return null;
  }
};
