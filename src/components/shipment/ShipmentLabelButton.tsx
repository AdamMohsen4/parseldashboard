
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Download, Loader2 } from "lucide-react";
// import { toast } from "@/components/ui/use-toast";
// import { generateLabel } from "@/services/labelService";
// import { Shipment } from "@/services/shipmentService";

// interface ShipmentLabelButtonProps {
//   shipment: Shipment;
// }

// const ShipmentLabelButton: React.FC<ShipmentLabelButtonProps> = ({ shipment }) => {
//   const [isGenerating, setIsGenerating] = useState(false);

//   const handleGenerateLabel = async () => {
//     const trackingCode = shipment.trackingCode;
//     const shipmentId = shipment.id || "SHIP-" + Math.floor(Math.random() * 1000000);
    
//     if (!trackingCode) {
//       toast({
//         title: "Error",
//         description: "Unable to generate label: missing tracking code",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     setIsGenerating(true);
    
//     try {
//       // Prepare shipment dimensions
//       const dimensions = `${shipment.dimensions.length || '30'}x${shipment.dimensions.width || '20'}x${shipment.dimensions.height || '10'} cm`;
      
//       // Create address strings
//       const pickupAddress = shipment.pickup || 'Unknown pickup location';
//       const deliveryAddress = shipment.delivery || 'Unknown delivery location';
      
//       // Generate the label
//       const result = await generateLabel({
//         shipmentId,
//         carrierName: shipment.carrier.name,
//         trackingCode,
//         senderAddress: pickupAddress,
//         recipientAddress: deliveryAddress,
//         packageDetails: {
//           weight: String(shipment.weight) || '1',
//           dimensions: dimensions
//         },
//         language: 'en'
//       });
      
//       if (result.success) {
//         // Open the label in a new tab
//         window.open(result.labelUrl, '_blank');
        
//         toast({
//           title: "Label Generated",
//           description: "Your shipping label has been generated successfully",
//         });
//       } else {
//         toast({
//           title: "Label Generation Failed",
//           description: result.message || "Unable to generate shipping label",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Error generating label:", error);
//       toast({
//         title: "Label Generation Error",
//         description: "An unexpected error occurred",
//         variant: "destructive",
//       });
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   return (
//     <Button 
//       size="sm" 
//       variant="outline" 
//       onClick={handleGenerateLabel}
//       disabled={isGenerating}
//     >
//       {isGenerating ? (
//         <Loader2 className="h-4 w-4 animate-spin" />
//       ) : (
//         <Download className="h-4 w-4 mr-1" />
//       )}
//       Label
//     </Button>
//   );
// };

// export default ShipmentLabelButton;
