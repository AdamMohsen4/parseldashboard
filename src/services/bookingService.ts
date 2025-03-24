
import { generateShipmentId, generateTrackingCode, calculateTotalPrice } from './bookingUtils';
import { BookingRequest, BookingResponse } from '@/types/booking';
import { toast } from 'sonner';
import { saveBookingToSupabase } from './bookingDb';

// Store bookings in memory (in a real app this would be a database call)
const bookings: Record<string, any> = {};

export const bookShipment = async (request: BookingRequest): Promise<BookingResponse> => {
  try {
    console.log('Booking shipment with request:', request);
    
    // Validation
    const validationError = validateBookingRequest(request);
    if (validationError) {
      return {
        success: false,
        message: validationError,
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
      sender_address: JSON.stringify(request.pickup),
      recipient_address: JSON.stringify(request.delivery),
      package_weight: request.weight,
      package_dimensions: `${request.dimensions.length}x${request.dimensions.width}x${request.dimensions.height}`,
      carrier_name: request.carrier.name,
      total_price: totalPrice,
      payment_method: request.paymentMethod,
      payment_details: JSON.stringify(request.paymentDetails),
      cancellation_deadline: cancellationDeadline.toISOString(),
      can_be_cancelled: true,
      delivery_speed: request.deliverySpeed,
      compliance_included: request.includeCompliance,
      created_at: new Date().toISOString(),
      customer_type: request.customerType || 'private',
      business_name: request.businessName,
      vat_number: request.vatNumber
    };
    
    // Save booking (in memory for this demo)
    bookings[trackingCode] = booking;
    
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
      return {
        success: false,
        message: 'Failed to save booking data. Please try again.',
      };
    }
    
    // For demonstration purposes, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store booking in localStorage (for demo purposes)
    const userBookings = JSON.parse(localStorage.getItem(`bookings_${request.userId}`) || '[]');
    userBookings.push(booking);
    localStorage.setItem(`bookings_${request.userId}`, JSON.stringify(userBookings));
    
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
    return {
      success: false,
      message: 'Failed to book shipment: ' + (error instanceof Error ? error.message : 'Unknown error'),
    };
  }
};

export const cancelBooking = async (trackingCode: string, userId: string): Promise<boolean> => {
  try {
    console.log('Cancelling booking:', trackingCode);
    
    if (!trackingCode || !userId) {
      console.error('Missing required parameters for cancellation');
      return false;
    }
    
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

// Helper function to validate booking request
function validateBookingRequest(request: BookingRequest): string | null {
  if (!request.userId) {
    return 'User ID is required';
  }
  
  if (!request.pickup || !request.delivery) {
    return 'Pickup and delivery addresses are required';
  }
  
  // Validate pickup address
  if (!request.pickup.name || !request.pickup.address || !request.pickup.postalCode || 
      !request.pickup.city || !request.pickup.country || !request.pickup.phone) {
    return 'All sender details are required';
  }
  
  // Validate delivery address
  if (!request.delivery.name || !request.delivery.address || !request.delivery.postalCode || 
      !request.delivery.city || !request.delivery.country || !request.delivery.phone) {
    return 'All recipient details are required';
  }
  
  // Validate dimensions
  if (!request.dimensions.length || !request.dimensions.width || !request.dimensions.height) {
    return 'Package dimensions are required';
  }
  
  // Validate weight
  if (!request.weight) {
    return 'Package weight is required';
  }
  
  // Validate payment details
  if (!request.paymentMethod) {
    return 'Payment method is required';
  }
  
  if (!request.termsAccepted) {
    return 'You must accept the terms and conditions';
  }
  
  // Validate specific payment details based on method
  if (request.paymentMethod === 'card') {
    if (!request.paymentDetails.cardNumber || !request.paymentDetails.expiryDate || 
        !request.paymentDetails.cvv || !request.paymentDetails.cardholderName) {
      return 'All card details are required';
    }
  } else if (request.paymentMethod === 'swish') {
    if (!request.paymentDetails.swishNumber) {
      return 'Swish number is required';
    }
  } else if (request.paymentMethod === 'ebanking') {
    if (!request.paymentDetails.bankName) {
      return 'Bank selection is required';
    }
  }
  
  return null;
}
