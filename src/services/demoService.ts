
import { supabase } from "@/integrations/supabase/client";

export interface DemoRequest {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  preferred_date?: string;
  message?: string;
  demo_type?: string;
}

export const submitDemoRequest = async (demoRequest: DemoRequest) => {
  try {
    const { data, error } = await supabase
      .from('demo_requests')
      .insert({
        name: demoRequest.name,
        email: demoRequest.email,
        company: demoRequest.company || null,
        phone: demoRequest.phone || null,
        preferred_date: demoRequest.preferred_date || null,
        message: demoRequest.message || null,
        demo_type: demoRequest.demo_type || null
      })
      .select();

    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error("Error submitting demo request:", error);
    return { success: false, error };
  }
};

export const getDemoRequests = async () => {
  try {
    const { data, error } = await supabase
      .from('demo_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching demo requests:", error);
    return { success: false, error, data: [] };
  }
};
