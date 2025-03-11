import { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { BarChart, CheckCircle, FileText, Search, Users, Calendar, Building, MessageCircle, HelpCircle, Eye, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateShipmentStatus } from "@/services/shipmentService";
import { useUser } from "@clerk/clerk-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const AdminDashboardPage = () => {
  const { user } = useUser();
  const [mainTab, setMainTab] = useState("shipments");
  const [shipmentsTab, setShipmentsTab] = useState("all");
  const [demosTab, setDemosTab] = useState("all");
  const [supportTab, setSupportTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalShipments: 0,
    pendingShipments: 0,
    completedShipments: 0,
    totalDemoRequests: 0,
    totalCollaborations: 0,
    totalSupportTickets: 0,
    openSupportTickets: 0
  });

  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [shipmentSearchQuery, setShipmentSearchQuery] = useState("");

  const [demoRequests, setDemoRequests] = useState([]);
  const [filteredDemoRequests, setFilteredDemoRequests] = useState([]);
  const [demoSearchQuery, setDemoSearchQuery] = useState("");

  const [collaborations, setCollaborations] = useState([]);
  const [filteredCollaborations, setFilteredCollaborations] = useState([]);
  const [collaborationSearchQuery, setCollaborationSearchQuery] = useState("");

  const [supportTickets, setSupportTickets] = useState([]);
  const [filteredSupportTickets, setFilteredSupportTickets] = useState([]);
  const [supportSearchQuery, setSupportSearchQuery] = useState("");

  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [ticketMessages, setTicketMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    if (shipments.length > 0) {
      filterShipments();
    }
  }, [shipmentSearchQuery, shipments]);

  useEffect(() => {
    if (demoRequests.length > 0) {
      filterDemoRequests();
    }
  }, [demoSearchQuery, demoRequests]);

  useEffect(() => {
    if (collaborations.length > 0) {
      filterCollaborations();
    }
  }, [collaborationSearchQuery, collaborations]);

  useEffect(() => {
    if (supportTickets.length > 0) {
      filterSupportTickets();
    }
  }, [supportSearchQuery, supportTickets]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadShipments(),
        loadDemoRequests(),
        loadCollaborations(),
        loadSupportTickets(),
        loadStats()
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error Loading Data",
        description: "There was a problem retrieving data from the database.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterShipments = () => {
    if (!shipmentSearchQuery.trim()) {
      setFilteredShipments(shipments);
      return;
    }
    
    const lowerCaseQuery = shipmentSearchQuery.toLowerCase();
    const filtered = shipments.filter(shipment => 
      shipment.tracking_code?.toLowerCase().includes(lowerCaseQuery) ||
      shipment.user_id?.toLowerCase().includes(lowerCaseQuery) ||
      shipment.pickup_address?.toLowerCase().includes(lowerCaseQuery) ||
      shipment.delivery_address?.toLowerCase().includes(lowerCaseQuery) ||
      shipment.status?.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredShipments(filtered);
  };

  const filterDemoRequests = () => {
    if (!demoSearchQuery.trim()) {
      setFilteredDemoRequests(demoRequests);
      return;
    }
    
    const lowerCaseQuery = demoSearchQuery.toLowerCase();
    const filtered = demoRequests.filter(demo => 
      demo.name?.toLowerCase().includes(lowerCaseQuery) ||
      demo.email?.toLowerCase().includes(lowerCaseQuery) ||
      demo.company?.toLowerCase().includes(lowerCaseQuery) ||
      demo.status?.toLowerCase().includes(lowerCaseQuery) ||
      demo.demo_type?.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredDemoRequests(filtered);
  };

  const filterCollaborations = () => {
    if (!collaborationSearchQuery.trim()) {
      setFilteredCollaborations(collaborations);
      return;
    }
    
    const lowerCaseQuery = collaborationSearchQuery.toLowerCase();
    const filtered = collaborations.filter(collab => 
      collab.business_name?.toLowerCase().includes(lowerCaseQuery) ||
      collab.destination?.toLowerCase().includes(lowerCaseQuery) ||
      collab.contact_email?.toLowerCase().includes(lowerCaseQuery) ||
      collab.volume?.toLowerCase().includes(lowerCaseQuery) ||
      collab.frequency?.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredCollaborations(filtered);
  };

  const filterSupportTickets = () => {
    if (!supportSearchQuery.trim()) {
      setFilteredSupportTickets(supportTickets);
      return;
    }
    
    const lowerCaseQuery = supportSearchQuery.toLowerCase();
    const filtered = supportTickets.filter(ticket => 
      ticket.subject?.toLowerCase().includes(lowerCaseQuery) ||
      ticket.message?.toLowerCase().includes(lowerCaseQuery) ||
      ticket.user_id?.toLowerCase().includes(lowerCaseQuery) ||
      ticket.category?.toLowerCase().includes(lowerCaseQuery) ||
      ticket.priority?.toLowerCase().includes(lowerCaseQuery) ||
      ticket.status?.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredSupportTickets(filtered);
  };

  const handleStatusChange = async (shipmentId, userId, newStatus) => {
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
        return;
      }
      
      const event = {
        date: new Date().toISOString(),
        location: "Admin Dashboard",
        status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1).replace(/_/g, ' '),
        description: `Status updated by admin`
      };
      
      await updateShipmentStatus(shipmentId, userId, newStatus, event);
      
      setShipments(shipments.map(s => 
        s.id === shipmentId ? { ...s, status: newStatus } : s
      ));
      
      toast({
        title: "Status Updated",
        description: `Shipment status changed to ${newStatus.replace(/_/g, ' ')}.`,
      });
      
      loadShipments();
      loadStats();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred while updating the status.",
        variant: "destructive",
      });
    }
  };

  const handleDemoStatusChange = async (demoId, newStatus) => {
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
        return;
      }
      
      toast({
        title: "Status Updated",
        description: `Demo request status changed to ${newStatus}.`,
      });
      
      loadDemoRequests();
    } catch (error) {
      console.error("Error updating demo status:", error);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred while updating the status.",
        variant: "destructive",
      });
    }
  };

  const handleSupportTicketStatusChange = async (ticketId, newStatus) => {
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
        return;
      }
      
      toast({
        title: "Status Updated",
        description: `Support ticket status changed to ${newStatus}.`,
      });
      
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({...selectedTicket, status: newStatus});
      }
      
      loadSupportTickets();
      loadStats();
    } catch (error) {
      console.error("Error updating support ticket status:", error);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred while updating the status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'delivered': return "bg-green-100 text-green-800";
      case 'in_transit': return "bg-blue-100 text-blue-800";
      case 'pending': return "bg-yellow-100 text-yellow-800";
      case 'picked_up': return "bg-purple-100 text-purple-800";
      case 'exception': return "bg-red-100 text-red-800";
      case 'scheduled': return "bg-blue-100 text-blue-800";
      case 'completed': return "bg-green-100 text-green-800";
      case 'cancelled': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const handleRefreshData = () => {
    loadData();
    toast({
      title: "Data Refreshed",
      description: "The dashboard data has been updated.",
    });
  };

  const loadShipments = async () => {
    try {
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
        return;
      }
      
      console.log("Shipments loaded:", data?.length || 0);
      setShipments(data || []);
      setFilteredShipments(data || []);
    } catch (error) {
      console.error("Error in loadShipments:", error);
    }
  };

  const loadDemoRequests = async () => {
    try {
      console.log("Loading demo requests from Supabase...");
      const { data, error } = await supabase
        .from('demo_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error loading demo requests:", error);
        return;
      }
      
      console.log("Demo requests loaded:", data?.length || 0);
      setDemoRequests(data || []);
      setFilteredDemoRequests(data || []);
    } catch (error) {
      console.error("Error in loadDemoRequests:", error);
    }
  };

  const loadCollaborations = async () => {
    try {
      console.log("Loading collaborations from Supabase...");
      const { data, error } = await supabase
        .from('collaborations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error loading collaborations:", error);
        return;
      }
      
      console.log("Collaborations loaded:", data?.length || 0);
      setCollaborations(data || []);
      setFilteredCollaborations(data || []);
    } catch (error) {
      console.error("Error in loadCollaborations:", error);
    }
  };

  const loadSupportTickets = async () => {
    try {
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
        return;
      }
      
      console.log("Support tickets loaded:", data?.length || 0);
      setSupportTickets(data || []);
      setFilteredSupportTickets(data || []);
    } catch (error) {
      console.error("Error in loadSupportTickets:", error);
    }
  };

  const loadStats = async () => {
    try {
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
        
      const { count: collabCount, error: collabError } = await supabase
        .from('collaborations')
        .select('*', { count: 'exact', head: true });
      
      const { count: supportCount, error: supportError } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true });
      
      const { count: openSupportCount, error: openSupportError } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');
      
      if (!totalError && !pendingError && !completedError && !demoError && !collabError && 
          !supportError && !openSupportError) {
        setStats({
          totalShipments: totalCount || 0,
          pendingShipments: pendingCount || 0,
          completedShipments: completedCount || 0,
          totalDemoRequests: demoCount || 0,
          totalCollaborations: collabCount || 0,
          totalSupportTickets: supportCount || 0,
          openSupportTickets: openSupportCount || 0
        });
      } else {
        console.error("Error fetching stats:", { 
          totalError, pendingError, completedError, demoError, collabError, supportError, openSupportError
        });
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadTicketMessages = async (ticketId) => {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setTicketMessages(data || []);
    } catch (error) {
      console.error("Error loading ticket messages:", error);
      toast({
        title: "Error",
        description: "Failed to load message history",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket || !user) return;
    
    setSendingMessage(true);
    try {
      const messageData = {
        ticket_id: selectedTicket.id,
        user_id: user.id,
        message: newMessage.trim(),
        is_admin: true
      };

      const { error } = await supabase
        .from('support_messages')
        .insert(messageData);
      
      if (error) throw error;
      
      if (selectedTicket.status === 'open') {
        await handleSupportTicketStatusChange(selectedTicket.id, 'in_progress');
      }
      
      await loadTicketMessages(selectedTicket.id);
      
      setNewMessage('');
      
      toast({
        title: "Message Sent",
        description: "Your response has been sent to the user.",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send your response",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const openTicketDetails = async (ticket) => {
    setSelectedTicket(ticket);
    setTicketDialogOpen(true);
    await loadTicketMessages(ticket.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage shipments, demo requests, collaborations and support tickets
              </p>
            </div>
            <Button onClick={handleRefreshData}>
              Refresh Data
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Shipments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalShipments}</div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Shipments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingShipments}</div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed Shipments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedShipments}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stats.totalShipments > 0 
                    ? `${Math.round((stats.completedShipments / stats.totalShipments) * 100)}% completion rate` 
                    : 'No shipments recorded'}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Demo Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDemoRequests}</div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Collaborations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCollaborations}</div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Support Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSupportTickets}</div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Open Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.openSupportTickets}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stats.totalSupportTickets > 0 
                    ? `${Math.round((stats.openSupportTickets / stats.totalSupportTickets) * 100)}% open rate` 
                    : 'No support tickets'}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <Tabs value={mainTab} onValueChange={setMainTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="shipments">Shipments</TabsTrigger>
                  <TabsTrigger value="demos">Demo Requests</TabsTrigger>
                  <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
                  <TabsTrigger value="support">Support Tickets</TabsTrigger>
                </TabsList>
                
                <CardTitle>
                  {mainTab === "shipments" && "Shipment Management"}
                  {mainTab === "demos" && "Demo Requests Management"}
                  {mainTab === "collaborations" && "Collaborations Management"}
                  {mainTab === "support" && "Support Tickets Management"}
                </CardTitle>
                
                <CardDescription>
                  {mainTab === "shipments" && "View and manage all shipments across the platform"}
                  {mainTab === "demos" && "Review and respond to demo requests from potential customers"}
                  {mainTab === "collaborations" && "Manage business collaboration proposals"}
                  {mainTab === "support" && "Respond to customer support inquiries and issues"}
                </CardDescription>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              <Tabs value={mainTab}>
                <TabsContent value="shipments">
                  <div className="mb-4 flex items-center gap-2">
                    <Search className="text-muted-foreground h-5 w-5" />
                    <Input
                      placeholder="Search by tracking code, user, address..."
                      value={shipmentSearchQuery}
                      onChange={(e) => setShipmentSearchQuery(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  
                  <Tabs value={shipmentsTab} onValueChange={setShipmentsTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All Shipments</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="in_transit">In Transit</TabsTrigger>
                      <TabsTrigger value="delivered">Delivered</TabsTrigger>
                      <TabsTrigger value="exception">Exceptions</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all">
                      <ShipmentTable 
                        shipments={filteredShipments} 
                        isLoading={isLoading} 
                        onStatusChange={handleStatusChange}
                        getStatusBadgeColor={getStatusBadgeColor}
                        formatDate={formatDate}
                      />
                    </TabsContent>
                    
                    <TabsContent value="pending">
                      <ShipmentTable 
                        shipments={filteredShipments.filter(s => s.status === 'pending')} 
                        isLoading={isLoading} 
                        onStatusChange={handleStatusChange}
                        getStatusBadgeColor={getStatusBadgeColor}
                        formatDate={formatDate}
                      />
                    </TabsContent>
                    
                    <TabsContent value="in_transit">
                      <ShipmentTable 
                        shipments={filteredShipments.filter(s => s.status === 'in_transit')} 
                        isLoading={isLoading}
                        onStatusChange={handleStatusChange}
                        getStatusBadgeColor={getStatusBadgeColor}
                        formatDate={formatDate}
                      />
                    </TabsContent>
                    
                    <TabsContent value="delivered">
                      <ShipmentTable 
                        shipments={filteredShipments.filter(s => s.status === 'delivered')} 
                        isLoading={isLoading}
                        onStatusChange={handleStatusChange}
                        getStatusBadgeColor={getStatusBadgeColor}
                        formatDate={formatDate}
                      />
                    </TabsContent>
                    
                    <TabsContent value="exception">
                      <ShipmentTable 
                        shipments={filteredShipments.filter(s => s.status === 'exception')} 
                        isLoading={isLoading}
                        onStatusChange={handleStatusChange}
                        getStatusBadgeColor={getStatusBadgeColor}
                        formatDate={formatDate}
                      />
                    </TabsContent>
                  </Tabs>
                </TabsContent>
                
                <TabsContent value="demos">
                  <div className="mb-4 flex items-center gap-2">
                    <Search className="text-muted-foreground h-5 w-5" />
                    <Input
                      placeholder="Search by name, email, company..."
                      value={demoSearchQuery}
                      onChange={(e) => setDemoSearchQuery(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  
                  <Tabs value={demosTab} onValueChange={setDemosTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All Requests</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all">
                      <DemoRequestsTable 
                        demoRequests={filteredDemoRequests} 
                        isLoading={isLoading} 
                        onStatusChange={handleDemoStatusChange}
                        getStatusBadgeColor={getStatusBadgeColor}
                        formatDate={formatDate}
                      />
                    </TabsContent>
                    
                    <TabsContent value="pending">
                      <DemoRequestsTable 
                        demoRequests={filteredDemoRequests.filter(d => d.status === 'pending')} 
                        isLoading={isLoading} 
                        onStatusChange={handleDemoStatusChange}
                        getStatusBadgeColor={getStatusBadgeColor}
                        formatDate={formatDate}
                      />
                    </TabsContent>
                    
                    <TabsContent value="scheduled">
                      <DemoRequestsTable 
                        demoRequests={filteredDemoRequests.filter(d => d.status === 'scheduled')} 
                        isLoading={isLoading}
                        onStatusChange={handleDemoStatusChange}
                        getStatusBadgeColor={getStatusBadgeColor}
                        formatDate={formatDate}
                      />
                    </TabsContent>
                    
                    <TabsContent value="completed">
                      <DemoRequestsTable 
                        demoRequests={filteredDemoRequests.filter(d => d.status === 'completed')} 
                        isLoading={isLoading}
                        onStatusChange={handleDemoStatusChange}
                        getStatusBadgeColor={getStatusBadgeColor}
                        formatDate={formatDate}
                      />
                    </TabsContent>
                  </Tabs>
                </TabsContent>
                
                <TabsContent value="collaborations">
                  <div className="mb-4 flex items-center gap-2">
                    <Search className="text-muted-foreground h-5 w-5" />
                    <Input
                      placeholder="Search by business, destination, contact..."
                      value={collaborationSearchQuery}
                      onChange={(e) => setCollaborationSearchQuery(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  
                  <CollaborationsTable 
                    collaborations={filteredCollaborations} 
                    isLoading={isLoading} 
                    formatDate={formatDate}
                  />
                </TabsContent>
                
                <TabsContent value="support">
                  <div className="mb-4 flex items-center gap-2">
                    <Search className="text-muted-foreground h-5 w-5" />
                    <Input
                      placeholder="Search by subject, message, user ID, category..."
                      value={supportSearchQuery}
                      onChange={(e) => setSupportSearchQuery(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  
                  <Tabs value={supportTab} onValueChange={setSupportTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All Tickets</TabsTrigger>
                      <TabsTrigger value="open">Open</TabsTrigger>
                      <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                      <TabsTrigger value="resolved">Resolved</TabsTrigger>
                      <TabsTrigger value="closed">Closed</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all">
                      <SupportTicketsTable 
                        supportTickets={filteredSupportTickets} 
                        isLoading={isLoading} 
                        onStatusChange={handleSupportTicketStatusChange}
                        getStatusBadgeColor={getStatusBadgeColor}
                        formatDate={formatDate}
                        onOpenTicket={openTicketDetails}
                      />
                    </TabsContent>
                    
                    <TabsContent value="open">
                      <SupportTicketsTable 
                        supportTickets={filteredSupportTickets.filter(t => t.status === 'open')} 
                        isLoading={isLoading} 
                        onStatusChange={handleSupportTicketStatusChange}
                        getStatusBadgeColor={getStatusBadgeColor}
                        formatDate={formatDate}
                        onOpenTicket={openTicketDetails}
                      />
                    </TabsContent>
                    
                    <TabsContent value="in_progress">
                      <SupportTicketsTable 
                        supportTickets={filteredSupportTickets.filter(t => t.status === 'in_progress')} 
                        isLoading={isLoading}
                        onStatusChange={handleSupportTicketStatusChange}
                        getStatusBadgeColor={getStatusBadgeColor}
                        formatDate={formatDate}
                        onOpenTicket={openTicketDetails}
                      />
                    </TabsContent>
                    
                    <TabsContent value="resolved">
                      <SupportTicketsTable 
                        supportTickets={filteredSupportTickets.filter(t => t.status === 'resolved')} 
                        isLoading={isLoading}
                        onStatusChange={handleSupportTicketStatusChange}
                        getStatusBadgeColor={getStatusBadgeColor}
                        formatDate={formatDate}
                        onOpenTicket={openTicketDetails}
                      />
                    </TabsContent>
                    
                    <TabsContent value="closed">
                      <SupportTicketsTable 
                        supportTickets={filteredSupportTickets.filter(t => t.status === 'closed')} 
                        isLoading={isLoading}
                        onStatusChange={handleSupportTicketStatusChange}
                        getStatusBadgeColor={getStatusBadgeColor}
                        formatDate={formatDate}
                        onOpenTicket={openTicketDetails}
                      />
                    </TabsContent>
                  </Tabs>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTicket.subject}</DialogTitle>
                <DialogDescription className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadgeColor(selectedTicket.status)}>
                      {selectedTicket.status === 'in_progress' ? 'In Progress' : 
                        selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Priority: {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(selectedTicket.created_at)}
                  </span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Category</h4>
                  <p className="flex items-center gap-1.5 text-sm mt-1">
                    {selectedTicket.category === 'billing' && <FileText className="h-4 w-4" />}
                    {selectedTicket.category === 'shipping' && <BarChart className="h-4 w-4" />}
                    {selectedTicket.category === 'technical' && <HelpCircle className="h-4 w-4" />}
                    {selectedTicket.category === 'general' && <MessageCircle className="h-4 w-4" />}
                    {selectedTicket.category.charAt(0).toUpperCase() + selectedTicket.category.slice(1)}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">User ID</h4>
                  <p className="text-sm mt-1">{selectedTicket.user_id}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Original Message</h4>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                    <p className="whitespace-pre-wrap">{selectedTicket.message}</p>
                  </div>
                </div>
                
                {ticketMessages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium">Message History</h4>
                    <div className="space-y-3 mt-2 max-h-[200px] overflow-y-auto">
                      {ticketMessages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`p-3 rounded-md text-sm ${
                            msg.is_admin 
                              ? "bg-primary/10 ml-8" 
                              : "bg-muted mr-8"
                          }`}
                        >
                          <div className="flex justify-between mb-1">
                            <span className="font-semibold">
                              {msg.is_admin ? "Support Agent" : "Customer"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(msg.created_at)}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium">Reply</h4>
                  <div className="mt-1">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your response here..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        Update Status
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => handleSupportTicketStatusChange(selectedTicket.id, 'open')}>
                        Set as Open
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSupportTicketStatusChange(selectedTicket.id, 'in_progress')}>
                        Set as In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSupportTicketStatusChange(selectedTicket.id, 'resolved')}>
                        Set as Resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSupportTicketStatusChange(selectedTicket.id, 'closed')}>
                        Set as Closed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendingMessage}
                    >
                      {sendingMessage ? "Sending..." : "Send Reply"}
                      <Send className="h-4 w-4 ml-1" />
                    </Button>
                    <Button variant="outline" onClick={() => setTicketDialogOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ShipmentTable = ({ shipments, isLoading, onStatusChange, getStatusBadgeColor, formatDate }) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading shipments...</div>;
  }
  
  if (shipments.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No shipments found</div>;
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tracking Code</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.map((shipment) => (
            <TableRow key={shipment.id}>
              <TableCell className="font-medium">{shipment.tracking_code || 'N/A'}</TableCell>
              <TableCell>{shipment.user_id ? shipment.user_id.substring(0, 8) + '...' : 'N/A'}</TableCell>
              <TableCell>{shipment.pickup_address || 'N/A'}</TableCell>
              <TableCell>{shipment.delivery_address || 'N/A'}</TableCell>
              <TableCell>{formatDate(shipment.created_at)}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(shipment.status)}>
                  {shipment.status?.replace(/_/g, ' ') || 'Unknown'}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Update Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onStatusChange(shipment.id, shipment.user_id, 'pending')}>
                      Set as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(shipment.id, shipment.user_id, 'picked_up')}>
                      Set as Picked Up
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(shipment.id, shipment.user_id, 'in_transit')}>
                      Set as In Transit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(shipment.id, shipment.user_id, 'delivered')}>
                      Set as Delivered
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(shipment.id, shipment.user_id, 'exception')}>
                      Set as Exception
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const DemoRequestsTable = ({ demoRequests, isLoading, onStatusChange, getStatusBadgeColor, formatDate }) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading demo requests...</div>;
  }
  
  if (demoRequests.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No demo requests found</div>;
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Demo Type</TableHead>
            <TableHead>Preferred Date</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demoRequests.map((demo) => (
            <TableRow key={demo.id}>
              <TableCell className="font-medium">{demo.name || 'N/A'}</TableCell>
              <TableCell>{demo.email || 'N/A'}</TableCell>
              <TableCell>{demo.company || 'N/A'}</TableCell>
              <TableCell>{demo.demo_type || 'N/A'}</TableCell>
              <TableCell>{demo.preferred_date || 'N/A'}</TableCell>
              <TableCell>{formatDate(demo.created_at)}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(demo.status)}>
                  {demo.status || 'Unknown'}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Update Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onStatusChange(demo.id, 'pending')}>
                      Set as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(demo.id, 'scheduled')}>
                      Set as Scheduled
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(demo.id, 'completed')}>
                      Set as Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(demo.id, 'cancelled')}>
                      Set as Cancelled
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const CollaborationsTable = ({ collaborations, isLoading, formatDate }) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading collaborations...</div>;
  }
  
  if (collaborations.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No collaborations found</div>;
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Next Shipment</TableHead>
            <TableHead>Contact Email</TableHead>
            <TableHead>Contact Phone</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collaborations.map((collab) => (
            <TableRow key={collab.id}>
              <TableCell className="font-medium">{collab.business_name || 'N/A'}</TableCell>
              <TableCell>{collab.destination || 'N/A'}</TableCell>
              <TableCell>{collab.volume || 'N/A'}</TableCell>
              <TableCell>{collab.frequency || 'N/A'}</TableCell>
              <TableCell>{collab.next_shipment_date || 'N/A'}</TableCell>
              <TableCell>{collab.contact_email || 'N/A'}</TableCell>
              <TableCell>{collab.contact_phone || 'N/A'}</TableCell>
              <TableCell>{formatDate(collab.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const SupportTicketsTable = ({ supportTickets, isLoading, onStatusChange, getStatusBadgeColor, formatDate, onOpenTicket }) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading support tickets...</div>;
  }
  
  if (supportTickets.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No support tickets found</div>;
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supportTickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium max-w-xs truncate" title={ticket.subject}>
                {ticket.subject}
              </TableCell>
              <TableCell>{ticket.user_id ? ticket.user_id.substring(0, 8) + '...' : 'N/A'}</TableCell>
              <TableCell>
                {ticket.category === 'billing' && <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> Billing</span>}
                {ticket.category === 'shipping' && <span className="flex items-center gap-1.5"><BarChart className="h-4 w-4" /> Shipping</span>}
                {ticket.category === 'technical' && <span className="flex items-center gap-1.5"><HelpCircle className="h-4 w-4" /> Technical</span>}
                {ticket.category === 'general' && <span className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4" /> General</span>}
                {!['billing', 'shipping', 'technical', 'general'].includes(ticket.category) && ticket.category}
              </TableCell>
              <TableCell>
                <Badge className={
                  ticket.priority === 'urgent' ? "bg-red-100 text-red-800" :
                  ticket.priority === 'high' ? "bg-orange-100 text-orange-800" :
                  ticket.priority === 'medium' ? "bg-blue-100 text-blue-800" :
                  "bg-green-100 text-green-800"
                }>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(ticket.created_at)}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(ticket.status)}>
                  {ticket.status === 'in_progress' ? 'In Progress' : 
                    ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => onOpenTicket(ticket)}>
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Status
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onStatusChange(ticket.id, 'open')}>
                        Set as Open
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(ticket.id, 'in_progress')}>
                        Set as In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(ticket.id, 'resolved')}>
                        Set as Resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(ticket.id, 'closed')}>
                        Set as Closed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminDashboardPage;
