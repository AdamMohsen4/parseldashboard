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
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('booking')
      .insert([
        {
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
          customer_type: request.customerType || 'private',
          pooling_enabled: request.poolingEnabled ? 'yes' : 'no',
          delivery_date: request.deliveryDate ? new Date(request.deliveryDate).toISOString() : null,
          payment_method: request.paymentMethod,
          payment_details: request.paymentDetails,
          terms_accepted: request.termsAccepted,
          label_url: labelUrl,
          pickup_time: pickupTime,
          estimated_delivery: estimatedDelivery
        }
      ]);

    if (error) {
      console.error('Error saving booking to Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveBookingToSupabase:', error);
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
      .from('booking')
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
