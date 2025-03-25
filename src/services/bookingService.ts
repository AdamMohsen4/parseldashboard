
import { generateShipmentId, generateTrackingCode, calculateTotalPrice } from './bookingUtils';
import { BookingRequest, BookingResponse, AddressDetails } from '@/types/booking';
import { toast } from 'sonner';
import { saveBookingToSupabase } from './bookingDb';

// Store bookings in memory (in a real app this would be a database call)
const bookings: Record<string, any> = {};

export const bookShipment = async (request: BookingRequest): Promise<BookingResponse> => {
  try {
    console.log('Booking shipment with request:', request);
    
    // Basic validation
    if (!request.pickup || !request.delivery) {
      return {
        success: false,
        message: 'Pickup and delivery addresses are required',
      };
    }
    
    if (!request.userId) {
      return {
        success: false,
        message: 'User ID is required',
      };
    }
    
    // Generate shipment ID and tracking code
    const shipmentId = generateShipmentId();
    const trackingCode = generateTrackingCode();
    
    // Calculate total price
    const totalPrice = calculateTotalPrice(request.carrier.price, request.includeCompliance);
    
    // Simulate generation of a label URL
    const labelUrl = `https://api.shipping.com/labels/${trackingCode}`;
    
    // Set pickup time (current time + 2 hours)
    const pickupTime = new Date();
    pickupTime.setHours(pickupTime.getHours() + 2);
    const pickupTimeStr = pickupTime.toISOString();
    
    // Set estimated delivery date (depends on delivery speed)
    const estimatedDelivery = new Date();
    if (request.deliverySpeed === 'express') {
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 1);
    } else if (request.deliverySpeed === 'standard') {
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
    } else {
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
    }
    const estimatedDeliveryStr = estimatedDelivery.toISOString();
   
    // Set cancellation deadline (24h from now)
    const cancellationDeadline = new Date();
    cancellationDeadline.setHours(cancellationDeadline.getHours() + 24);
    
    // Create booking record
    const booking = {
      id: shipmentId,
      tracking_code: trackingCode,
      user_id: request.userId,
      status: 'pending',
      sender_address: typeof request.pickup === 'string' ? request.pickup : JSON.stringify(request.pickup),
      recipient_address: typeof request.delivery === 'string' ? request.delivery : JSON.stringify(request.delivery),
      package_weight: request.weight,
      package_dimensions: `${request.dimensions.length}x${request.dimensions.width}x${request.dimensions.height}`,
      carrier_name: request.carrier.name,
      total_price: totalPrice,
      cancellation_deadline: cancellationDeadline.toISOString(),
      can_be_cancelled: true,
      delivery_speed: request.deliverySpeed,
      compliance_included: request.includeCompliance,
      created_at: new Date().toISOString(),
      shipment_id: shipmentId,
      customerType: request.customerType || 'private',
      businessName: request.businessName,
      vatNumber: request.vatNumber,
      payment_method: request.paymentMethod,
      payment_details: request.paymentDetails ? JSON.stringify(request.paymentDetails) : null,
      delivery_date: request.deliveryDate,
      terms_accepted: request.termsAccepted || false
    };
    
    // Save booking (in memory for this demo)
    bookings[trackingCode] = booking;
    
    console.log("About to save to Supabase with data:", {
      request,
      trackingCode,
      labelUrl,
      pickupTimeStr,
      totalPrice,
      estimatedDeliveryStr,
      cancellationDeadline
    });
    
    // Add additional call to save to Supabase
    const savedToSupabase = await saveBookingToSupabase(
      request,
      trackingCode,
      labelUrl,
      pickupTimeStr,
      totalPrice,
      estimatedDeliveryStr,
      cancellationDeadline
    );
    
    if (!savedToSupabase) {
      console.error('Failed to save booking to Supabase');
      toast.error("Failed to save your booking to the database. Please try again.");
      return {
        success: false,
        message: 'Failed to save booking to database',
      };
    }
    
    // For demonstration purposes, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store booking in localStorage (for demo purposes)
    const userBookings = JSON.parse(localStorage.getItem(`bookings_${request.userId}`) || '[]');
    userBookings.push(booking);
    localStorage.setItem(`bookings_${request.userId}`, JSON.stringify(userBookings));
    
    // Show success toast
    toast.success("Shipment booked successfully!");
    
    // Return success response
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
    console.error('Error booking shipment:', error);
    toast.error("An error occurred while booking your shipment.");
    return {
      success: false,
      message: 'Failed to book shipment',
    };
  }
};

export const cancelBooking = async (trackingCode: string, userId: string): Promise<boolean> => {
  try {
    console.log('Cancelling booking:', trackingCode);
    
    // Check if booking exists and belongs to user
    const userBookings = JSON.parse(localStorage.getItem(`bookings_${userId}`) || '[]');
    const bookingIndex = userBookings.findIndex((b: any) => b.tracking_code === trackingCode);
    
    if (bookingIndex === -1) {
      console.error('Booking not found or does not belong to user');
      return false;
    }
    
    // Check if booking can be cancelled
    const booking = userBookings[bookingIndex];
    if (!booking.can_be_cancelled) {
      console.error('Booking cannot be cancelled');
      return false;
    }
    
    // Update booking status
    booking.status = 'cancelled';
    booking.can_be_cancelled = false;
    userBookings[bookingIndex] = booking;
    
    // Update local storage
    localStorage.setItem(`bookings_${userId}`, JSON.stringify(userBookings));
    
    // In a real app, this would update the database
    
    return true;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return false;
  }
};
