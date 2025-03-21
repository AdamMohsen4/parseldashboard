import { toast } from "@/components/ui/use-toast";
import { generateLabel } from "./labelService";
import { schedulePickup } from "./pickupService";
import { saveShipment } from "./shipmentService";
import { BookingRequest, BookingResponse } from "@/types/booking";
import { calculateTotalPrice, calculateEstimatedDelivery, generateShipmentId, generateTrackingCode } from "./bookingUtils";
import { saveBookingToSupabase } from "./bookingDb";
import { supabase } from "@/integrations/supabase/client";

export type { BookingRequest, BookingResponse };

const validateBookingRequest = (request: BookingRequest): { valid: boolean; message?: string } => {
  if (!request.weight || parseFloat(request.weight) <= 0) {
    return { valid: false, message: "Invalid package weight" };
  }

  if (!request.dimensions || 
      !request.dimensions.length || 
      !request.dimensions.width || 
      !request.dimensions.height) {
    return { valid: false, message: "Package dimensions are incomplete" };
  }

  if (!request.pickup) {
    return { valid: false, message: "Pickup address is required" };
  }

  if (!request.delivery) {
    return { valid: false, message: "Delivery address is required" };
  }

  if (!request.carrier || !request.carrier.name) {
    return { valid: false, message: "Carrier information is required" };
  }

  if (!request.userId) {
    return { valid: false, message: "User ID is required" };
  }

  if (request.weight && parseFloat(request.weight) > 100) {
    return { valid: false, message: "Package weight exceeds maximum allowed (100kg)" };
  }

  return { valid: true };
};

export const bookShipment = async (request: BookingRequest): Promise<BookingResponse> => {
  try {
    console.log("Booking shipment with request:", request);
    
    const validation = validateBookingRequest(request);
    if (!validation.valid) {
      toast({
        title: "Validation Error",
        description: validation.message || "Please check your shipment details",
        variant: "destructive",
      });
      
      return {
        success: false,
        message: validation.message || "Invalid booking request"
      };
    }
    
    const shipmentId = generateShipmentId();
    const trackingCode = generateTrackingCode();
    const cancellationDeadline = new Date();
    cancellationDeadline.setHours(cancellationDeadline.getHours() + 1);
    
    const labelResult = await generateLabel({
      shipmentId,
      carrierName: request.carrier.name,
      trackingCode,
      senderAddress: request.pickup,
      recipientAddress: request.delivery,
      packageDetails: {
        weight: request.weight,
        dimensions: `${request.dimensions.length}x${request.dimensions.width}x${request.dimensions.height} cm`
      }
    });
    
    if (!labelResult.success) {
      toast({
        title: "Label Generation Failed",
        description: "Unable to generate shipping label. Please try again.",
        variant: "destructive",
      });
      
      return {
        success: false,
        message: "Failed to generate shipping label"
      };
    }
    
    const pickupResult = await schedulePickup({
      shipmentId,
      carrierName: request.carrier.name,
      pickupAddress: request.pickup,
      slotId: request.pickupSlotId
    });
    
    if (!pickupResult.confirmed) {
      toast({
        title: "Pickup Scheduling Failed",
        description: "Unable to schedule pickup. Please try a different time or contact support.",
        variant: "destructive",
      });
      
      return {
        success: false,
        message: "Failed to schedule pickup"
      };
    }
    
    const totalPrice = calculateTotalPrice(request.carrier.price, request.includeCompliance);
    const estimatedDelivery = calculateEstimatedDelivery(request.deliverySpeed);
    
    const supabaseSaveSuccess = await saveBookingToSupabase(
      request,
      trackingCode,
      labelResult.labelUrl,
      pickupResult.pickupTime!,
      totalPrice,
      estimatedDelivery,
      cancellationDeadline
    );
    
    if (!supabaseSaveSuccess) {
      console.error("Supabase save failed, falling back to local storage");
      toast({
        title: "Database Save Warning",
        description: "Could not save to primary database, using backup storage instead.",
        variant: "destructive",
      });
      
      try {
        const shipmentData = await saveShipment({
          userId: request.userId,
          trackingCode,
          carrier: request.carrier,
          weight: request.weight,
          dimensions: request.dimensions,
          pickup: request.pickup,
          delivery: request.delivery,
          deliverySpeed: request.deliverySpeed,
          includeCompliance: request.includeCompliance,
          labelUrl: labelResult.labelUrl,
          pickupTime: pickupResult.pickupTime,
          totalPrice,
          status: 'pending',
          estimatedDelivery
        });
        
        if (!shipmentData) {
          throw new Error("Failed to save shipment data to local storage");
        }
      } catch (storageError) {
        console.error("Local storage save failed:", storageError);
        toast({
          title: "Booking Storage Failed",
          description: "Unable to save your booking. Please take a screenshot of your booking details.",
          variant: "destructive",
        });
        
        return {
          success: true,
          shipmentId,
          trackingCode,
          labelUrl: labelResult.labelUrl,
          pickupTime: pickupResult.pickupTime,
          totalPrice,
          message: "Booking completed but not saved. Please save your tracking information."
        };
      }
    } else {
      console.log("Successfully saved booking to Supabase");
      toast({
        title: "Booking Saved",
        description: "Your shipment has been successfully recorded in our database.",
      });
    }
    
    return {
      success: true,
      shipmentId,
      trackingCode,
      labelUrl: labelResult.labelUrl,
      pickupTime: pickupResult.pickupTime,
      totalPrice,
      cancellationDeadline: cancellationDeadline.toISOString(),
      canBeCancelled: true
    };
    
  } catch (error) {
    console.error("Error booking shipment:", error);
    
    let errorMessage = "An unexpected error occurred";
    
    if (error instanceof Error) {
      console.error("Error details:", error.message, error.stack);
      
      if (error.message.includes("label")) {
        errorMessage = "Error generating shipping label";
      } else if (error.message.includes("pickup")) {
        errorMessage = "Error scheduling pickup";
      } else if (error.message.includes("save")) {
        errorMessage = "Error saving shipment data";
      }
    }
    
    toast({
      title: "Booking Failed",
      description: "There was a problem processing your booking. Please try again.",
      variant: "destructive",
    });
    
    return {
      success: false,
      message: errorMessage
    };
  }
};

export const cancelBooking = async (trackingCode: string, userId: string): Promise<boolean> => {
  try {
    const { data: booking, error } = await supabase
      .from('booking')
      .select('*')
      .eq('tracking_code', trackingCode)
      .eq('user_id', userId)
      .single();
      
    if (error || !booking) {
      toast({
        title: "Booking Not Found",
        description: "Unable to find the specified booking.",
        variant: "destructive",
      });
      return false;
    }
    
    const cancellationDeadline = new Date(booking.created_at);
    cancellationDeadline.setHours(cancellationDeadline.getHours() + 1);
    
    if (new Date() > cancellationDeadline) {
      toast({
        title: "Cancellation Failed",
        description: "The cancellation window (1 hour) has expired.",
        variant: "destructive",
      });
      return false;
    }
    
    const { error: updateError } = await supabase
      .from('booking')
      .update({ status: 'cancelled' })
      .eq('tracking_code', trackingCode)
      .eq('user_id', userId);
      
    if (updateError) {
      toast({
        title: "Cancellation Failed",
        description: "Unable to cancel the booking. Please try again.",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Booking Cancelled",
      description: "Your shipment has been successfully cancelled.",
    });
    
    return true;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    toast({
      title: "Cancellation Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};
