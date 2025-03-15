import { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import { useUser } from "@clerk/clerk-react";
import { Shipment } from "@/services/shipmentService";
import { fetchBookingsFromSupabase } from "@/services/bookingDb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader2, RefreshCw, Package, ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { generateLabel } from "@/services/labelService";

const ShipmentsPage = () => {
  const { user, isSignedIn } = useUser();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isGeneratingLabel, setIsGeneratingLabel] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn && user) {
      loadShipments();
    }
  }, [isSignedIn, user]);

  const loadShipments = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const bookings = await fetchBookingsFromSupabase(user.id);
      
      if (bookings && bookings.length > 0) {
        const mappedShipments = bookings.map(booking => ({
          id: booking.id.toString(),
          userId: booking.user_id,
          trackingCode: booking.tracking_code || '',
          carrier: {
            name: booking.carrier_name || 'E-Parcel Nordic',
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
        const mockData = await getLocalShipments(user.id);
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

  const getLocalShipments = async (userId: string) => {
    try {
      const data = await import('@/services/shipmentService').then(m => m.getShipments(userId));
      return data;
    } catch (error) {
      console.error("Error fetching local shipments:", error);
      return [];
    }
  };

  const handleRefresh = () => {
    loadShipments();
  };

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
      case 'cancelled':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFilteredShipments = () => {
    if (activeTab === "all") return shipments;
    
    return shipments.filter(shipment => {
      switch (activeTab) {
        case "active":
          return ['pending', 'picked_up', 'in_transit'].includes(shipment.status);
        case "delivered":
          return shipment.status === 'delivered';
        case "exception":
          return shipment.status === 'exception';
        case "cancelled":
          return shipment.status === 'cancelled';
        default:
          return true;
      }
    });
  };

  const handleGenerateLabel = async (shipment: Shipment) => {
    const trackingCode = shipment.trackingCode;
    const shipmentId = shipment.id;
    
    if (!trackingCode) {
      toast({
        title: "Error",
        description: "Unable to generate label: missing tracking code",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingLabel(shipment.id);
    
    try {
      const dimensions = `${shipment.dimensions.length}x${shipment.dimensions.width}x${shipment.dimensions.height} cm`;
      const result = await generateLabel({
        shipmentId,
        carrierName: shipment.carrier.name,
        trackingCode,
        senderAddress: shipment.pickup,
        recipientAddress: shipment.delivery,
        packageDetails: {
          weight: shipment.weight,
          dimensions: dimensions
        },
        language: 'en'
      });
      
      if (result.success && result.pdfBlob) {
        const downloadLink = document.createElement('a');
        downloadLink.href = result.labelUrl;
        downloadLink.download = `label-${trackingCode}.pdf`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        setTimeout(() => URL.revokeObjectURL(result.labelUrl), 100);
        
        toast({
          title: "Label Downloaded",
          description: "Your shipping label has been downloaded successfully",
        });
      } else {
        toast({
          title: "Label Generation Failed",
          description: result.message || "Unable to generate shipping label",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating label:", error);
      toast({
        title: "Label Generation Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingLabel(null);
    }
  };

  const filteredShipments = getFilteredShipments();

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="flex items-center gap-1 -ml-2"
                >
                  <Link to="/dashboard">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                  </Link>
                </Button>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">My Shipments</h1>
              <p className="text-muted-foreground">
                Track and manage all your shipments
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
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
              <Button asChild>
                <Link to="/shipment">New Shipment</Link>
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Shipment List</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue="all" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Shipments</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                  <TabsTrigger value="exception">Exceptions</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-0">
                  {isLoading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredShipments.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="font-medium text-lg mb-2">
                        {activeTab === "all" 
                          ? "No shipments found" 
                          : `No ${activeTab} shipments found`}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {activeTab === "all" 
                          ? "Book your first shipment to get started" 
                          : "Try selecting a different filter or book a new shipment"}
                      </p>
                      <Button asChild>
                        <Link to="/shipment">Book a Shipment</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium">Tracking</th>
                            <th className="text-left py-3 px-4 font-medium">Route</th>
                            <th className="text-left py-3 px-4 font-medium">Status</th>
                            <th className="text-left py-3 px-4 font-medium">Created</th>
                            <th className="text-left py-3 px-4 font-medium">Delivery</th>
                            <th className="text-left py-3 px-4 font-medium">Price</th>
                            <th className="text-left py-3 px-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {filteredShipments.map((shipment) => (
                            <tr key={shipment.id} className="hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="font-medium">{shipment.trackingCode}</div>
                                <div className="text-xs text-muted-foreground">
                                  {shipment.carrier.name}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex flex-col">
                                  <span className="truncate max-w-[150px]" title={shipment.pickup}>
                                    {shipment.pickup}
                                  </span>
                                  <span className="text-xs">↓</span>
                                  <span className="truncate max-w-[150px]" title={shipment.delivery}>
                                    {shipment.delivery}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(shipment.status)}`}>
                                  {shipment.status === 'pending' && 'Pending'}
                                  {shipment.status === 'picked_up' && 'Picked Up'}
                                  {shipment.status === 'in_transit' && 'In Transit'} 
                                  {shipment.status === 'delivered' && 'Delivered'}
                                  {shipment.status === 'exception' && 'Exception'}
                                  {shipment.status === 'cancelled' && 'Cancelled'}
                                </span>
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                {new Date(shipment.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                {shipment.estimatedDelivery ? 
                                  new Date(shipment.estimatedDelivery).toLocaleDateString() : 
                                  'N/A'}
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                €{shipment.totalPrice.toFixed(2)}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    asChild
                                  >
                                    <Link to={`/tracking?code=${shipment.trackingCode}`}>
                                      Track
                                    </Link>
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleGenerateLabel(shipment)}
                                    disabled={isGeneratingLabel === shipment.id}
                                  >
                                    {isGeneratingLabel === shipment.id ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <Download className="h-3 w-3 mr-1" />
                                    )}
                                    Label
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="bg-muted/50 rounded-lg p-4 mt-4">
            <h3 className="font-medium mb-2">About Shipment Statuses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">Pending</span>
                </div>
                <p className="text-muted-foreground">Shipment has been booked but not yet picked up.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">Picked Up</span>
                </div>
                <p className="text-muted-foreground">Carrier has collected the package.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs">In Transit</span>
                </div>
                <p className="text-muted-foreground">Package is on its way to the destination.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">Delivered</span>
                </div>
                <p className="text-muted-foreground">Package has been delivered successfully.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">Cancelled</span>
                </div>
                <p className="text-muted-foreground">Shipment has been cancelled.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentsPage;
