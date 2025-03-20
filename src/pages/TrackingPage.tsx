
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import NavBar from "@/components/layout/NavBar";
import { useTranslation } from "react-i18next";
import { trackShipment, Shipment } from "@/services/shipmentService";
import { toast } from "@/components/ui/use-toast";

const TrackingPage = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const { t } = useTranslation();
  
  const handleTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      toast({
        title: "Tracking Error",
        description: "Please enter a valid tracking number",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setIsTracking(true);
    
    try {
      const result = await trackShipment(trackingNumber);
      
      if (result) {
        setShipment(result);
      } else {
        toast({
          title: "Tracking Not Found",
          description: "No shipment found with this tracking number. Please check and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error tracking shipment:", error);
      toast({
        title: "Tracking Error",
        description: "An error occurred while trying to track your shipment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>{t('tracking.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTracking} className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder={t('tracking.placeholder')}
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : t('tracking.track')}
                </Button>
              </div>
            </form>
            
            {isTracking && shipment && (
              <div className="mt-8 space-y-6 animate-fade-in">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('tracking.trackingNumber')}</p>
                      <p className="font-bold">{shipment.trackingCode}</p>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {shipment.status === 'pending' && 'Pending'}
                      {shipment.status === 'picked_up' && 'Picked Up'}
                      {shipment.status === 'in_transit' && 'In Transit'}
                      {shipment.status === 'delivered' && 'Delivered'}
                      {shipment.status === 'exception' && 'Exception'}
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('tracking.from')}</p>
                    <p>{shipment.pickup}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('tracking.to')}</p>
                    <p>{shipment.delivery}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('tracking.carrier')}</p>
                    <p>{shipment.carrier.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('tracking.estimatedDelivery')}</p>
                    <p>{shipment.estimatedDelivery || 'Not available'}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-4">{t('tracking.trackingHistory')}</h3>
                  <div className="relative pl-6 space-y-6">
                    <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-muted"></div>
                    
                    {shipment.events.map((event, index) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-6 mt-1.5 w-4 h-4 rounded-full bg-primary"></div>
                        <div>
                          <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleString()}</p>
                          <p className="font-medium">{event.status}</p>
                          <p className="text-sm">{event.location}</p>
                          {event.description && <p className="text-xs text-muted-foreground mt-1">{event.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">{t('tracking.needHelp')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('tracking.helpText')}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {isTracking && !shipment && !isLoading && (
              <div className="mt-8 p-4 bg-muted rounded-lg">
                <p className="text-center">No shipment found with tracking number: {trackingNumber}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackingPage;
