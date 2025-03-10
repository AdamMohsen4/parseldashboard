
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const TrackingPage = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  
  // Mock tracking data
  const trackingData = {
    id: "PN12345678",
    status: "In Transit",
    from: "Malmö, Sweden",
    to: "Helsinki, Finland",
    carrier: "PostNord",
    estimatedDelivery: "March 18, 2023",
    events: [
      { date: "March 15, 2023 11:30", location: "Malmö", status: "Picked up from sender" },
      { date: "March 15, 2023 18:45", location: "Malmö", status: "Departed facility" },
      { date: "March 16, 2023 09:15", location: "Stockholm", status: "Arrived at sorting center" },
      { date: "March 16, 2023 14:30", location: "Stockholm", status: "Departed facility" },
      { date: "March 17, 2023 07:45", location: "Helsinki", status: "Arrived at destination facility" },
    ]
  };
  
  const handleTracking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">ParcelNordic</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Track Your Shipment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTracking} className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter tracking number (e.g., PN12345678)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">Track</Button>
              </div>
            </form>
            
            {isTracking && (
              <div className="mt-8 space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking Number</p>
                      <p className="font-bold">{trackingData.id}</p>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {trackingData.status}
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p>{trackingData.from}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">To</p>
                    <p>{trackingData.to}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Carrier</p>
                    <p>{trackingData.carrier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p>{trackingData.estimatedDelivery}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-4">Tracking History</h3>
                  <div className="relative pl-6 space-y-6">
                    <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-muted"></div>
                    
                    {trackingData.events.map((event, index) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-6 mt-1.5 w-4 h-4 rounded-full bg-primary"></div>
                        <div>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                          <p className="font-medium">{event.status}</p>
                          <p className="text-sm">{event.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Need Help?</h4>
                    <p className="text-sm text-muted-foreground">
                      If you have any questions about your shipment, please contact our customer service 
                      at support@parcelnordic.com or call +46 123 456 789.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackingPage;
