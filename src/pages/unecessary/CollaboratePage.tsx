
// import { useState, useEffect } from "react";
// import { useUser } from "@clerk/clerk-react";
// import NavBar from "@/components/layout/NavBar";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Users, MapPin, Package, Mail, MessageSquare } from "lucide-react";
// import { useTranslation } from "react-i18next";
// import CollaborationList from "@/components/collaboration/CollaborationList";
// import { fetchCollaborations, createCollaboration } from "@/services/collaborationService";
// import { Collaboration } from "@/components/collaboration/types";
// import { toast } from "@/components/ui/use-toast";
// import { useQueryClient, useQuery } from "@tanstack/react-query";

// const CollaboratePage = () => {
//   const { t } = useTranslation();
//   const { user } = useUser();
//   const queryClient = useQueryClient();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredCollaborations, setFilteredCollaborations] = useState<Collaboration[]>([]);
  
//   // Form state
//   const [formData, setFormData] = useState({
//     destination: "",
//     volume: "",
//     frequency: "",
//     nextShipmentDate: "",
//     notes: "",
//     contactEmail: user?.primaryEmailAddress?.emailAddress || "",
//     contactPhone: ""
//   });

//   // Fetch collaborations using React Query
//   const { data: collaborations = [], isLoading } = useQuery({
//     queryKey: ['collaborations'],
//     queryFn: fetchCollaborations
//   });

//   // Update filtered collaborations when data changes
//   useEffect(() => {
//     setFilteredCollaborations(collaborations);
//   }, [collaborations]);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     const filtered = collaborations.filter(
//       (collab) =>
//         collab.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         collab.destination.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredCollaborations(filtered);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({ ...prev, [id]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!user) {
//       toast({
//         title: "Authentication Required",
//         description: "You must be logged in to create a collaboration listing.",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Validate form
//     const requiredFields = ['destination', 'volume', 'frequency', 'nextShipmentDate', 'contactEmail', 'contactPhone'];
//     const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
//     if (missingFields.length > 0) {
//       toast({
//         title: "Missing Information",
//         description: `Please fill in all required fields: ${missingFields.join(', ')}`,
//         variant: "destructive",
//       });
//       return;
//     }

//     const success = await createCollaboration(user.id, {
//       businessName: user.organizationMemberships?.[0]?.organization.name || user.fullName || 'Anonymous Business',
//       ...formData
//     });

//     if (success) {
//       // Reset form
//       setFormData({
//         destination: "",
//         volume: "",
//         frequency: "",
//         nextShipmentDate: "",
//         notes: "",
//         contactEmail: user.primaryEmailAddress?.emailAddress || "",
//         contactPhone: ""
//       });
      
//       // Refresh data
//       queryClient.invalidateQueries({ queryKey: ['collaborations'] });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <NavBar />

//       <div className="container mx-auto px-4 py-12">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-4xl font-bold text-foreground flex items-center gap-2">
//               <Users className="h-8 w-8 text-primary" /> {t('collaborate.title', 'Collaborate on Shipping')}
//             </h1>
//             <p className="text-muted-foreground mt-2 text-lg">
//               {t('collaborate.description', 'Find other businesses shipping to the same destination to share costs')}
//             </p>
//           </div>

//           <Card className="w-full md:w-auto p-2">
//             <CardContent className="p-2">
//               <form onSubmit={handleSearch} className="flex gap-2">
//                 <Input
//                   placeholder={t('collaborate.searchPlaceholder', 'Search by business or destination')}
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="min-w-[200px]"
//                 />
//                 <Button type="submit" variant="secondary">
//                   {t('common.search', 'Search')}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//           <Card className="border-t-4 border-primary">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Users className="h-5 w-5 text-primary" />
//                 {t('collaborate.benefits.community.title', 'Community Shipping')}
//               </CardTitle>
//               <CardDescription>
//                 {t('collaborate.benefits.community.description', 'Connect with other SMEs for shared shipping')}
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <p>{t('collaborate.benefits.community.text', 'Reduce your shipping costs by collaborating with other businesses sending to the same destination.')}</p>
//             </CardContent>
//           </Card>

//           <Card className="border-t-4 border-primary">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Package className="h-5 w-5 text-primary" />
//                 {t('collaborate.benefits.combine.title', 'Combine Volumes')}
//               </CardTitle>
//               <CardDescription>
//                 {t('collaborate.benefits.combine.description', 'Reach volume discount thresholds together')}
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <p>{t('collaborate.benefits.combine.text', 'Pool your shipments to qualify for better rates and services only available to larger volume shippers.')}</p>
//             </CardContent>
//           </Card>

//           <Card className="border-t-4 border-primary">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <MapPin className="h-5 w-5 text-primary" />
//                 {t('collaborate.benefits.sustainable.title', 'More Sustainable')}
//               </CardTitle>
//               <CardDescription>
//                 {t('collaborate.benefits.sustainable.description', 'Reduce carbon footprint through consolidation')}
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <p>{t('collaborate.benefits.sustainable.text', 'Help the environment by optimizing delivery routes and reducing the number of vehicles needed.')}</p>
//             </CardContent>
//           </Card>
//         </div>

//         <Card className="mb-8">
//           <CardHeader className="bg-muted/50">
//             <CardTitle>{t('collaborate.createListing.title', 'Create Your Collaboration Listing')}</CardTitle>
//             <CardDescription>
//               {t('collaborate.createListing.description', 'Share your shipping needs and find partners')}
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="pt-6">
//             <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="destination">{t('collaborate.form.destination', 'Destination')}</Label>
//                 <Input 
//                   id="destination" 
//                   placeholder="City, Country" 
//                   value={formData.destination}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="volume">{t('collaborate.form.volume', 'Approximate Volume')}</Label>
//                 <Input 
//                   id="volume" 
//                   placeholder="e.g., 5 kg or 0.5 cubic meters" 
//                   value={formData.volume}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="frequency">{t('collaborate.form.frequency', 'Shipping Frequency')}</Label>
//                 <Input 
//                   id="frequency" 
//                   placeholder="e.g., Weekly, Monthly" 
//                   value={formData.frequency}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="nextShipmentDate">{t('collaborate.form.date', 'Next Shipping Date')}</Label>
//                 <Input 
//                   id="nextShipmentDate" 
//                   type="date" 
//                   value={formData.nextShipmentDate}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="contactEmail">{t('collaborate.form.email', 'Contact Email')}</Label>
//                 <Input 
//                   id="contactEmail" 
//                   type="email" 
//                   placeholder="your@email.com" 
//                   value={formData.contactEmail}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="contactPhone">{t('collaborate.form.phone', 'Contact Phone')}</Label>
//                 <Input 
//                   id="contactPhone" 
//                   placeholder="+1 (123) 456-7890" 
//                   value={formData.contactPhone}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="space-y-2 md:col-span-2">
//                 <Label htmlFor="notes">{t('collaborate.form.notes', 'Additional Notes')}</Label>
//                 <Input 
//                   id="notes" 
//                   placeholder="Any specific requirements or information" 
//                   value={formData.notes}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <Button type="submit" className="w-full">
//                   {t('collaborate.form.submit', 'Create Collaboration Listing')}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>

//         <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
//           <MapPin className="h-6 w-6 text-primary" />
//           {t('collaborate.availableCollaborations', 'Available Collaboration Opportunities')}
//         </h2>
        
//         {isLoading ? (
//           <div className="text-center py-12">
//             <p className="text-muted-foreground text-lg">Loading collaborations...</p>
//           </div>
//         ) : (
//           <CollaborationList collaborations={filteredCollaborations} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default CollaboratePage;
