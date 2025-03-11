
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ThreePLRequest, ThreePLResponse } from "@/types/threePL";

export const uploadDocument = async (file: File, userId: string): Promise<string | null> => {
  try {
    // Create a unique filename with user ID as folder and timestamp to avoid collisions
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${timestamp}-${file.name}`;
    
    console.log("Uploading file to:", filePath);
    console.log("User ID:", userId);
    
    // Check if bucket exists and is accessible
    const { data: bucketData, error: bucketError } = await supabase.storage
      .getBucket('three_pl_documents');
      
    if (bucketError) {
      console.error("Error accessing bucket:", bucketError);
      toast({
        title: "Upload Failed",
        description: "Storage bucket not accessible. Please contact support.",
        variant: "destructive",
      });
      return null;
    }
    
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('three_pl_documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your document. Please try again.",
        variant: "destructive",
      });
      return null;
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('three_pl_documents')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error("Document upload error:", error);
    toast({
      title: "Upload Error",
      description: "An unexpected error occurred during upload.",
      variant: "destructive",
    });
    return null;
  }
};

export const submitThreePLRequest = async (request: ThreePLRequest): Promise<ThreePLResponse> => {
  try {
    console.log("Submitting 3PL service request:", request);
    
    // Generate a unique request ID
    const requestId = `3PL-${Math.floor(Math.random() * 1000000)}`;
    
    // Save to Supabase
    const { error } = await supabase
      .from('three_pl_requests')
      .insert({
        request_id: requestId,
        user_id: request.userId,
        company_name: request.companyName,
        contact_name: request.contactName,
        contact_email: request.contactEmail,
        contact_phone: request.contactPhone,
        product_type: request.productType,
        product_category: request.productCategory,
        hazardous_materials: request.hazardousMaterials,
        special_handling_needed: request.specialHandlingNeeded,
        special_handling_notes: request.specialHandlingNotes,
        estimated_volume: request.estimatedVolume,
        temperature_controlled: request.temperatureControlled,
        security_requirements: request.securityRequirements,
        average_orders_per_month: request.averageOrdersPerMonth,
        peak_season_months: request.peakSeasonMonths,
        international_shipping: request.internationalShipping,
        integration_needed: request.integrationNeeded,
        integration_systems: request.integrationSystems,
        custom_requirements: request.customRequirements,
        document_url: request.documentUrl
      });
    
    if (error) {
      console.error("Error saving to Supabase:", error);
      toast({
        title: "Submission Failed",
        description: "There was a problem saving your request. Please try again.",
        variant: "destructive",
      });
      
      return {
        success: false,
        message: "Database error: " + error.message
      };
    }
    
    // Return success response
    toast({
      title: "Request Submitted",
      description: "Your 3PL service request has been received. We'll contact you shortly.",
    });
    
    return {
      success: true,
      requestId,
    };
    
  } catch (error) {
    console.error("Error submitting 3PL request:", error);
    toast({
      title: "Submission Failed",
      description: "There was a problem processing your request. Please try again.",
      variant: "destructive",
    });
    
    return {
      success: false,
      message: "An unexpected error occurred"
    };
  }
};
