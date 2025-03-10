
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shipment } from "@/services/shipmentService";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Package, RefreshCw, ArrowRight } from "lucide-react";
import { fetchBookingsFromSupabase } from "@/services/bookingDb";

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
      
      // Use the fetchBookingsFromSupabase function with the optional limit
      const bookings = await fetchBookingsFromSupabase(user.id, limit);
      console.log("Loaded bookings:", bookings);
      
      if (bookings && bookings.length > 0) {
        // Map Supabase bookings to the Shipment format
        const mappedShipments = bookings.map(booking => ({
          id: booking.id.toString(),
          userId: booking.user_id,
          trackingCode: booking.tracking_code || '',
          carrier: {
            name: booking.carrier_name || 'E-Parsel Nordic',
            price: Number(booking.carrier_price) || 10
          },
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
        // If no Supabase bookings, fall back to mock data
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

  // Function to get shipments from localStorage (as a fallback)
  const getLocalShipments = async (userId: string, limit?: number) => {
    try {
      const data = await import('@/services/shipmentService').then(m => m.getShipments(userId));
      // Apply limit if provided
      return limit ? data.slice(0, limit) : data;
    } catch (error) {
      console.error("Error fetching local shipments:", error);
      return [];
    }
  };

  const handleRefresh = () => {
    loadShipments();
  };
  
  // Function to get status badge color
  const getStatusColor = (status: Shipment["status"]) => {
    switch (status) {
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'picked_up':
        return "bg-blue-100 text-blue-800";
      case 'in_transit':
        return "bg-indigo-100 text-indigo-800";
      case 'delivered':
        return "bg-green-100 text-green-800";
      case 'exception':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium text-lg mb-2">No shipments yet</h3>
            <p className="text-muted-foreground mb-4">Book your first shipment to get started</p>
            <Button asChild>
              <Link to="/shipment">Book a Shipment</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">
                        {shipment.pickup} → {shipment.delivery}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(shipment.status)}`}>
                        {shipment.status === 'pending' && 'Pending'}
                        {shipment.status === 'picked_up' && 'Picked Up'}
                        {shipment.status === 'in_transit' && 'In Transit'} 
                        {shipment.status === 'delivered' && 'Delivered'}
                        {shipment.status === 'exception' && 'Exception'}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>Tracking: {shipment.trackingCode}</span>
                      <span className="mx-2">•</span>
                      <span>Created: {new Date(shipment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={shipment.labelUrl} target="_blank" rel="noopener noreferrer">
                        Label
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/tracking?code=${shipment.trackingCode}`}>
                        Track
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {showViewAll && shipments.length > 0 && (
              <div className="pt-4">
                <Button variant="link" className="p-0 h-auto text-primary" asChild>
                  <Link to="/tracking" className="flex items-center">
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
