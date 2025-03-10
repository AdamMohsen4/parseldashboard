
import { useEffect, useState } from "react";
import NavBar from "@/components/layout/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ShipmentList from "@/components/shipment/ShipmentList";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";

const DashboardPage = () => {
  const { user } = useUser();
  const [stats, setStats] = useState({
    activeShipments: 0,
    completedShipments: 0,
    totalSpent: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);
  
  const loadStats = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get active shipments (pending, picked_up, in_transit)
      const { data: activeData, error: activeError } = await supabase
        .from('Booking')
        .select('id')
        .eq('user_id', user.id)
        .in('status', ['pending', 'picked_up', 'in_transit']);
      
      // Get completed shipments
      const { data: completedData, error: completedError } = await supabase
        .from('Booking')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'delivered');
      
      // Get sum of total spent
      const { data: spentData, error: spentError } = await supabase
        .from('Booking')
        .select('total_price')
        .eq('user_id', user.id);
      
      if (!activeError && !completedError && !spentError) {
        // Calculate total spent
        const totalSpent = spentData?.reduce((sum, booking) => 
          sum + (Number(booking.total_price) || 0), 0) || 0;
        
        setStats({
          activeShipments: activeData?.length || 0,
          completedShipments: completedData?.length || 0,
          totalSpent
        });
      } else {
        console.error("Error fetching stats:", { activeError, completedError, spentError });
      }
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName || 'User'}
            </p>
          </div>
          
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
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  €{isLoading ? "..." : stats.totalSpent.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <ShipmentList />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
