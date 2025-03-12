import { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/clerk-react";

import ShipmentTable from "@/components/admin/ShipmentTable";
import DemoRequestsTable from "@/components/admin/DemoRequestsTable";
import CollaborationsTable from "@/components/admin/CollaborationsTable";
import SupportTicketsTable from "@/components/admin/SupportTicketsTable";
import TicketDetailsDialog from "@/components/admin/TicketDetailsDialog";
import AdminStatsCards from "@/components/admin/AdminStatsCards";

import * as AdminDataService from "@/components/admin/AdminDataService";

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
    const success = await AdminDataService.handleShipmentStatusChange(shipmentId, userId, newStatus);
    if (success) {
      setShipments(shipments.map(s => 
        s.id === shipmentId ? { ...s, status: newStatus } : s
      ));
      loadShipments();
      loadStats();
    }
  };

  const handleDemoStatusChange = async (demoId, newStatus) => {
    const success = await AdminDataService.handleDemoStatusChange(demoId, newStatus);
    if (success) {
      loadDemoRequests();
    }
  };

  const handleSupportTicketStatusChange = async (ticketId, newStatus) => {
    const success = await AdminDataService.handleSupportTicketStatusChange(ticketId, newStatus);
    if (success) {
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({...selectedTicket, status: newStatus});
      }
      loadSupportTickets();
      loadStats();
    }
  };

  const handleRefreshData = () => {
    loadData();
    toast({
      title: "Data Refreshed",
      description: "The dashboard data has been updated.",
    });
  };

  const loadShipments = async () => {
    const data = await AdminDataService.loadShipments();
    setShipments(data);
    setFilteredShipments(data);
  };

  const loadDemoRequests = async () => {
    const data = await AdminDataService.loadDemoRequests();
    setDemoRequests(data);
    setFilteredDemoRequests(data);
  };

  const loadCollaborations = async () => {
    const data = await AdminDataService.loadCollaborations();
    setCollaborations(data);
    setFilteredCollaborations(data);
  };

  const loadSupportTickets = async () => {
    const data = await AdminDataService.loadSupportTickets();
    setSupportTickets(data);
    setFilteredSupportTickets(data);
  };

  const loadStats = async () => {
    const statsData = await AdminDataService.loadStats();
    setStats(statsData);
  };

  const loadTicketMessages = async (ticketId) => {
    const messages = await AdminDataService.loadTicketMessages(ticketId);
    setTicketMessages(messages);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket || !user) return;
    
    setSendingMessage(true);
    try {
      const success = await AdminDataService.handleSendMessage(
        selectedTicket.id, 
        user.id, 
        newMessage
      );
      
      if (success) {
        if (selectedTicket.status === 'open') {
          await handleSupportTicketStatusChange(selectedTicket.id, 'in_progress');
        }
        
        await loadTicketMessages(selectedTicket.id);
        setNewMessage('');
      }
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
          
          <AdminStatsCards stats={stats} />
          
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
                      <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                      
                    </TabsList>
                    
                    <TabsContent value="all">
                      <ShipmentTable 
                        shipments={filteredShipments} 
                        isLoading={isLoading} 
                        onStatusChange={handleStatusChange}
                        getStatusBadgeColor={AdminDataService.getStatusBadgeColor}
                        formatDate={AdminDataService.formatDate}
                      />
                    </TabsContent>
                    
                    <TabsContent value="pending">
                      <ShipmentTable 
                        shipments={filteredShipments.filter(s => s.status === 'pending')} 
                        isLoading={isLoading} 
                        onStatusChange={handleStatusChange}
                        getStatusBadgeColor={AdminDataService.getStatusBadgeColor}
                        formatDate={AdminDataService.formatDate}
                      />
                    </TabsContent>
                    
                    <TabsContent value="in_transit">
                      <ShipmentTable 
                        shipments={filteredShipments.filter(s => s.status === 'in_transit')} 
                        isLoading={isLoading}
                        onStatusChange={handleStatusChange}
                        getStatusBadgeColor={AdminDataService.getStatusBadgeColor}
                        formatDate={AdminDataService.formatDate}
                      />
                    </TabsContent>
                    
                    <TabsContent value="delivered">
                      <ShipmentTable 
                        shipments={filteredShipments.filter(s => s.status === 'delivered')} 
                        isLoading={isLoading}
                        onStatusChange={handleStatusChange}
                        getStatusBadgeColor={AdminDataService.getStatusBadgeColor}
                        formatDate={AdminDataService.formatDate}
                      />
                    </TabsContent>
                    
                    <TabsContent value="exception">
                      <ShipmentTable 
                        shipments={filteredShipments.filter(s => s.status === 'exception')} 
                        isLoading={isLoading}
                        onStatusChange={handleStatusChange}
                        getStatusBadgeColor={AdminDataService.getStatusBadgeColor}
                        formatDate={AdminDataService.formatDate}
                      />
                    </TabsContent>
                    
                    <TabsContent value="cancelled">
                      <ShipmentTable 
                        shipments={filteredShipments.filter(s => s.status === 'cancelled')} 
                        isLoading={isLoading}
                        onStatusChange={handleStatusChange}
                        getStatusBadgeColor={AdminDataService.getStatusBadgeColor}
                        formatDate={AdminDataService.formatDate}
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
                        getStatusBadgeColor={AdminDataService.getStatusBadgeColor}
                        formatDate={AdminDataService.formatDate}
                      />
                    </TabsContent>
                    
                    <TabsContent value="pending">
                      <DemoRequestsTable 
                        demoRequests={filteredDemoRequests.filter(d => d.status === 'pending')} 
                        isLoading={isLoading} 
                        onStatusChange={handleDemoStatusChange}
                        getStatusBadgeColor={AdminDataService.getStatusBadgeColor}
                        formatDate={AdminDataService.formatDate}
                      />
                    </TabsContent>
                    
                    <TabsContent value="scheduled">
                      <DemoRequestsTable 
                        demoRequests={filteredDemoRequests.filter(d => d.status === 'scheduled')} 
                        isLoading={isLoading}
                        onStatusChange={handleDemoStatusChange}
                        getStatusBadgeColor={AdminDataService.getStatusBadgeColor}
                        formatDate={AdminDataService.formatDate}
                      />
                    </TabsContent>
                    
                    <TabsContent value="completed">
                      <DemoRequestsTable 
                        demoRequests={filteredDemoRequests.filter(d => d.status === 'completed')} 
                        isLoading={isLoading}
                        onStatusChange={handleDemoStatusChange}
                        getStatusBadgeColor={AdminDataService.getStatusBadgeColor}
                        formatDate={AdminDataService.formatDate}
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
                    formatDate={AdminDataService.formatDate}
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
                        getStatusBadgeColor={AdminDataService.getStatusBadgeColor}
                        formatDate={AdminDataService.formatDate}
                        onOpenTicket={openTicketDetails}
                      />
                    </TabsContent>
                    
                    <TabsContent value="open">
                      <SupportTicketsTable 
                        supportTickets={filteredSupportTickets.filter(t => t.status === 'open')} 
                        isLoading={isLoading} 
                        onStatusChange={handleSupportTicketStatusChange}
                        getStatusBadgeColor={AdminDataService.getStatusBadgeColor}
                        formatDate={AdminDataService.formatDate}
                        onOpenTicket={openTicketDetails}
                      />
                    </TabsContent>
                    
                    <TabsContent value="in_progress">
                      <SupportTicketsTable 
                        supportTickets={filteredSupportTickets.filter(t => t.status === 'in_progress')} 
                        isLoading={isLoading}
                        onStatusChange={handleSupportTicketStatusChange}
                        getStatusBadgeColor={AdminDataService.getStatusBadgeColor}
                        formatDate={AdminDataService.formatDate}
                        onOpenTicket={openTicketDetails}
                      />
                    </TabsContent>
                    
                    <TabsContent value="resolved">
                      <SupportTicketsTable 
                        supportTickets={filteredSupportTickets.filter(t => t.status === 'resolved')} 
                        isLoading={isLoading}
                        onStatusChange={handleSupportTicketStatusChange}
                        getStatusBadgeColor={AdminDataService.getStatusBadgeColor}
                        formatDate={AdminDataService.formatDate}
                        onOpenTicket={openTicketDetails}
                      />
                    </TabsContent>
                    
                    <TabsContent value="closed">
                      <SupportTicketsTable 
                        supportTickets={filteredSupportTickets.filter(t => t.status === 'closed')} 
                        isLoading={isLoading}
                        onStatusChange={handleSupportTicketStatusChange}
                        getStatusBadgeColor={AdminDataService.getStatusBadgeColor}
                        formatDate={AdminDataService.formatDate}
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

      <TicketDetailsDialog 
        open={ticketDialogOpen}
        onOpenChange={setTicketDialogOpen}
        selectedTicket={selectedTicket}
        ticketMessages={ticketMessages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendingMessage={sendingMessage}
        handleSendMessage={handleSendMessage}
        handleSupportTicketStatusChange={handleSupportTicketStatusChange}
        getStatusBadgeColor={AdminDataService.getStatusBadgeColor}
        formatDate={AdminDataService.formatDate}
      />
    </div>
  );
};

export default AdminDashboardPage;
