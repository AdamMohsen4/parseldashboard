import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavBar from "@/components/layout/NavBar";
import { useUser } from "@clerk/clerk-react";
import { bookShipment, cancelBooking } from "@/services/bookingService";
import GooglePlacesAutocomplete from "@/components/inputs/GooglePlacesAutocomplete";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase, ShoppingCart, User } from "lucide-react";

type CustomerType = "business" | "private" | "ecommerce" | null;

interface ShipmentBookingPageProps {
  customerType?: CustomerType;
}

const ShipmentBookingPage = ({ customerType }: ShipmentBookingPageProps) => {
  const { isSignedIn, user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [weight, setWeight] = useState("5");
  const [length, setLength] = useState("20");
  const [width, setWidth] = useState("15");
  const [height, setHeight] = useState("10");
  const [pickup, setPickup] = useState("Stockholm, SE");
  const [delivery, setDelivery] = useState("Helsinki, FI");
  const [deliverySpeed, setDeliverySpeed] = useState("standard");
  const [compliance, setCompliance] = useState(false);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [selectedCustomerType, setSelectedCustomerType] = useState<CustomerType>(customerType || null);
  const [businessName, setBusinessName] = useState("");
  const [vatNumber, setVatNumber] = useState("");

  // If no customer type is selected and we're on the base route, show the selection screen
  const showCustomerTypeSelection = !selectedCustomerType && location.pathname === "/shipment";

  // Update selected customer type when the prop changes
  useEffect(() => {
    if (customerType) {
      setSelectedCustomerType(customerType);
    }
  }, [customerType]);

  // Fixed price carrier - price differs by customer type
  const getCarrierPrice = () => {
    switch (selectedCustomerType) {
      case "business": return 9; // Business discount
      case "ecommerce": return 8; // E-commerce special rate
      default: return 10; // Standard rate for private customers
    }
  };

  const carrier = {
    id: 1,
    name: "E-Parsel Nordic",
    price: getCarrierPrice(),
    eta: "3 days",
    icon: "📦"
  };

  const handleCustomerTypeSelect = (type: CustomerType) => {
    if (type) {
      navigate(`/shipment/${type}`);
    }
  };

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  
  const handleBookNow = async () => {
    if (!isSignedIn || !user) {
      document.querySelector<HTMLButtonElement>("button.cl-userButtonTrigger")?.click();
      return;
    }

    setIsBooking(true);
    
    try {
      const result = await bookShipment({
        weight,
        dimensions: { length, width, height },
        pickup,
        delivery,
        carrier: { name: carrier.name, price: carrier.price },
        deliverySpeed,
        includeCompliance: compliance,
        userId: user.id,
        customerType: selectedCustomerType || "private",
        businessName: selectedCustomerType === "business" || selectedCustomerType === "ecommerce" ? businessName : undefined,
        vatNumber: selectedCustomerType === "business" ? vatNumber : undefined
      });
      
      if (result.success) {
        setBookingResult(result);
        setBookingConfirmed(true);
        toast({
          title: "Shipment Booked",
          description: `Your shipment has been booked with tracking code: ${result.trackingCode}`,
        });
      } else {
        toast({
          title: "Booking Failed",
          description: result.message || "There was a problem with your booking.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in booking flow:", error);
      toast({
        title: "Booking Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingResult?.trackingCode || !user?.id) return;
    
    const cancelled = await cancelBooking(bookingResult.trackingCode, user.id);
    if (cancelled) {
      setBookingConfirmed(false);
      setBookingResult(null);
    }
  };

  // Remove the calculate rate button and simplify the form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleBookNow();
  };

  const createTestBooking = () => {
    if (!isSignedIn || !user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to create a test booking.",
        variant: "destructive",
      });
      return;
    }

    setWeight("5");
    setLength("20");
    setWidth("15");
    setHeight("10");
    setPickup("Stockholm, SE");
    setDelivery("Helsinki, FI");
    setShowBookingConfirmation(true);
    handleBookNow();
  };

  // Customer type selection screen
  if (showCustomerTypeSelection) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />

        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center mb-8">Select Customer Type</h1>
          
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleCustomerTypeSelect("business")}
            >
              <CardHeader className="flex flex-col items-center">
                <Briefcase className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Business</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  For registered businesses shipping commercial goods
                </p>
                <p className="text-sm font-medium text-primary">€9 base rate</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleCustomerTypeSelect("private")}
            >
              <CardHeader className="flex flex-col items-center">
                <User className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Private Customer</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  For individuals shipping personal items
                </p>
                <p className="text-sm font-medium text-primary">€10 base rate</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleCustomerTypeSelect("ecommerce")}
            >
              <CardHeader className="flex flex-col items-center">
                <ShoppingCart className="h-12 w-12 text-primary mb-2" />
                <CardTitle>E-commerce Business</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  For online retailers with regular shipments
                </p>
                <p className="text-sm font-medium text-primary">€8 base rate</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Main booking form after customer type is selected
  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Book a Shipment</CardTitle>
                {selectedCustomerType && (
                  <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {selectedCustomerType === "business" && <Briefcase className="h-4 w-4" />}
                    {selectedCustomerType === "private" && <User className="h-4 w-4" />}
                    {selectedCustomerType === "ecommerce" && <ShoppingCart className="h-4 w-4" />}
                    <span className="text-sm capitalize">{selectedCustomerType}</span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Business-specific fields */}
                  {(selectedCustomerType === "business" || selectedCustomerType === "ecommerce") && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Business Details</h3>
                      
                      <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input 
                          id="businessName" 
                          type="text" 
                          placeholder="Enter business name" 
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          required
                        />
                      </div>
                      
                      {selectedCustomerType === "business" && (
                        <div>
                          <Label htmlFor="vatNumber">VAT Number</Label>
                          <Input 
                            id="vatNumber" 
                            type="text" 
                            placeholder="Enter VAT number" 
                            value={vatNumber}
                            onChange={(e) => setVatNumber(e.target.value)}
                            required
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
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
                      <GooglePlacesAutocomplete
                        id="pickup"
                        placeholder="Enter pickup address"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        onPlaceSelect={(address) => setPickup(address)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="delivery">Delivery Address</Label>
                      <GooglePlacesAutocomplete
                        id="delivery"
                        placeholder="Enter delivery address"
                        value={delivery}
                        onChange={(e) => setDelivery(e.target.value)}
                        onPlaceSelect={(address) => setDelivery(address)}
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
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard">Standard (3 days)</Label>
                      </div>
                    </RadioGroup>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox 
                        id="compliance" 
                        checked={compliance}
                        onCheckedChange={(checked) => setCompliance(checked === true)}
                      />
                      <Label htmlFor="compliance" className="text-sm">
                        Add Compliance Package (+€2)
                        <Link to="/compliance" className="ml-1 text-primary text-sm underline">
                          Learn more
                        </Link>
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isBooking || bookingConfirmed}
                    >
                      {isBooking ? "Processing..." : bookingConfirmed ? "Booked" : "Book Shipment"}
                    </Button>
                    {process.env.NODE_ENV === 'development' && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full" 
                        onClick={createTestBooking}
                      >
                        Create Test Booking
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-3/5">
            <Card>
              <CardHeader>
                <CardTitle>Fixed Rate Shipping</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div 
                    className="border border-primary rounded-lg p-4 flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{carrier.icon}</div>
                      <div>
                        <h4 className="font-medium">{carrier.name}</h4>
                        <p className="text-sm text-muted-foreground">Estimated delivery: {carrier.eta}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">€{carrier.price}{compliance ? " + €2" : ""}</p>
                      <Button size="sm" onClick={handleBookNow} disabled={isBooking}>
                        {isBooking ? "Processing..." : "Book Now"}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">About our rates</h4>
                    <p className="text-sm text-muted-foreground">
                      All shipments include tracking and insurance up to €500. Additional insurance 
                      can be purchased during checkout. Rates shown include all taxes and fees.
                    </p>
                    {selectedCustomerType && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <h5 className="font-medium text-sm mb-1">
                          {selectedCustomerType === "business" && "Business Rate"}
                          {selectedCustomerType === "private" && "Private Customer Rate"}
                          {selectedCustomerType === "ecommerce" && "E-commerce Business Rate"}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {selectedCustomerType === "business" && "Our business rate includes commercial insurance and priority handling."}
                          {selectedCustomerType === "private" && "Our standard rate for private customers includes all basic services."}
                          {selectedCustomerType === "ecommerce" && "Our special e-commerce rate includes volume discounts and integration capabilities."}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Booking confirmation */}
                  {showBookingConfirmation && (
                    <div className="mt-8 bg-primary/10 p-4 rounded-lg border border-primary">
                      <h4 className="font-medium mb-2 text-primary">Shipment Ready to Book</h4>
                      <p className="text-sm mb-4">
                        Your shipment from {pickup} to {delivery} is ready to be booked with E-Parsel Nordic.
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">Total: €{carrier.price + (compliance ? 2 : 0)}</p>
                        <Button onClick={handleBookNow} disabled={isBooking}>
                          {isBooking ? "Processing..." : isSignedIn ? "Confirm Booking" : "Sign In to Book"}
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Booking result with cancellation */}
                  {bookingResult && (
                    <div className="mt-8 bg-green-50 p-4 rounded-lg border border-green-500">
                      <h4 className="font-medium mb-2 text-green-700">Booking Confirmed!</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Tracking Code:</strong> {bookingResult.trackingCode}</p>
                        <p><strong>Pickup Time:</strong> {bookingResult.pickupTime}</p>
                        <p><strong>Total Price:</strong> €{bookingResult.totalPrice}</p>
                        {bookingResult.cancellationDeadline && (
                          <p className="text-gray-600">
                            Cancellation available until: {new Date(bookingResult.cancellationDeadline).toLocaleString()}
                          </p>
                        )}
                        <div className="pt-3 flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <a href={bookingResult.labelUrl} target="_blank" rel="noopener noreferrer">
                              Download Label
                            </a>
                          </Button>
                          {bookingResult.cancellationDeadline && (
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={handleCancelBooking}
                            >
                              Cancel Booking
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentBookingPage;
