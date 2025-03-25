
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "@/components/layout/NavBar";
import { useUser } from "@clerk/clerk-react";
import GooglePlacesAutocomplete from "@/components/inputs/GooglePlacesAutocomplete";
import { Briefcase, Package, User } from "lucide-react";

type CustomerType = "business" | "private" | "ecommerce" | null;

interface ShipmentAddressPageProps {
  customerType?: CustomerType;
}

const ShipmentAddressPage = ({ customerType }: ShipmentAddressPageProps) => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [selectedCustomerType, setSelectedCustomerType] = useState<CustomerType>(customerType || "private");
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [vatNumber, setVatNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pickup || !delivery) {
      toast.error("Please fill in both pickup and delivery addresses");
      return;
    }
    
    // Navigate to the main shipment page with the address data
    navigate("/shipment", { 
      state: { 
        pickup, 
        delivery,
        customerType: selectedCustomerType,
        businessName: selectedCustomerType === "business" ? businessName : undefined,
        vatNumber: selectedCustomerType === "business" ? vatNumber : undefined
      } 
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Shipment Details</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Type Selection */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">I am sending as:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className={`
                      border rounded-lg p-4 cursor-pointer flex flex-col items-center text-center
                      ${selectedCustomerType === "private" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}
                    `}
                    onClick={() => setSelectedCustomerType("private")}
                  >
                    <User className="h-8 w-8 mb-2" />
                    <span className="font-medium">Private</span>
                    <span className="text-sm text-muted-foreground">Individual sending</span>
                  </div>
                  
                  <div 
                    className={`
                      border rounded-lg p-4 cursor-pointer flex flex-col items-center text-center
                      ${selectedCustomerType === "business" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}
                    `}
                    onClick={() => setSelectedCustomerType("business")}
                  >
                    <Briefcase className="h-8 w-8 mb-2" />
                    <span className="font-medium">Business</span>
                    <span className="text-sm text-muted-foreground">Company shipping</span>
                  </div>
                  
                  <div 
                    className={`
                      border rounded-lg p-4 cursor-pointer flex flex-col items-center text-center
                      ${selectedCustomerType === "ecommerce" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}
                    `}
                    onClick={() => setSelectedCustomerType("ecommerce")}
                  >
                    <Package className="h-8 w-8 mb-2" />
                    <span className="font-medium">E-commerce</span>
                    <span className="text-sm text-muted-foreground">Online store</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Business Information (conditionally shown) */}
              {selectedCustomerType === "business" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Business Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input 
                        id="businessName" 
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Enter company name"
                        required={selectedCustomerType === "business"}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="vatNumber">VAT Number</Label>
                      <Input 
                        id="vatNumber" 
                        value={vatNumber}
                        onChange={(e) => setVatNumber(e.target.value)}
                        placeholder="Enter VAT number"
                        required={selectedCustomerType === "business"}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Pickup and Delivery Addresses */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Addresses</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="pickup">Pickup Address</Label>
                  <GooglePlacesAutocomplete
                    id="pickup"
                    value={pickup}
                    onPlaceSelect={setPickup}
                    placeholder="Enter pickup address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delivery">Delivery Address</Label>
                  <GooglePlacesAutocomplete
                    id="delivery"
                    value={delivery}
                    onPlaceSelect={setDelivery}
                    placeholder="Enter delivery address"
                    required
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button type="submit" className="bg-primary">
                  Continue to Shipping Options
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShipmentAddressPage;
