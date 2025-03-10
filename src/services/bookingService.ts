
// Centralized booking service that handles the entire booking process
// Integrates label generation and pickup scheduling

import { toast } from "@/components/ui/use-toast";
import { generateLabel } from "./labelService";
import { schedulePickup } from "./pickupService";
import { saveShipment, Shipment } from "./shipmentService";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";

export interface BookingRequest {
  // Package details
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  
  // Addresses
  pickup: string;
  delivery: string;
  
  // Carrier details
  carrier: {
    name: string;
    price: number;
  };
  
  // Options
  deliverySpeed: string;
  includeCompliance: boolean;
  
  // Pickup slot (optional)
  pickupSlotId?: string;
  
  // User ID
  userId: string;
}

export interface BookingResponse {
  success: boolean;
  shipmentId?: string;
  trackingCode?: string;
  labelUrl?: string;
  pickupTime?: string;
  totalPrice?: number;
  message?: string;
}

export const bookShipment = async (request: BookingRequest): Promise<BookingResponse> => {
  try {
    console.log("Booking shipment:", request);
    
    // Generate a random shipment ID and tracking code
    const shipmentId = `SHIP-${Math.floor(Math.random() * 1000000)}`;
    const trackingCode = `EP${Math.floor(Math.random() * 10000000)}FI`;
    
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
      return {
        success: false,
        message: "Failed to schedule pickup"
      };
    }
    
    // Calculate total price (base price + compliance fee if selected)
    const complianceFee = request.includeCompliance ? 2 : 0;
    const totalPrice = request.carrier.price + complianceFee;
    
    // Calculate estimated delivery date
    const estimatedDelivery = calculateEstimatedDelivery(request.deliverySpeed);
    
    // Step 3a: Save the shipment to Supabase
    try {
      const { data, error } = await supabase
        .from('Booking')
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
          label_url: labelResult.labelUrl,
          pickup_time: pickupResult.pickupTime,
          total_price: totalPrice,
          status: 'pending',
          estimated_delivery: estimatedDelivery
        })
        .select()
        .single();
        
      if (error) {
        console.error("Error saving to Supabase:", error);
        // If Supabase save fails, fall back to local storage
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
          return {
            success: false,
            message: "Failed to save shipment data"
          };
        }
      }
    } catch (supabaseError) {
      console.error("Supabase insertion error:", supabaseError);
      // Fall back to local storage
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
        return {
          success: false,
          message: "Failed to save shipment data"
        };
      }
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
    toast({
      title: "Booking Failed",
      description: "There was a problem processing your booking. Please try again.",
      variant: "destructive",
    });
    return {
      success: false,
      message: "An unexpected error occurred"
    };
  }
};

// Helper function to calculate the estimated delivery date
function calculateEstimatedDelivery(deliverySpeed: string): string {
  const date = new Date();
  
  // Add days based on delivery speed
  if (deliverySpeed === 'standard') {
    date.setDate(date.getDate() + 3);
  } else if (deliverySpeed === 'express') {
    date.setDate(date.getDate() + 1);
  } else {
    date.setDate(date.getDate() + 5); // Default for economy or other options
  }
  
  // Format the date
  return date.toISOString().split('T')[0];
}
