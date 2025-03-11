
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
import { BarChart, CheckCircle, FileText, Search, Users } from "lucide-react";
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
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalShipments: 0,
    pendingShipments: 0,
    completedShipments: 0,
    totalUsers: 0,
    activeUsers: 0
  });

  useEffect(() => {
    if (user) {
      loadShipments();
      loadStats();
    }
  }, [user]);

  useEffect(() => {
    if (shipments.length > 0) {
      filterShipments();
    }
  }, [searchQuery, shipments]);

  const loadShipments = async () => {
    setIsLoading(true);
    try {
      // Get all shipments from Supabase (for admin view)
      const { data, error } = await supabase
        .from('booking')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error loading shipments:", error);
        toast({
          title: "Error Loading Shipments",
          description: "There was a problem retrieving the shipment data.",
          variant: "destructive",
        });
        return;
      }
      
      setShipments(data || []);
      setFilteredShipments(data || []);
    } catch (error) {
      console.error("Error in loadShipments:", error);
      toast({
        title: "Failed to Load Data",
        description: "An unexpected error occurred while loading shipments.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Get total shipments
      const { count: totalCount, error: totalError } = await supabase
        .from('booking')
        .select('*', { count: 'exact', head: true });
      
      // Get pending shipments
      const { count: pendingCount, error: pendingError } = await supabase
        .from('booking')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'picked_up', 'in_transit']);
      
      // Get completed shipments
      const { count: completedCount, error: completedError } = await supabase
        .from('booking')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'delivered');
      
      // Get unique user counts
      const { data: userData, error: userError } = await supabase
        .from('booking')
        .select('user_id')
        .limit(1000);
      
      if (!totalError && !pendingError && !completedError && !userError) {
        // Calculate unique users
        const uniqueUsers = new Set(userData?.map(booking => booking.user_id) || []);
        
        setStats({
          totalShipments: totalCount || 0,
          pendingShipments: pendingCount || 0,
          completedShipments: completedCount || 0,
          totalUsers: uniqueUsers.size,
          activeUsers: uniqueUsers.size // For simplicity, using same value. In reality, would need active user metric
        });
      } else {
        console.error("Error fetching stats:", { totalError, pendingError, completedError, userError });
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const filterShipments = () => {
    if (!searchQuery.trim()) {
      setFilteredShipments(shipments);
      return;
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = shipments.filter(shipment => 
      shipment.tracking_code?.toLowerCase().includes(lowerCaseQuery) ||
      shipment.user_id?.toLowerCase().includes(lowerCaseQuery) ||
      shipment.pickup?.toLowerCase().includes(lowerCaseQuery) ||
      shipment.delivery?.toLowerCase().includes(lowerCaseQuery) ||
      shipment.status?.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredShipments(filtered);
  };

  const handleStatusChange = async (shipmentId, userId, newStatus) => {
    try {
      // Update status in Supabase
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
      
      // Also update in local storage service as backup
      const event = {
        date: new Date().toISOString(),
        location: "Admin Dashboard",
        status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1).replace(/_/g, ' '),
        description: `Status updated by admin`
      };
      
      await updateShipmentStatus(shipmentId, userId, newStatus, event);
      
      // Update the UI
      setShipments(shipments.map(s => 
        s.id === shipmentId ? { ...s, status: newStatus } : s
      ));
      
      toast({
        title: "Status Updated",
        description: `Shipment status changed to ${newStatus.replace(/_/g, ' ')}.`,
      });
      
      // Refresh data
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

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'delivered': return "bg-green-100 text-green-800";
      case 'in_transit': return "bg-blue-100 text-blue-800";
      case 'pending': return "bg-yellow-100 text-yellow-800";
      case 'picked_up': return "bg-purple-100 text-purple-800";
      case 'exception': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
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
                Manage all shipments and bookings
              </p>
            </div>
            <Button onClick={() => {
              loadShipments();
              loadStats();
              toast({
                title: "Data Refreshed",
                description: "The dashboard data has been updated.",
              });
            }}>
              Refresh Data
            </Button>
          </div>
          
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Shipment Management */}
          <Card>
            <CardHeader>
              <CardTitle>Shipment Management</CardTitle>
              <CardDescription>View and manage all shipments across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <Search className="text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search by tracking code, user, address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Shipments</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="in_transit">In Transit</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                  <TabsTrigger value="exception">Exceptions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <ShipmentTable 
                    shipments={filteredShipments} 
                    isLoading={isLoading} 
                    onStatusChange={handleStatusChange}
                    getStatusBadgeColor={getStatusBadgeColor}
                    formatDate={formatDate}
                  />
                </TabsContent>
                
                <TabsContent value="pending" className="mt-0">
                  <ShipmentTable 
                    shipments={filteredShipments.filter(s => s.status === 'pending')} 
                    isLoading={isLoading} 
                    onStatusChange={handleStatusChange}
                    getStatusBadgeColor={getStatusBadgeColor}
                    formatDate={formatDate}
                  />
                </TabsContent>
                
                <TabsContent value="in_transit" className="mt-0">
                  <ShipmentTable 
                    shipments={filteredShipments.filter(s => s.status === 'in_transit')} 
                    isLoading={isLoading}
                    onStatusChange={handleStatusChange}
                    getStatusBadgeColor={getStatusBadgeColor}
                    formatDate={formatDate}
                  />
                </TabsContent>
                
                <TabsContent value="delivered" className="mt-0">
                  <ShipmentTable 
                    shipments={filteredShipments.filter(s => s.status === 'delivered')} 
                    isLoading={isLoading}
                    onStatusChange={handleStatusChange}
                    getStatusBadgeColor={getStatusBadgeColor}
                    formatDate={formatDate}
                  />
                </TabsContent>
                
                <TabsContent value="exception" className="mt-0">
                  <ShipmentTable 
                    shipments={filteredShipments.filter(s => s.status === 'exception')} 
                    isLoading={isLoading}
                    onStatusChange={handleStatusChange}
                    getStatusBadgeColor={getStatusBadgeColor}
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

// Shipment Table Component
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
              <TableCell>{shipment.pickup || 'N/A'}</TableCell>
              <TableCell>{shipment.delivery || 'N/A'}</TableCell>
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

export default AdminDashboardPage;
