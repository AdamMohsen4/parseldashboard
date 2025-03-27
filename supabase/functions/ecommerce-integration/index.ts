
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Types for the e-commerce shipment request
interface EcommerceShipmentRequest {
  apiKey: string;
  orderNumber: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  pickup: string;
  delivery: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  productDescription?: string;
  includeCompliance?: boolean;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Create a Supabase client
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  // Handle preflight CORS request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Handle POST request for shipment creation
    if (req.method === "POST") {
      const requestData: EcommerceShipmentRequest = await req.json();
      
      // Validate request
      if (!requestData.apiKey || !requestData.orderNumber || !requestData.weight || 
          !requestData.dimensions || !requestData.pickup || !requestData.delivery) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Missing required fields"
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
      
      // Validate API key
      const { data: apiKeyData, error: apiKeyError } = await supabaseAdmin
        .from("api_keys")
        .select("*")
        .eq("api_key", requestData.apiKey)
        .eq("is_active", true)
        .single();
      
      if (apiKeyError || !apiKeyData) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Invalid or inactive API key"
          }),
          {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
      
      // Update last used timestamp for API key
      await supabaseAdmin
        .from("api_keys")
        .update({ last_used_at: new Date().toISOString() })
        .eq("id", apiKeyData.id);
      
      // Generate tracking code and shipment ID
      const trackingCode = `EP${Math.floor(Math.random() * 10000000)}FI`;
      const shipmentId = `SHIP-${Math.floor(Math.random() * 1000000)}`;
      
      // Generate shipping label URL (mock for now)
      const labelUrl = `https://e-parsel.com/labels/${trackingCode}.pdf`;
      
      // Calculate price
      const basePrice = 8; // E-commerce rate
      const compliancePrice = requestData.includeCompliance ? 2 : 0;
      const totalPrice = basePrice + compliancePrice;
      
      // Save booking to database
      const { error: bookingError } = await supabaseAdmin
        .from("booking")
        .insert({
          user_id: apiKeyData.user_id,
          tracking_code: trackingCode,
          carrier_name: "E-Parsel Nordic",
          carrier_price: basePrice,
          weight: requestData.weight,
          dimension_length: requestData.dimensions.length,
          dimension_width: requestData.dimensions.width,
          dimension_height: requestData.dimensions.height,
          pickup_address: requestData.pickup,
          delivery_address: requestData.delivery,
          include_compliance: requestData.includeCompliance || false,
          label_url: labelUrl,
          pickup_time: new Date().toISOString(),
          total_price: totalPrice,
          status: "pending",
          customer_type: "ecommerce",
          business_name: requestData.orderNumber // Store order number in business_name
        });
      
      if (bookingError) {
        console.error("Error saving booking:", bookingError);
        return new Response(
          JSON.stringify({
            success: false,
            message: "Failed to create shipment in database"
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
      
      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          trackingCode,
          shipmentId,
          labelUrl,
          totalPrice
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Handle other HTTP methods
    return new Response(
      JSON.stringify({
        success: false,
        message: "Method not allowed"
      }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
