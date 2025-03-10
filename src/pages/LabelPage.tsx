
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import LabelPreview from "@/components/labels/LabelPreview";
import { toast } from "@/components/ui/use-toast";

const LabelPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<{
    labelUrl?: string;
    trackingCode?: string;
    shipmentId?: string;
  } | null>(null);
  
  useEffect(() => {
    // Get booking data from location state
    if (location.state?.bookingData) {
      setBookingData(location.state.bookingData);
    } else {
      toast({
        title: "No shipment data",
        description: "Unable to display the shipping label. Please book a shipment first.",
        variant: "destructive",
      });
      navigate("/book");
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          className="mb-6" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Your Shipping Label</h1>
        
        {bookingData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Shipment Details</h2>
                <div className="bg-muted/10 p-4 rounded-md border">
                  <p className="mb-2"><span className="font-medium">Shipment ID:</span> {bookingData.shipmentId}</p>
                  <p><span className="font-medium">Tracking Code:</span> {bookingData.trackingCode}</p>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Download and print your shipping label</li>
                  <li>Securely attach the label to your package</li>
                  <li>Have your package ready for the scheduled pickup</li>
                  <li>Track your shipment using the tracking code</li>
                </ol>
              </div>
            </div>
            
            <div className="md:col-span-1">
              {bookingData.labelUrl && (
                <LabelPreview 
                  labelUrl={bookingData.labelUrl} 
                  trackingCode={bookingData.trackingCode || ""} 
                  shipmentId={bookingData.shipmentId || ""}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>Loading shipment data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabelPage;
