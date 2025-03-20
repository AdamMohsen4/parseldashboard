import { useEffect, useState } from "react";
import NavBar from "@/components/layout/NavBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ShipmentList from "@/components/shipment/ShipmentList";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, AlertCircle, TrendingUp, Package, CalendarCheck, Truck, BarChart, Bookmark, PiggyBank } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
const DashboardPage = () => {
  const {
    user
  } = useUser();
  const [stats, setStats] = useState({
    activeShipments: 0,
    completedShipments: 0,
    totalSpent: 0,
    totalSaved: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (user) {
      loadStats();
      loadRecentActivities();
    }
  }, [user]);
  const loadStats = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const {
        data: activeData,
        error: activeError
      } = await supabase.from('booking').select('id').eq('user_id', user.id).in('status', ['pending', 'picked_up', 'in_transit']);
      const {
        data: completedData,
        error: completedError
      } = await supabase.from('booking').select('id').eq('user_id', user.id).eq('status', 'delivered');
      const {
        data: bookingData,
        error: bookingError
      } = await supabase.from('booking').select('total_price, carrier_price').eq('user_id', user.id);
      if (!activeError && !completedError && !bookingError) {
        // Calculate total spent
        const totalSpent = bookingData?.reduce((sum, booking) => sum + (Number(booking.total_price) || 0), 0) || 0;

        // Calculate total saved compared to direct carrier prices
        // Adding €1.50 to each carrier price to reflect the standard markup
        const totalSaved = bookingData?.reduce((sum, booking) => {
          const totalPrice = Number(booking.total_price) || 0;
          // Add €1.50 to carrier price
          const carrierPrice = (Number(booking.carrier_price) || 0) + 1.50;
          return sum + Math.max(0, carrierPrice - totalPrice);
        }, 0) || 0;
        setStats({
          activeShipments: activeData?.length || 0,
          completedShipments: completedData?.length || 0,
          totalSpent,
          totalSaved
        });
      } else {
        console.error("Error fetching stats:", {
          activeError,
          completedError,
          bookingError
        });
      }
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const loadRecentActivities = async () => {
    if (!user) return;
    try {
      const {
        data,
        error
      } = await supabase.from('booking').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      }).limit(5);
      if (error) {
        console.error("Error loading recent activities:", error);
        return;
      }
      setRecentActivities(data || []);
    } catch (error) {
      console.error("Error loading recent activities:", error);
    }
  };
  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([loadStats(), loadRecentActivities()]);
      toast({
        title: "Dashboard Refreshed",
        description: "Your dashboard data has been updated."
      });
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'picked_up':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };
  return <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.firstName || 'User'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleRefreshData} disabled={isLoading}>
                Refresh Data
              </Button>
              <Button asChild>
                <Link to="/shipment">
                  <Package className="mr-2 h-4 w-4" />
                  New Shipment
                </Link>
              </Button>
            </div>
          </div>
          
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle>Shipping Summary</CardTitle>
              <CardDescription>Overview of your shipping activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Shipments</p>
                    <p className="text-xl font-semibold">
                      {isLoading ? "..." : stats.activeShipments + stats.completedShipments}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-xl font-semibold">
                      {isLoading ? "..." : stats.activeShipments + stats.completedShipments > 0 ? `${Math.round(stats.completedShipments / (stats.activeShipments + stats.completedShipments) * 100)}%` : "0%"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BarChart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Cost Per Shipment</p>
                    <p className="text-xl font-semibold">
                      {isLoading ? "..." : stats.activeShipments + stats.completedShipments > 0 ? `€${(stats.totalSpent / (stats.activeShipments + stats.completedShipments)).toFixed(2)}` : "€0.00"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Add Total Savings Display */}
              {stats.totalSaved > 0}
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Shipments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : stats.activeShipments}
                </div>
                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                  <Truck className="mr-1 h-4 w-4 text-primary" />
                  <span>Shipments in progress</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Shipments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : stats.completedShipments}
                </div>
                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                  <CalendarCheck className="mr-1 h-4 w-4 text-primary" />
                  <span>Successfully delivered</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">
                    €{isLoading ? "..." : stats.totalSpent.toFixed(2)}
                  </div>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                          <AlertCircle className="h-4 w-4 text-primary" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[200px]">
                        <p>You've saved €{stats.totalSaved.toFixed(2)} compared to booking directly with carriers.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                  <AlertCircle className="mr-1 h-4 w-4 text-primary" />
                  <span>Across all shipments</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? <div className="text-center py-6">Loading...</div> : recentActivities.length > 0 ? <div className="space-y-4">
                    {recentActivities.map(activity => <div key={activity.id} className="flex items-start gap-2 pb-4 border-b border-border last:border-0 last:pb-0">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Activity className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <p className="font-medium text-sm truncate">
                              {activity.carrier_name || 'Unknown carrier'}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(activity.status)}`}>
                              {activity.status || 'Unknown'}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            ID: {activity.tracking_code || 'No tracking code'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(activity.created_at)}
                          </p>
                        </div>
                      </div>)}
                    <div className="pt-2">
                      <Button variant="link" className="p-0 h-auto text-primary" asChild>
                        <Link to="/shipments" className="flex items-center">
                          View all shipments <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div> : <div className="text-center py-6 text-muted-foreground">
                    <p>No recent activities found</p>
                    <Button variant="link" className="mt-2" asChild>
                      <Link to="/shipment">Create your first shipment</Link>
                    </Button>
                  </div>}
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Shipment List</CardTitle>
              </CardHeader>
              <CardContent>
                <ShipmentList limit={5} showViewAll={true} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};
export default DashboardPage;