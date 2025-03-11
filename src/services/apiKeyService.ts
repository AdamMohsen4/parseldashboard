
import { supabase } from "@/integrations/supabase/client";
import { ApiKey } from "@/types/booking";
import { toast } from "@/components/ui/use-toast";

// Generate a random API key
export const generateApiKey = (): string => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const prefix = "ep_live_";
  let result = prefix;
  
  for (let i = 0; i < 24; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return result;
};

// Create a new API key for a user
export const createApiKey = async (userId: string, businessName: string): Promise<ApiKey | null> => {
  try {
    const apiKey = generateApiKey();
    
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: userId,
        api_key: apiKey,
        business_name: businessName
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating API key:", error);
      toast({
        title: "API Key Creation Failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      apiKey: data.api_key,
      businessName: data.business_name,
      createdAt: data.created_at,
      lastUsedAt: data.last_used_at,
      isActive: data.is_active
    };
  } catch (error) {
    console.error("Error in createApiKey:", error);
    return null;
  }
};

// Get all API keys for a user
export const getUserApiKeys = async (userId: string): Promise<ApiKey[]> => {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching API keys:", error);
      return [];
    }
    
    return data.map(key => ({
      id: key.id,
      userId: key.user_id,
      apiKey: key.api_key,
      businessName: key.business_name,
      createdAt: key.created_at,
      lastUsedAt: key.last_used_at,
      isActive: key.is_active
    }));
  } catch (error) {
    console.error("Error in getUserApiKeys:", error);
    return [];
  }
};

// Delete an API key
export const deleteApiKey = async (keyId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId);
    
    if (error) {
      console.error("Error deleting API key:", error);
      toast({
        title: "API Key Deletion Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteApiKey:", error);
    return false;
  }
};

// Toggle API key active status
export const toggleApiKeyStatus = async (keyId: string, isActive: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('api_keys')
      .update({ is_active: isActive })
      .eq('id', keyId);
    
    if (error) {
      console.error("Error updating API key status:", error);
      toast({
        title: "API Key Update Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in toggleApiKeyStatus:", error);
    return false;
  }
};

// Validate an API key
export const validateApiKey = async (apiKey: string): Promise<{valid: boolean, userId?: string, businessName?: string}> => {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('api_key', apiKey)
      .eq('is_active', true)
      .maybeSingle();
    
    if (error || !data) {
      console.error("Error validating API key:", error);
      return { valid: false };
    }
    
    // Update last used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id);
    
    return { 
      valid: true, 
      userId: data.user_id,
      businessName: data.business_name
    };
  } catch (error) {
    console.error("Error in validateApiKey:", error);
    return { valid: false };
  }
};
