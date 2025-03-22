
// import { toast } from "@/components/ui/use-toast";
// import { supabase } from "@/integrations/supabase/client";
// import { ThreePLRequest, ThreePLResponse } from "@/types/threePL";

// export const uploadDocument = async (file: File, userId: string): Promise<string | null> => {
//   try {
//     // Create a unique filename with user ID as folder and timestamp to avoid collisions
//     const timestamp = new Date().getTime();
//     const fileExt = file.name.split('.').pop();
//     const filePath = `${userId}/${timestamp}-${file.name}`;
    
//     console.log("Uploading file to:", filePath);
//     console.log("User ID:", userId);
    
//     try {
//       console.log("Attempting to upload file...");
      
//       // Upload file to Supabase storage
//       const { data: uploadData, error: uploadError } = await supabase.storage
//         .from('three_pl_documents')
//         .upload(filePath, file, {
//           cacheControl: '3600',
//           upsert: true // Overwrite if file exists
//         });
      
//       if (uploadError) {
//         console.error("Error uploading document:", uploadError);
//         toast({
//           title: "Upload Failed",
//           description: uploadError.message || "There was a problem uploading your document. Please try again.",
//           variant: "destructive",
//         });
//         return null;
//       }
      
//       console.log("Upload successful, getting public URL");
      
//       // Get the public URL for the uploaded file - IMPORTANT: add await here
//       const { data: publicUrlData } = await supabase.storage
//         .from('three_pl_documents')
//         .getPublicUrl(filePath);
      
//       console.log("Public URL data:", publicUrlData);
      
//       if (!publicUrlData || !publicUrlData.publicUrl) {
//         console.error("Failed to get public URL:", publicUrlData);
//         toast({
//           title: "Upload Issue",
//           description: "File uploaded but could not retrieve URL. Please try again.",
//           variant: "destructive",
//         });
//         return null;
//       }
      
//       console.log("Document public URL:", publicUrlData.publicUrl);
      
//       return publicUrlData.publicUrl;
//     } catch (error) {
//       console.error("Document upload error:", error);
//       toast({
//         title: "Upload Error",
//         description: "An unexpected error occurred during upload.",
//         variant: "destructive",
//       });
//       return null;
//     }
//   } catch (error) {
//     console.error("Document upload error:", error);
//     toast({
//       title: "Upload Error",
//       description: "An unexpected error occurred during upload.",
//       variant: "destructive",
//     });
//     return null;
//   }
// };

// export const submitThreePLRequest = async (request: ThreePLRequest): Promise<ThreePLResponse> => {
//   try {
//     console.log("Submitting 3PL service request:", request);
    
//     // Generate a unique request ID
//     const requestId = `3PL-${Math.floor(Math.random() * 1000000)}`;
    
//     // Save to Supabase
//     const { error } = await supabase
//       .from('three_pl_requests')
//       .insert({
//         request_id: requestId,
//         user_id: request.userId,
//         company_name: request.companyName,
//         contact_name: request.contactName,
//         contact_email: request.contactEmail,
//         contact_phone: request.contactPhone,
//         product_type: request.productType,
//         product_category: request.productCategory,
//         hazardous_materials: request.hazardousMaterials,
//         special_handling_needed: request.specialHandlingNeeded,
//         special_handling_notes: request.specialHandlingNotes,
//         estimated_volume: request.estimatedVolume,
//         temperature_controlled: request.temperatureControlled,
//         security_requirements: request.securityRequirements,
//         average_orders_per_month: request.averageOrdersPerMonth,
//         peak_season_months: request.peakSeasonMonths,
//         international_shipping: request.internationalShipping,
//         integration_needed: request.integrationNeeded,
//         integration_systems: request.integrationSystems,
//         custom_requirements: request.customRequirements,
//         document_url: request.documentUrl,
//         // Add e-commerce specific fields
//         ecommerce_platform: request.ecommercePlatform,
//         ecommerce_store_url: request.ecommerceStoreUrl,
//         ecommerce_sku_count: request.ecommerceSkuCount,
//         ecommerce_order_volume: request.ecommerceOrderVolume
//       });
    
//     if (error) {
//       console.error("Error saving to Supabase:", error);
//       toast({
//         title: "Submission Failed",
//         description: "There was a problem saving your request. Please try again.",
//         variant: "destructive",
//       });
      
//       return {
//         success: false,
//         message: "Database error: " + error.message
//       };
//     }
    
//     // Return success response
//     toast({
//       title: "Request Submitted",
//       description: "Your 3PL service request has been received. We'll contact you shortly.",
//     });
    
//     return {
//       success: true,
//       requestId,
//     };
    
//   } catch (error) {
//     console.error("Error submitting 3PL request:", error);
//     toast({
//       title: "Submission Failed",
//       description: "There was a problem processing your request. Please try again.",
//       variant: "destructive",
//     });
    
//     return {
//       success: false,
//       message: "An unexpected error occurred"
//     };
//   }
// };

// // Function to validate e-commerce platform connection details
// export const validateEcommerceConnection = async (
//   platform: string, 
//   apiKey: string, 
//   storeUrl: string
// ): Promise<{valid: boolean, message: string}> => {
//   // In a real implementation, this would attempt to connect to the e-commerce platform API
//   // For this demo, we'll just validate that all fields are provided
  
//   console.log(`Validating connection to ${platform} at ${storeUrl}`);
  
//   if (!platform || !apiKey || !storeUrl) {
//     return {
//       valid: false,
//       message: "All connection details are required"
//     };
//   }
  
//   // Simple URL validation
//   if (!storeUrl.startsWith('http://') && !storeUrl.startsWith('https://')) {
//     return {
//       valid: false,
//       message: "Store URL must begin with http:// or https://"
//     };
//   }
  
//   // Mock successful validation
//   return {
//     valid: true,
//     message: `Successfully connected to ${platform}`
//   };
// };
