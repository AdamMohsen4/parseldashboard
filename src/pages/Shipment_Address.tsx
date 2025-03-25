// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Separator } from "@/components/ui/separator";
// import { toast } from "@/components/ui/use-toast";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import NavBar from "@/components/layout/NavBar";
// import { useUser } from "@clerk/clerk-react";
// import { bookShipment, cancelBooking } from "@/services/bookingService";
// import GooglePlacesAutocomplete from "@/components/inputs/GooglePlacesAutocomplete";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Briefcase, Download, Package, ShoppingCart, Truck, User } from "lucide-react";
// import { getBookingByTrackingCode } from "@/services/bookingDb";
// import LabelLanguageSelector from "@/components/labels/LabelLanguageSelector";
// import { generateLabel } from "@/services/labelService";
// import { getCountryFlag, getCountryName } from "@/lib/utils";
// import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

// type CustomerType = "business" | "private" | "ecommerce" | null;

// interface ShipmentBookingPageProps {
//   customerType?: CustomerType;
// }

// const ShipmentBookingPage = ({ customerType }: ShipmentBookingPageProps) => {
//   const { isSignedIn, user } = useUser();
//   const navigate = useNavigate();
//   const email = user?.emailAddresses[0].emailAddress;
//   const phone = user?.phoneNumbers;
//   const location = useLocation();
//   const [booking, setBooking] = useState<any>(null);
// }

// <div className="flex flex-col h-screen">
//     <NavBar />
    
// </div>

// export default ShipmentBookingPage;

