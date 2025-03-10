import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const BookingPage = () => {
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [deliverySpeed, setDeliverySpeed] = useState("standard");
  const [compliance, setCompliance] = useState(false);
  
  const carrierOptions = [
    { id: 1, name: "PostNord", price: 10, eta: "2 days", icon: "📦" },
    { id: 2, name: "DHL", price: 12, eta: "1 day", icon: "🚚" },
    { id: 3, name: "Bring", price: 11, eta: "3 days", icon: "📬" },
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Booking Submitted",
      description: "Your shipment has been booked successfully!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">ParcelNordic</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/5">
            <Card>
              <CardHeader>
                <CardTitle>Book a Shipment</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Package Details</h3>
                    
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input 
                        id="weight" 
                        type="number" 
                        placeholder="Enter weight" 
                        min="0.1" 
                        max="50"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="length">Length (cm)</Label>
                        <Input 
                          id="length" 
                          type="number" 
                          placeholder="L" 
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="width">Width (cm)</Label>
                        <Input 
                          id="width" 
                          type="number" 
                          placeholder="W" 
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input 
                          id="height" 
                          type="number" 
                          placeholder="H" 
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Locations</h3>
                    
                    <div>
                      <Label htmlFor="pickup">Pickup Address</Label>
                      <Input 
                        id="pickup" 
                        placeholder="e.g. Malmö, SE" 
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="delivery">Delivery Address</Label>
                      <Input 
                        id="delivery" 
                        placeholder="e.g. Helsinki, FI" 
                        value={delivery}
                        onChange={(e) => setDelivery(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Delivery Options</h3>
                    
                    <RadioGroup 
                      value={deliverySpeed} 
                      onValueChange={setDeliverySpeed}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express">Express (1 day)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard">Standard (3 days)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="economy" id="economy" />
                        <Label htmlFor="economy">Economy (5 days)</Label>
                      </div>
                    </RadioGroup>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <input 
                        type="checkbox" 
                        id="compliance" 
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={compliance}
                        onChange={(e) => setCompliance(e.target.checked)}
                      />
                      <Label htmlFor="compliance">
                        Add Compliance Package (+€2)
                        <Link to="/compliance" className="ml-1 text-primary text-sm underline">
                          Learn more
                        </Link>
                      </Label>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">Calculate Rates</Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-3/5">
            <Card>
              <CardHeader>
                <CardTitle>Available Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {carrierOptions.map((carrier) => (
                    <div 
                      key={carrier.id} 
                      className="border border-border rounded-lg p-4 flex justify-between items-center hover:border-primary cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{carrier.icon}</div>
                        <div>
                          <h4 className="font-medium">{carrier.name}</h4>
                          <p className="text-sm text-muted-foreground">Estimated delivery: {carrier.eta}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">€{carrier.price}</p>
                        <Button size="sm">Book Now</Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">About our rates</h4>
                  <p className="text-sm text-muted-foreground">
                    All shipments include tracking and insurance up to €500. Additional insurance 
                    can be purchased during checkout. Rates shown include all taxes and fees.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
