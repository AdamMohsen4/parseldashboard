import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { bookShipment, BookingRequest } from "@/services/bookingService";
import { getPickupSlots, PickupSlot } from "@/services/pickupService";
import NavBar from "@/components/layout/NavBar";

const formSchema = z.object({
  weight: z.string().min(1, {
    message: "Weight is required.",
  }),
  length: z.string().min(1, {
    message: "Length is required.",
  }),
  width: z.string().min(1, {
    message: "Width is required.",
  }),
  height: z.string().min(1, {
    message: "Height is required.",
  }),
  pickupAddress: z.string().min(10, {
    message: "Pickup address is required and must be at least 10 characters.",
  }),
  deliveryAddress: z.string().min(10, {
    message: "Delivery address is required and must be at least 10 characters.",
  }),
  deliverySpeed: z.enum(["standard", "express"], {
    required_error: "Please select a delivery speed.",
  }),
  includeCompliance: z.boolean().default(false),
});

const BookingPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carriers, setCarriers] = useState([
    { name: "DHL", price: 25 },
    { name: "UPS", price: 30 },
    { name: "FedEx", price: 28 },
  ]);
  const [selectedCarrier, setSelectedCarrier] = useState(carriers[0]);
  const [pickupSlots, setPickupSlots] = useState<PickupSlot[]>([]);
  const [selectedPickupSlot, setSelectedPickupSlot] = useState<PickupSlot | null>(null);

  useEffect(() => {
    const fetchPickupSlots = async () => {
      const slots = await getPickupSlots();
      setPickupSlots(slots);
    };

    fetchPickupSlots();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: "",
      length: "",
      width: "",
      height: "",
      pickupAddress: "",
      deliveryAddress: "",
      deliverySpeed: "standard",
      includeCompliance: false,
    },
  });

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      const response = await bookShipment({
        weight: formData.weight,
        dimensions: {
          length: formData.length,
          width: formData.width,
          height: formData.height
        },
        pickup: formData.pickupAddress,
        delivery: formData.deliveryAddress,
        carrier: selectedCarrier,
        deliverySpeed: formData.deliverySpeed,
        includeCompliance: formData.includeCompliance,
        pickupSlotId: selectedPickupSlot?.id
      });
      
      if (response.success) {
        toast({
          title: "Booking Successful",
          description: `Your shipment has been booked with tracking code ${response.trackingCode}`,
        });
        
        // Navigate to the label page with the booking data
        navigate("/label", { 
          state: { 
            bookingData: {
              labelUrl: response.labelUrl,
              trackingCode: response.trackingCode,
              shipmentId: response.shipmentId,
              pickupTime: response.pickupTime,
              totalPrice: response.totalPrice
            }
          }
        });
      } else {
        toast({
          title: "Booking Failed",
          description: response.message || "There was an error with your booking",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error booking shipment:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Book a Shipment</h1>
          <p className="text-muted-foreground">Fill in the details below to book your shipment.</p>
        </div>

        <Card className="w-full lg:w-2/3 mx-auto">
          <CardHeader>
            <CardTitle>Shipment Details</CardTitle>
            <CardDescription>Enter the details of your shipment.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter weight in kg" {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length (cm)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter length in cm" {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width (cm)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter width in cm" {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter height in cm" {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="pickupAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter pickup address"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter delivery address"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mb-4">
                  <FormLabel className="text-base">Carrier</FormLabel>
                  <div className="flex gap-4 mt-2">
                    {carriers.map((carrier) => (
                      <Button
                        key={carrier.name}
                        variant={selectedCarrier === carrier ? "default" : "outline"}
                        onClick={() => setSelectedCarrier(carrier)}
                      >
                        {carrier.name} (€{carrier.price})
                      </Button>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="deliverySpeed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Speed</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="standard" />
                            </FormControl>
                            <FormLabel>Standard</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="express" />
                            </FormControl>
                            <FormLabel>Express</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeCompliance"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Include Compliance Service</FormLabel>
                        <FormDescription>
                          Add compliance service for customs and regulatory requirements.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="mb-4">
                  <FormLabel className="text-base">Pickup Slot</FormLabel>
                  {pickupSlots.length > 0 ? (
                    <Select onValueChange={(value) => {
                      const slot = pickupSlots.find(slot => slot.id === value);
                      setSelectedPickupSlot(slot || null);
                    }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a pickup slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {pickupSlots.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id}>{slot.date} - {slot.timeWindow}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-muted-foreground">Loading pickup slots...</p>
                  )}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Submitting..." : "Book Shipment"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingPage;
