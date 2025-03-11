
import { toast } from "@/components/ui/use-toast";
import { generateLabel } from "./labelService";
import { schedulePickup } from "./pickupService";
import { saveShipment } from "./shipmentService";
import { BookingRequest, BookingResponse } from "@/types/booking";
import { calculateTotalPrice, calculateEstimatedDelivery, generateShipmentId, generateTrackingCode } from "./bookingUtils";
import { saveBookingToSupabase } from "./bookingDb";

export type { BookingRequest, BookingResponse };

// Input validation function to check required fields
const validateBookingRequest = (request: BookingRequest): { valid: boolean; message?: string } => {
  // Check for required fields
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

  // Additional business logic validation
  if (request.weight && parseFloat(request.weight) > 100) {
    return { valid: false, message: "Package weight exceeds maximum allowed (100kg)" };
  }

  // All validations passed
  return { valid: true };
};

export const bookShipment = async (request: BookingRequest): Promise<BookingResponse> => {
  try {
    console.log("Booking shipment with request:", request);
    
    // Validate the request
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
    
    // Generate IDs
    const shipmentId = generateShipmentId();
    const trackingCode = generateTrackingCode();
    
    // Step 1: Generate label
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
        description: "Unable to generate shipping label. Please try again or contact support.",
        variant: "destructive",
      });
      
      return {
        success: false,
        message: "Failed to generate shipping label"
      };
    }
    
    // Step 2: Schedule pickup
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
    
    // Calculate total price and delivery date
    const totalPrice = calculateTotalPrice(request.carrier.price, request.includeCompliance);
    const estimatedDelivery = calculateEstimatedDelivery(request.deliverySpeed);
    
    // Step 3: Save the booking to Supabase
    console.log("Attempting to save booking to Supabase with userId:", request.userId);
    const supabaseSaveSuccess = await saveBookingToSupabase(
      request,
      trackingCode,
      labelResult.labelUrl,
      pickupResult.pickupTime!,
      totalPrice,
      estimatedDelivery
    );
    
    // If Supabase save fails, fall back to local storage
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
        
        // Still return success since the booking was processed
        // but with a warning that it might not be retrievable later
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
    
    // Return the combined result
    return {
      success: true,
      shipmentId,
      trackingCode,
      labelUrl: labelResult.labelUrl,
      pickupTime: pickupResult.pickupTime,
      totalPrice
    };
    
  } catch (error) {
    console.error("Error booking shipment:", error);
    
    // Provide more detailed error messaging based on where the error occurred
    let errorMessage = "An unexpected error occurred";
    
    if (error instanceof Error) {
      // Log the full error for debugging
      console.error("Error details:", error.message, error.stack);
      
      // Tailor the user-facing message based on error content if possible
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
