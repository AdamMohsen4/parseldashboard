
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { updateShipmentStatus } from "@/services/shipmentService";
import * as XLSX from 'xlsx';

// Cache for admin stats
let statsCache = null;
let statsCacheTimestamp = 0;
const STATS_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Cache for data lists
const dataCache = new Map();
const DATA_CACHE_EXPIRY = 3 * 60 * 1000; // 3 minutes

export interface AdminStats {
  totalShipments: number;
  pendingShipments: number;
  completedShipments: number;
  totalDemoRequests: number;
  totalSupportTickets: number;
  openSupportTickets: number;
}

export const loadStats = async (): Promise<AdminStats> => {
  try {
    // Check if we have valid cache
    if (statsCache && (Date.now() - statsCacheTimestamp < STATS_CACHE_EXPIRY)) {
      console.log("Returning admin stats from cache");
      return statsCache;
    }

    const { count: totalCount, error: totalError } = await supabase
      .from('booking')
      .select('*', { count: 'exact', head: true });
    
    const { count: pendingCount, error: pendingError } = await supabase
      .from('booking')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'picked_up', 'in_transit']);
    
    const { count: completedCount, error: completedError } = await supabase
      .from('booking')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'delivered');
      
    const { count: demoCount, error: demoError } = await supabase
      .from('demo_requests')
      .select('*', { count: 'exact', head: true });
    
    const { count: supportCount, error: supportError } = await supabase
      .from('support_tickets')
      .select('*', { count: 'exact', head: true });
    
    const { count: openSupportCount, error: openSupportError } = await supabase
      .from('support_tickets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'open');
    
    if (!totalError && !pendingError && !completedError && !demoError && !supportError && !openSupportError) {
      
      const stats = {
        totalShipments: totalCount || 0,
        pendingShipments: pendingCount || 0,
        completedShipments: completedCount || 0,
        totalDemoRequests: demoCount || 0,
        totalSupportTickets: supportCount || 0,
        openSupportTickets: openSupportCount || 0
      };
      
      // Update cache
      statsCache = stats;
      statsCacheTimestamp = Date.now();
      
      return stats;
    } else {
      console.error("Error fetching stats:", { 
        totalError, pendingError, completedError, demoError, supportError, openSupportError
      });
      return {
        totalShipments: 0,
        pendingShipments: 0,
        completedShipments: 0,
        totalDemoRequests: 0,
        totalSupportTickets: 0,
        openSupportTickets: 0
      };
    }
  } catch (error) {
    console.error("Error loading stats:", error);
    return {
      totalShipments: 0,
      pendingShipments: 0,
      completedShipments: 0,
      totalDemoRequests: 0,
      totalSupportTickets: 0,
      openSupportTickets: 0
    };
  }
};

// Helper to invalidate all caches
const invalidateAllCaches = () => {
  statsCache = null;
  statsCacheTimestamp = 0;
  dataCache.clear();
};

export const loadShipmentsWithDateRange = async (startDate: string, endDate: string) => {
  try {
    console.log(`Loading shipments from ${startDate} to ${endDate}`);
    
    // Convert provided dates to ISO format for Supabase query
    const fromDate = new Date(startDate);
    const toDate = new Date(endDate);
    
    // Add one day to end date to include the entire day
    toDate.setDate(toDate.getDate() + 1);
    
    const { data, error } = await supabase
      .from('booking')
      .select('*')
      .gte('created_at', fromDate.toISOString())
      .lt('created_at', toDate.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error loading shipments with date range:", error);
      toast({
        title: "Error Loading Shipments",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
    
    console.log(`Shipments loaded with date range: ${data?.length || 0}`);
    return data || [];
  } catch (error) {
    console.error("Error in loadShipmentsWithDateRange:", error);
    return [];
  }
};

export const exportShipmentsToExcel = async (startDate: string, endDate: string): Promise<boolean> => {
  try {
    const shipments = await loadShipmentsWithDateRange(startDate, endDate);
    
    if (shipments.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no shipments in the selected date range.",
        variant: "destructive",
      });
      return false;
    }
    
    // Format the data for Excel export
    const formattedData = shipments.map(shipment => ({
      "Tracking Code": shipment.tracking_code,
      "User ID": shipment.user_id,
      "Customer Type": shipment.customer_type,
      "Business Name": shipment.business_name || 'N/A',
      "VAT Number": shipment.vat_number || 'N/A',
      "Weight (kg)": shipment.weight,
      "Dimensions (cm)": `${shipment.dimension_length}x${shipment.dimension_width}x${shipment.dimension_height}`,
      "Pickup Address": shipment.pickup_address,
      "Delivery Address": shipment.delivery_address,
      "Carrier": shipment.carrier_name,
      "Carrier Price": shipment.carrier_price,
      "Total Price": shipment.total_price,
      "Pickup Time": shipment.pickup_time,
      "Status": shipment.status,
      "Created At": formatDate(shipment.created_at),
      "Estimated Delivery": shipment.estimated_delivery,
      "Delivery Speed": shipment.delivery_speed
    }));
    
    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Shipments");
    
    // Generate filename with date range
    const fileName = `shipments_${startDate.replace(/-/g, '')}_to_${endDate.replace(/-/g, '')}.xlsx`;
    
    // Export the file
    XLSX.writeFile(workbook, fileName);
    
    toast({
      title: "Export Successful",
      description: `Shipments exported to ${fileName}`,
    });
    
    return true;
  } catch (error) {
    console.error("Error exporting shipments to Excel:", error);
    toast({
      title: "Export Failed",
      description: "Failed to export shipments. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

export const loadShipments = async () => {
  try {
    const cacheKey = 'admin-shipments';
    
    // Check cache first
    const cachedData = dataCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp < DATA_CACHE_EXPIRY)) {
      console.log("Returning shipments from cache");
      return cachedData.data;
    }
    
    console.log("Loading shipments from Supabase...");
    const { data, error } = await supabase
      .from('booking')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error loading shipments:", error);
      toast({
        title: "Error Loading Shipments",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
    
    // Store in cache
    dataCache.set(cacheKey, {
      data: data || [],
      timestamp: Date.now()
    });
    
    console.log("Shipments loaded:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("Error in loadShipments:", error);
    return [];
  }
};

export const loadDemoRequests = async () => {
  try {
    const cacheKey = 'admin-demos';
    
    // Check cache first
    const cachedData = dataCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp < DATA_CACHE_EXPIRY)) {
      console.log("Returning demo requests from cache");
      return cachedData.data;
    }
    
    console.log("Loading demo requests from Supabase...");
    const { data, error } = await supabase
      .from('demo_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error loading demo requests:", error);
      return [];
    }
    
    // Store in cache
    dataCache.set(cacheKey, {
      data: data || [],
      timestamp: Date.now()
    });
    
    console.log("Demo requests loaded:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("Error in loadDemoRequests:", error);
    return [];
  }
};

export const loadSupportTickets = async () => {
  try {
    const cacheKey = 'admin-support-tickets';
    
    // Check cache first
    const cachedData = dataCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp < DATA_CACHE_EXPIRY)) {
      console.log("Returning support tickets from cache");
      return cachedData.data;
    }
    
    console.log("Loading support tickets from Supabase...");
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error loading support tickets:", error);
      toast({
        title: "Error Loading Support Tickets",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
    
    // Store in cache
    dataCache.set(cacheKey, {
      data: data || [],
      timestamp: Date.now()
    });
    
    console.log("Support tickets loaded:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("Error in loadSupportTickets:", error);
    return [];
  }
};

export const loadTicketMessages = async (ticketId: string) => {
  try {
    const cacheKey = `ticket-messages-${ticketId}`;
    
    // Check cache first
    const cachedData = dataCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp < DATA_CACHE_EXPIRY)) {
      console.log("Returning ticket messages from cache");
      return cachedData.data;
    }
    
    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    // Store in cache
    dataCache.set(cacheKey, {
      data: data || [],
      timestamp: Date.now()
    });
    
    return data || [];
  } catch (error) {
    console.error("Error loading ticket messages:", error);
    toast({
      title: "Error",
      description: "Failed to load message history",
      variant: "destructive",
    });
    return [];
  }
};

export const handleShipmentStatusChange = async (shipmentId: number, userId: string, newStatus: "pending" | "picked_up" | "in_transit" | "delivered" | "exception") => {
  try {
    const { error } = await supabase
      .from('booking')
      .update({ status: newStatus })
      .eq('id', shipmentId);
    
    if (error) {
      console.error("Supabase update error:", error);
      toast({
        title: "Status Update Failed",
        description: "Could not update the shipment status in the database.",
        variant: "destructive",
      });
      return false;
    }
    
    const event = {
      date: new Date().toISOString(),
      location: "Admin Dashboard",
      status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1).replace(/_/g, ' '),
      description: `Status updated by admin`
    };
    
    await updateShipmentStatus(shipmentId.toString(), userId, newStatus, event);
    
    // Invalidate caches after successful update
    invalidateAllCaches();
    
    toast({
      title: "Status Updated",
      description: `Shipment status changed to ${newStatus.replace(/_/g, ' ')}.`,
    });
    
    return true;
  } catch (error) {
    console.error("Error updating status:", error);
    toast({
      title: "Update Failed",
      description: "An unexpected error occurred while updating the status.",
      variant: "destructive",
    });
    return false;
  }
};

export const handleDemoStatusChange = async (demoId: string, newStatus: string) => {
  try {
    const { error } = await supabase
      .from('demo_requests')
      .update({ status: newStatus })
      .eq('id', demoId);
    
    if (error) {
      console.error("Supabase update error:", error);
      toast({
        title: "Status Update Failed",
        description: "Could not update the demo request status.",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Status Updated",
      description: `Demo request status changed to ${newStatus}.`,
    });
    
    return true;
  } catch (error) {
    console.error("Error updating demo status:", error);
    toast({
      title: "Update Failed",
      description: "An unexpected error occurred while updating the status.",
      variant: "destructive",
    });
    return false;
  }
};

export const handleSupportTicketStatusChange = async (ticketId: string, newStatus: string) => {
  try {
    const { error } = await supabase
      .from('support_tickets')
      .update({ status: newStatus })
      .eq('id', ticketId);
    
    if (error) {
      console.error("Supabase update error:", error);
      toast({
        title: "Status Update Failed",
        description: "Could not update the support ticket status.",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Status Updated",
      description: `Support ticket status changed to ${newStatus}.`,
    });
    
    return true;
  } catch (error) {
    console.error("Error updating support ticket status:", error);
    toast({
      title: "Update Failed",
      description: "An unexpected error occurred while updating the status.",
      variant: "destructive",
    });
    return false;
  }
};

export const handleSendMessage = async (ticketId: string, userId: string, message: string, isAdmin: boolean = true) => {
  try {
    const messageData = {
      ticket_id: ticketId,
      user_id: userId,
      message: message.trim(),
      is_admin: isAdmin
    };

    const { error } = await supabase
      .from('support_messages')
      .insert(messageData);
    
    if (error) throw error;
    
    toast({
      title: "Message Sent",
      description: "Your response has been sent to the user.",
    });
    
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    toast({
      title: "Error",
      description: "Failed to send your response",
      variant: "destructive",
    });
    return false;
  }
};

const statusColorCache = new Map();

export const getStatusBadgeColor = (status: string) => {
  if (statusColorCache.has(status)) {
    return statusColorCache.get(status);
  }
  
  let color;
  switch (status) {
    case 'delivered': color = "bg-green-100 text-green-800"; break;
    case 'in_transit': color = "bg-blue-100 text-blue-800"; break;
    case 'pending': color = "bg-yellow-100 text-yellow-800"; break;
    case 'picked_up': color = "bg-purple-100 text-purple-800"; break;
    case 'exception': color = "bg-red-100 text-red-800"; break;
    case 'cancelled': color = "bg-red-100 text-red-800"; break;
    case 'scheduled': color = "bg-blue-100 text-blue-800"; break;
    case 'completed': color = "bg-green-100 text-green-800"; break;
    default: color = "bg-gray-100 text-gray-800"; break;
  }
  
  statusColorCache.set(status, color);
  return color;
};

const dateFormatCache = new Map();

export const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  
  if (dateFormatCache.has(dateString)) {
    return dateFormatCache.get(dateString);
  }
  
  const formatted = new Date(dateString).toLocaleString();
  dateFormatCache.set(dateString, formatted);
  return formatted;
};
