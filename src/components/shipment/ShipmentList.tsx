
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shipment } from "@/services/shipmentService";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Loader2, RefreshCw, ArrowRight } from "lucide-react";
import { fetchBookingsFromSupabase } from "@/services/bookingDb";
import ShipmentItem from "./ShipmentItem";
import ShipmentEmptyState from "./ShipmentEmptyState";

interface ShipmentListProps {
  limit?: number;
  showViewAll?: boolean;
}

const ShipmentList = ({ limit, showViewAll = false }: ShipmentListProps) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      loadShipments();
    }
  }, [isSignedIn, user, limit]);

  const loadShipments = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log("Loading shipments for user:", user.id, "with limit:", limit);
      
      const bookings = await fetchBookingsFromSupabase(user.id, limit);
      console.log("Loaded bookings:", bookings);
      
      if (bookings && bookings.length > 0) {
        const mappedShipments = bookings.map(booking => ({
          id: booking.id.toString(),
          userId: booking.user_id,
          trackingCode: booking.tracking_code || '',
        
          weight: booking.weight || '',
          dimensions: {
            length: booking.dimension_length || '',
            width: booking.dimension_width || '',
            height: booking.dimension_height || ''
          },
          pickup: booking.pickup_address || '',
          delivery: booking.delivery_address || '',
          deliverySpeed: booking.delivery_speed || 'standard',
          includeCompliance: booking.include_compliance || false,
          status: booking.status as any || 'pending',
          createdAt: booking.created_at,
          labelUrl: booking.label_url,
          pickupTime: booking.pickup_time,
          totalPrice: Number(booking.total_price) || 10,
          estimatedDelivery: booking.estimated_delivery ? new Date(booking.estimated_delivery).toISOString().split('T')[0] : undefined,
          events: []
        }));
        setShipments(mappedShipments);
      } else {
        console.log("No bookings found, falling back to mock data");
        const mockData = await getLocalShipments(user.id, limit);
        setShipments(mockData);
      }
    } catch (error) {
      console.error("Error loading shipments:", error);
      toast({
        title: "Loading Error",
        description: "Could not load your shipments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalShipments = async (userId: string, limit?: number) => {
    try {
      const data = await import('@/services/shipmentService').then(m => m.getShipments(userId));
      return limit ? data.slice(0, limit) : data;
    } catch (error) {
      console.error("Error fetching local shipments:", error);
      return [];
    }
  };

  const handleRefresh = () => {
    loadShipments();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">My Shipments</CardTitle>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh</span>
        </Button>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : shipments.length === 0 ? (
          <ShipmentEmptyState />
        ) : (
          <div className="divide-y">
            {shipments.map((shipment) => (
              <ShipmentItem key={shipment.id} shipment={shipment} />
            ))}
            
            {showViewAll && shipments.length > 0 && (
              <div className="pt-4">
                <Button variant="link" className="p-0 h-auto text-primary" asChild>
                  <Link to="/shipments" className="flex items-center">
                    View all shipments <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShipmentList;
