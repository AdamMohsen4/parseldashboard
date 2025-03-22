// import { useState } from "react";
// import { useUser } from "@clerk/clerk-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { toast } from "@/components/ui/use-toast";
// import NavBar from "@/components/layout/NavBar";
// import { submitThreePLRequest } from "@/services/threePLService";
// import { ThreePLResponse } from "@/types/threePL";
// import SimpleRequestForm from "@/components/three-pl/SimpleRequestForm";
// import DocumentUpload from "@/components/three-pl/DocumentUpload";
// import EcommerceIntegration from "@/components/three-pl/EcommerceIntegration";

// const productCategories = [
//   "Electronics",
//   "Clothing & Apparel",
//   "Food & Beverage",
//   "Health & Beauty",
//   "Home & Garden",
//   "Toys & Games",
//   "Books & Media",
//   "Industrial & Scientific",
//   "Automotive",
//   "Other"
// ];

// const months = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December"
// ];

// const integrationSystems = [
//   "Shopify",
//   "WooCommerce",
//   "Magento",
//   "BigCommerce",
//   "Amazon",
//   "eBay",
//   "Etsy",
//   "Custom ERP",
//   "Other"
// ];

// const ThreePLServicePage = () => {
//   const { isSignedIn, user } = useUser();
//   const [activeTab, setActiveTab] = useState("detailed");
  
//   const [companyName, setCompanyName] = useState("");
//   const [contactName, setContactName] = useState("");
//   const [contactEmail, setContactEmail] = useState("");
//   const [contactPhone, setContactPhone] = useState("");
  
//   const [productType, setProductType] = useState("");
//   const [productCategory, setProductCategory] = useState("");
//   const [hazardousMaterials, setHazardousMaterials] = useState(false);
//   const [specialHandling, setSpecialHandling] = useState(false);
//   const [specialHandlingNotes, setSpecialHandlingNotes] = useState("");
  
//   const [estimatedVolume, setEstimatedVolume] = useState("");
//   const [temperatureControlled, setTemperatureControlled] = useState(false);
//   const [securityRequirements, setSecurityRequirements] = useState("Standard");
  
//   const [averageOrders, setAverageOrders] = useState("");
//   const [selectedPeakMonths, setSelectedPeakMonths] = useState<string[]>([]);
//   const [internationalShipping, setInternationalShipping] = useState(false);
  
//   const [integrationNeeded, setIntegrationNeeded] = useState(false);
//   const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
//   const [customRequirements, setCustomRequirements] = useState("");
  
//   const [documentUrl, setDocumentUrl] = useState("");
  
//   const [ecommercePlatform, setEcommercePlatform] = useState("");
//   const [ecommerceStoreUrl, setEcommerceStoreUrl] = useState("");
//   const [ecommerceSkuCount, setEcommerceSkuCount] = useState("");
//   const [ecommerceOrderVolume, setEcommerceOrderVolume] = useState("");
  
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [submissionResult, setSubmissionResult] = useState<ThreePLResponse | null>(null);
  
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setShowConfirmation(true);
//   };

//   const handlePeakMonthToggle = (month: string) => {
//     setSelectedPeakMonths(prev =>
//       prev.includes(month)
//         ? prev.filter(m => m !== month)
//         : [...prev, month]
//     );
//   };

//   const handleIntegrationToggle = (system: string) => {
//     setSelectedIntegrations(prev =>
//       prev.includes(system)
//         ? prev.filter(s => s !== system)
//         : [...prev, system]
//     );
//   };

//   const handleDocumentUploaded = (url: string) => {
//     setDocumentUrl(url);
//   };

//   const handleSimpleFormSubmit = async (formData: {
//     companyName: string;
//     contactName: string;
//     contactEmail: string;
//     contactPhone: string;
//     requirements: string;
//     documentUrl: string;
//     ecommercePlatform?: string;
//     ecommerceStoreUrl?: string;
//     ecommerceSkuCount?: string;
//     ecommerceOrderVolume?: string;
//   }) => {
//     if (!isSignedIn || !user) {
//       document.querySelector<HTMLButtonElement>("button.cl-userButtonTrigger")?.click();
//       return;
//     }

//     setIsSubmitting(true);
    
//     try {
//       const result = await submitThreePLRequest({
//         companyName: formData.companyName,
//         contactName: formData.contactName,
//         contactEmail: formData.contactEmail,
//         contactPhone: formData.contactPhone,
//         productType: "See uploaded document or brief description",
//         productCategory: "Other",
//         hazardousMaterials: false,
//         specialHandlingNeeded: false,
//         estimatedVolume: "See uploaded document or brief description",
//         temperatureControlled: false,
//         securityRequirements: "Standard",
//         averageOrdersPerMonth: "See uploaded document or brief description",
//         peakSeasonMonths: [],
//         internationalShipping: false,
//         integrationNeeded: !!formData.ecommercePlatform,
//         customRequirements: formData.requirements,
//         documentUrl: formData.documentUrl,
//         userId: user.id,
//         ecommercePlatform: formData.ecommercePlatform,
//         ecommerceStoreUrl: formData.ecommerceStoreUrl,
//         ecommerceSkuCount: formData.ecommerceSkuCount,
//         ecommerceOrderVolume: formData.ecommerceOrderVolume
//       });
      
//       setSubmissionResult(result);
      
//       if (result.success) {
//         toast({
//           title: "Request Submitted",
//           description: `Your 3PL service request has been submitted with ID: ${result.requestId}`,
//         });
//       } else {
//         toast({
//           title: "Submission Failed",
//           description: result.message || "There was a problem with your request.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Error in submission flow:", error);
//       toast({
//         title: "Submission Error",
//         description: "An unexpected error occurred.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSubmitRequest = async () => {
//     if (!isSignedIn || !user) {
//       document.querySelector<HTMLButtonElement>("button.cl-userButtonTrigger")?.click();
//       return;
//     }

//     setIsSubmitting(true);
    
//     try {
//       const result = await submitThreePLRequest({
//         companyName,
//         contactName,
//         contactEmail,
//         contactPhone,
//         productType,
//         productCategory,
//         hazardousMaterials,
//         specialHandlingNeeded: specialHandling,
//         specialHandlingNotes,
//         estimatedVolume,
//         temperatureControlled,
//         securityRequirements,
//         averageOrdersPerMonth: averageOrders,
//         peakSeasonMonths: selectedPeakMonths,
//         internationalShipping,
//         integrationNeeded,
//         integrationSystems: integrationNeeded ? selectedIntegrations : undefined,
//         customRequirements,
//         documentUrl,
//         userId: user.id,
//         ecommercePlatform: integrationNeeded && selectedIntegrations?.includes("Shopify") ? "Shopify" : 
//                           integrationNeeded && selectedIntegrations?.includes("WooCommerce") ? "WooCommerce" :
//                           integrationNeeded && selectedIntegrations?.includes("Magento") ? "Magento" :
//                           integrationNeeded && selectedIntegrations?.includes("BigCommerce") ? "BigCommerce" :
//                           integrationNeeded && selectedIntegrations?.includes("Amazon") ? "Amazon" : 
//                           undefined,
//         ecommerceStoreUrl: ecommerceStoreUrl,
//         ecommerceSkuCount: ecommerceSkuCount,
//         ecommerceOrderVolume: ecommerceOrderVolume
//       });
      
//       setSubmissionResult(result);
      
//       if (result.success) {
//         toast({
//           title: "Request Submitted",
//           description: `Your 3PL service request has been submitted with ID: ${result.requestId}`,
//         });
//       } else {
//         toast({
//           title: "Submission Failed",
//           description: result.message || "There was a problem with your request.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Error in submission flow:", error);
//       toast({
//         title: "Submission Error",
//         description: "An unexpected error occurred.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <NavBar />

//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-3xl font-bold mb-6">3PL Services Request</h1>
//           <p className="text-muted-foreground mb-8">
//             Complete this form to request our Third-Party Logistics (3PL) services. Our team will review your requirements
//             and contact you within 1-2 business days with a custom solution for your business.
//           </p>
          
//           <Tabs defaultValue="detailed" value={activeTab} onValueChange={setActiveTab} className="mb-8">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="detailed">Detailed Form</TabsTrigger>
//               <TabsTrigger value="simple">Quick Upload</TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="detailed">
//               <form onSubmit={handleSubmit} className="space-y-8">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Company Information</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <Label htmlFor="companyName">Company Name</Label>
//                         <Input 
//                           id="companyName" 
//                           value={companyName}
//                           onChange={(e) => setCompanyName(e.target.value)}
//                           required
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="contactName">Contact Name</Label>
//                         <Input 
//                           id="contactName" 
//                           value={contactName}
//                           onChange={(e) => setContactName(e.target.value)}
//                           required
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="contactEmail">Contact Email</Label>
//                         <Input 
//                           id="contactEmail" 
//                           type="email"
//                           value={contactEmail}
//                           onChange={(e) => setContactEmail(e.target.value)}
//                           required
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="contactPhone">Contact Phone</Label>
//                         <Input 
//                           id="contactPhone" 
//                           value={contactPhone}
//                           onChange={(e) => setContactPhone(e.target.value)}
//                           required
//                         />
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
                
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Supporting Documentation (Optional)</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <DocumentUpload 
//                       userId={user?.id || ""} 
//                       onDocumentUploaded={handleDocumentUploaded} 
//                     />
//                     <p className="text-sm text-muted-foreground mt-2">
//                       You can upload a document with additional requirements or specifications to supplement this form.
//                     </p>
//                   </CardContent>
//                 </Card>
                
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Product Details</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div>
//                       <Label htmlFor="productType">Product Type/Description</Label>
//                       <Textarea 
//                         id="productType" 
//                         value={productType}
//                         onChange={(e) => setProductType(e.target.value)}
//                         required
//                         placeholder="Describe your products"
//                       />
//                     </div>
                    
//                     <div>
//                       <Label htmlFor="productCategory">Product Category</Label>
//                       <Select 
//                         value={productCategory} 
//                         onValueChange={setProductCategory}
//                         required
//                       >
//                         <SelectTrigger id="productCategory">
//                           <SelectValue placeholder="Select category" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {productCategories.map(category => (
//                             <SelectItem key={category} value={category}>{category}</SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
                    
//                     <div className="flex items-center space-x-2">
//                       <Checkbox 
//                         id="hazardousMaterials" 
//                         checked={hazardousMaterials}
//                         onCheckedChange={(checked) => setHazardousMaterials(checked as boolean)}
//                       />
//                       <Label htmlFor="hazardousMaterials">Contains hazardous materials</Label>
//                     </div>
                    
//                     <div className="flex items-center space-x-2">
//                       <Checkbox 
//                         id="specialHandling" 
//                         checked={specialHandling}
//                         onCheckedChange={(checked) => setSpecialHandling(checked as boolean)}
//                       />
//                       <Label htmlFor="specialHandling">Requires special handling</Label>
//                     </div>
                    
//                     {specialHandling && (
//                       <div>
//                         <Label htmlFor="specialHandlingNotes">Special Handling Requirements</Label>
//                         <Textarea 
//                           id="specialHandlingNotes" 
//                           value={specialHandlingNotes}
//                           onChange={(e) => setSpecialHandlingNotes(e.target.value)}
//                           placeholder="Describe special handling requirements"
//                         />
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
                
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Storage & Fulfillment Requirements</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div>
//                       <Label htmlFor="estimatedVolume">Estimated Storage Volume (pallets/month)</Label>
//                       <Input 
//                         id="estimatedVolume" 
//                         value={estimatedVolume}
//                         onChange={(e) => setEstimatedVolume(e.target.value)}
//                         required
//                       />
//                     </div>

//                          <div>
//                       <Label htmlFor="estimatedVolume">Estimated Storage Volume (pallets/month)</Label>
//                       <Input 
//                         id="estimatedVolume" 
//                         value={estimatedVolume}
//                         onChange={(e) => setEstimatedVolume(e.target.value)}
//                         required
//                       />
//                     </div>
                    
//                     <div className="flex items-center space-x-2">
//                       <Checkbox 
//                         id="temperatureControlled" 
//                         checked={temperatureControlled}
//                         onCheckedChange={(checked) => setTemperatureControlled(checked as boolean)}
//                       />
//                       <Label htmlFor="temperatureControlled">Requires temperature-controlled storage</Label>
//                     </div>
                    
//                     <div>
//                       <Label htmlFor="securityRequirements">Security Requirements</Label>
//                       <Select 
//                         value={securityRequirements} 
//                         onValueChange={setSecurityRequirements}
//                       >
//                         <SelectTrigger id="securityRequirements">
//                           <SelectValue placeholder="Select security level" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="Standard">Standard Security</SelectItem>
//                           <SelectItem value="High">High Security</SelectItem>
//                           <SelectItem value="Maximum">Maximum Security</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
                    
//                     <Separator />
                    
//                     <div>
//                       <Label htmlFor="averageOrders">Average Monthly Orders</Label>
//                       <Input 
//                         id="averageOrders" 
//                         value={averageOrders}
//                         onChange={(e) => setAverageOrders(e.target.value)}
//                         required
//                       />
//                     </div>
                    
//                     <div>
//                       <Label className="block mb-2">Peak Season Months (select all that apply)</Label>
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//                         {months.map(month => (
//                           <div key={month} className="flex items-center space-x-2">
//                             <Checkbox 
//                               id={`month-${month}`} 
//                               checked={selectedPeakMonths.includes(month)}
//                               onCheckedChange={() => handlePeakMonthToggle(month)}
//                             />
//                             <Label htmlFor={`month-${month}`}>{month}</Label>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center space-x-2">
//                       <Checkbox 
//                         id="internationalShipping" 
//                         checked={internationalShipping}
//                         onCheckedChange={(checked) => setInternationalShipping(checked as boolean)}
//                       />
//                       <Label htmlFor="internationalShipping">Requires international shipping</Label>
//                     </div>
//                   </CardContent>
//                 </Card>
                
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Additional Requirements</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="flex items-center space-x-2">
//                       <Checkbox 
//                         id="integrationNeeded" 
//                         checked={integrationNeeded}
//                         onCheckedChange={(checked) => setIntegrationNeeded(checked as boolean)}
//                       />
//                       <Label htmlFor="integrationNeeded">Requires e-commerce platform integration</Label>
//                     </div>
                    
//                     {integrationNeeded && (
//                       <div className="mt-4">
//                         <EcommerceIntegration 
//                           onPlatformChange={setEcommercePlatform}
//                           onStoreUrlChange={setEcommerceStoreUrl}
//                           onSkuCountChange={setEcommerceSkuCount}
//                           onOrderVolumeChange={setEcommerceOrderVolume}
//                         />
//                       </div>
//                     )}
                    
//                     <div>
//                       <Label htmlFor="customRequirements">Custom Requirements or Additional Information</Label>
//                       <Textarea 
//                         id="customRequirements" 
//                         value={customRequirements}
//                         onChange={(e) => setCustomRequirements(e.target.value)}
//                         placeholder="Any other requirements or information you'd like to share"
//                         className="min-h-[100px]"
//                       />
//                     </div>
//                   </CardContent>
//                 </Card>
                
//                 <div className="flex justify-end">
//                   <Button type="submit" size="lg">
//                     Submit 3PL Request
//                   </Button>
//                 </div>
//               </form>
//             </TabsContent>
            
//             <TabsContent value="simple">
//               <SimpleRequestForm 
//                 userId={user?.id || ""} 
//                 onSubmit={handleSimpleFormSubmit}
//                 isSubmitting={isSubmitting}
//               />
//               <div className="mt-4 text-sm text-muted-foreground">
//                 <p>
//                   Need to provide more detailed information? Switch to the 
//                   <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("detailed")}>
//                     Detailed Form
//                   </Button>
//                 </p>
//               </div>
//             </TabsContent>
//           </Tabs>
          
//           {showConfirmation && (
//             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//               <Card className="max-w-lg w-full">
//                 <CardHeader>
//                   <CardTitle>Confirm 3PL Service Request</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <p>
//                     Please review your information before submitting. Our team will contact you within 
//                     1-2 business days to discuss your 3PL service requirements.
//                   </p>
                  
//                   <div className="text-sm space-y-2">
//                     <p><strong>Company:</strong> {companyName}</p>
//                     <p><strong>Contact:</strong> {contactName} ({contactEmail})</p>
//                     <p><strong>Product Type:</strong> {productType}</p>
//                     <p><strong>Storage Volume:</strong> {estimatedVolume} pallets/month</p>
//                     <p><strong>Storage Volume:</strong> {estimatedVolume} shelves/month</p>
//                     <p><strong>Average Orders:</strong> {averageOrders}/month</p>
//                     {documentUrl && (
//                       <p><strong>Document:</strong> Uploaded</p>
//                     )}
//                   </div>
                  
//                   <div className="flex justify-end space-x-3 pt-4">
//                     <Button 
//                       variant="outline" 
//                       onClick={() => setShowConfirmation(false)}
//                     >
//                       Edit Request
//                     </Button>
//                     <Button 
//                       onClick={handleSubmitRequest}
//                       disabled={isSubmitting}
//                     >
//                       {isSubmitting ? "Submitting..." : "Confirm & Submit"}
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           )}
          
//           {submissionResult && submissionResult.success && (
//             <div className="mt-8 bg-green-50 p-6 rounded-lg border border-green-200">
//               <h3 className="text-xl font-medium text-green-800 mb-2">Request Submitted Successfully!</h3>
//               <p className="text-green-700 mb-4">
//                 Your 3PL service request has been submitted. Our team will review your requirements and contact you
//                 within 1-2 business days.
//               </p>
//               <p className="text-sm text-green-600">Request ID: {submissionResult.requestId}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ThreePLServicePage;
