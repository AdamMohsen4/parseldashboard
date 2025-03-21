
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import { validateEcommerceConnection } from "@/services/threePLService";
// import { toast } from "@/components/ui/use-toast";
// import { EcommercePlatform } from "@/types/threePL";
// import { CheckCircle2, AlertCircle } from "lucide-react";

// // Available platforms
// const platforms: EcommercePlatform[] = [
//   {
//     id: "shopify",
//     name: "Shopify",
//     description: "Connect your Shopify store to automate order fulfillment",
//     apiDocUrl: "https://shopify.dev/docs/api"
//   },
//   {
//     id: "woocommerce",
//     name: "WooCommerce",
//     description: "Integrate with your WooCommerce store",
//     apiDocUrl: "https://woocommerce.github.io/woocommerce-rest-api-docs/"
//   },
//   {
//     id: "magento",
//     name: "Magento",
//     description: "Connect your Magento e-commerce store",
//     apiDocUrl: "https://devdocs.magento.com/guides/v2.4/rest/bk-rest.html"
//   },
//   {
//     id: "bigcommerce",
//     name: "BigCommerce",
//     description: "Integrate with your BigCommerce store",
//     apiDocUrl: "https://developer.bigcommerce.com/api-docs"
//   },
//   {
//     id: "amazon",
//     name: "Amazon Seller Central",
//     description: "Fulfill orders from your Amazon seller account",
//     apiDocUrl: "https://developer-docs.amazon.com/sp-api/docs"
//   },
//   {
//     id: "other",
//     name: "Other Platform",
//     description: "Connect with any other e-commerce platform"
//   }
// ];

// interface EcommerceIntegrationProps {
//   onPlatformChange: (platform: string) => void;
//   onStoreUrlChange: (url: string) => void;
//   onSkuCountChange: (count: string) => void;
//   onOrderVolumeChange: (volume: string) => void;
// }

// const EcommerceIntegration: React.FC<EcommerceIntegrationProps> = ({
//   onPlatformChange,
//   onStoreUrlChange,
//   onSkuCountChange,
//   onOrderVolumeChange
// }) => {
//   const [platform, setPlatform] = useState<string>("");
//   const [apiKey, setApiKey] = useState<string>("");
//   const [storeUrl, setStoreUrl] = useState<string>("");
//   const [skuCount, setSkuCount] = useState<string>("");
//   const [orderVolume, setOrderVolume] = useState<string>("");
//   const [isValidating, setIsValidating] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState<"none" | "connected" | "failed">("none");
//   const [statusMessage, setStatusMessage] = useState<string>("");
  
//   const selectedPlatform = platforms.find(p => p.id === platform);
  
//   const handlePlatformChange = (value: string) => {
//     setPlatform(value);
//     onPlatformChange(value);
//     // Reset connection status when platform changes
//     setConnectionStatus("none");
//     setStatusMessage("");
//   };
  
//   const handleStoreUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const url = e.target.value;
//     setStoreUrl(url);
//     onStoreUrlChange(url);
//   };
  
//   const handleSkuCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const count = e.target.value;
//     setSkuCount(count);
//     onSkuCountChange(count);
//   };
  
//   const handleOrderVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const volume = e.target.value;
//     setOrderVolume(volume);
//     onOrderVolumeChange(volume);
//   };
  
//   const handleValidateConnection = async () => {
//     if (!platform || !apiKey || !storeUrl) {
//       toast({
//         title: "Validation Error",
//         description: "Please provide platform, API key, and store URL to validate",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     setIsValidating(true);
    
//     try {
//       const result = await validateEcommerceConnection(platform, apiKey, storeUrl);
      
//       if (result.valid) {
//         setConnectionStatus("connected");
//         toast({
//           title: "Connection Successful",
//           description: result.message,
//         });
//       } else {
//         setConnectionStatus("failed");
//         toast({
//           title: "Connection Failed",
//           description: result.message,
//           variant: "destructive",
//         });
//       }
      
//       setStatusMessage(result.message);
//     } catch (error) {
//       setConnectionStatus("failed");
//       setStatusMessage("An error occurred during validation");
//       toast({
//         title: "Connection Error",
//         description: "Failed to validate connection. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsValidating(false);
//     }
//   };
  
//   return (
//     <Card>
//       <CardContent className="pt-6">
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="platform">E-commerce Platform</Label>
//             <Select 
//               value={platform} 
//               onValueChange={handlePlatformChange}
//             >
//               <SelectTrigger id="platform">
//                 <SelectValue placeholder="Select platform" />
//               </SelectTrigger>
//               <SelectContent>
//                 {platforms.map(platform => (
//                   <SelectItem key={platform.id} value={platform.id}>
//                     {platform.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {selectedPlatform && (
//               <p className="text-sm text-muted-foreground mt-1">
//                 {selectedPlatform.description}
//               </p>
//             )}
//           </div>
          
//           {platform && (
//             <>
//               <div className="space-y-2">
//                 <Label htmlFor="storeUrl">Store URL</Label>
//                 <Input 
//                   id="storeUrl" 
//                   value={storeUrl}
//                   onChange={handleStoreUrlChange}
//                   placeholder="https://your-store.com"
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="apiKey">API Key or Access Token</Label>
//                 <Input 
//                   id="apiKey" 
//                   type="password"
//                   value={apiKey}
//                   onChange={(e) => setApiKey(e.target.value)}
//                   placeholder="Your platform API key"
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   The API key is only used for validation and is not stored.
//                   {selectedPlatform?.apiDocUrl && (
//                     <>
//                       {" "}
//                       <a 
//                         href={selectedPlatform.apiDocUrl} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         className="text-blue-500 hover:underline"
//                       >
//                         View API documentation
//                       </a>
//                     </>
//                   )}
//                 </p>
//               </div>
              
//               <div className="flex justify-end">
//                 <Button
//                   onClick={handleValidateConnection}
//                   disabled={!platform || !apiKey || !storeUrl || isValidating}
//                   variant="outline"
//                   size="sm"
//                 >
//                   {isValidating ? "Validating..." : "Validate Connection"}
//                 </Button>
//               </div>
              
//               {connectionStatus !== "none" && (
//                 <div className={`p-3 rounded-md flex items-center gap-2 ${
//                   connectionStatus === "connected" ? "bg-green-50" : "bg-red-50"
//                 }`}>
//                   {connectionStatus === "connected" ? (
//                     <CheckCircle2 className="h-5 w-5 text-green-600" />
//                   ) : (
//                     <AlertCircle className="h-5 w-5 text-red-600" />
//                   )}
//                   <span className={connectionStatus === "connected" ? "text-green-700" : "text-red-700"}>
//                     {statusMessage}
//                   </span>
//                 </div>
//               )}
              
//               <Separator className="my-4" />
              
//               <div className="space-y-4">
//                 <h4 className="text-sm font-medium">Store Information</h4>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="skuCount">Number of SKUs</Label>
//                     <Input 
//                       id="skuCount" 
//                       value={skuCount}
//                       onChange={handleSkuCountChange}
//                       placeholder="e.g., 100"
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="orderVolume">Average Monthly Order Volume</Label>
//                     <Input 
//                       id="orderVolume" 
//                       value={orderVolume}
//                       onChange={handleOrderVolumeChange}
//                       placeholder="e.g., 500"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default EcommerceIntegration;
