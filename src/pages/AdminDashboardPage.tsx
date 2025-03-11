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
import { BarChart, CheckCircle, FileText, Search, Users, Calendar, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
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

const AdminDashboardPage = () => {
  const { user } = useUser();
  const [mainTab, setMainTab] = useState("shipments");
  const [shipmentsTab, setShipmentsTab] = useState("all");
  const [demosTab, setDemosTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalShipments: 0,
    pendingShipments: 0,
    completedShipments: 0,
    totalDemoRequests: 0,
    totalCollaborations: 0
  });

  // Shipments state
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [shipmentSearchQuery, setShipmentSearchQuery] = useState("");

  // Demo requests state
  const [demoRequests, setDemoRequests] = useState([]);
  const [filteredDemoRequests, setFilteredDemoRequests] = useState([]);
  const [demoSearchQuery, setDemoSearchQuery] = useState("");

  // Collaborations state
  const [collaborations, setCollaborations] = useState([]);
  const [filteredCollaborations, setFilteredCollaborations] = useState([]);
  const [collaborationSearchQuery, setCollaborationSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // Filter effects
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

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadShipments(),
        loadDemoRequests(),
        loadCollaborations(),
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

  const loadStats = async () => {
    try {
      // Get shipment counts
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
        
      // Get demo requests count
      const { count: demoCount, error: demoError } = await supabase
        .from('demo_requests')
        .select('*', { count: 'exact', head: true });
        
      // Get collaborations count
      const { count: collabCount, error: collabError } = await supabase
        .from('collaborations')
        .select('*', { count: 'exact', head: true });
      
      if (!totalError && !pendingError && !completedError && !demoError && !collabError) {
        setStats({
          totalShipments: totalCount || 0,
          pendingShipments: pendingCount || 0,
          completedShipments: completedCount || 0,
          totalDemoRequests: demoCount || 0,
          totalCollaborations: collabCount || 0
        });
      } else {
        console.error("Error fetching stats:", { 
          totalError, pendingError, completedError, demoError, collabError 
        });
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
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
                Manage shipments, demo requests, and collaborations
              </p>
            </div>
            <Button onClick={handleRefreshData}>
              Refresh Data
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Shipments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalShipments}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Shipments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingShipments}</div>
              </CardContent>
            </Card>
            
            <Card>
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
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Demo Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDemoRequests}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Collaborations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCollaborations}</div>
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
                </TabsList>
                
                <CardTitle>
                  {mainTab === "shipments" && "Shipment Management"}
                  {mainTab === "demos" && "Demo Requests Management"}
                  {mainTab === "collaborations" && "Collaborations Management"}
                </CardTitle>
                
                <CardDescription>
                  {mainTab === "shipments" && "View and manage all shipments across the platform"}
                  {mainTab === "demos" && "Review and respond to demo requests from potential customers"}
                  {mainTab === "collaborations" && "Manage business collaboration proposals"}
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
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
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

export default AdminDashboardPage;

