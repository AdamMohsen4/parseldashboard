
// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import { Shipment } from "@/services/shipmentService";
// import ShipmentStatus from "./ShipmentStatus";
// import ShipmentLabelButton from "./ShipmentLabelButton";

// interface ShipmentItemProps {
//   shipment: Shipment;
// }

// const ShipmentItem: React.FC<ShipmentItemProps> = ({ shipment }) => {
//   return (
//     <div className="py-4 first:pt-0 last:pb-0">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
//         <div>
//           <div className="flex items-center gap-2">
//             <h3 className="font-medium">
//               {shipment.pickup} → {shipment.delivery}
//             </h3>
//             <ShipmentStatus status={shipment.status} />
//           </div>
//           <div className="text-sm text-muted-foreground">
//             <span>Tracking: {shipment.trackingCode}</span>
//             <span className="mx-2">•</span>
//             <span>Created: {new Date(shipment.createdAt).toLocaleDateString()}</span>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <ShipmentLabelButton shipment={shipment} />
//           <Button size="sm" variant="outline" asChild>
//             <Link to={`/tracking?code=${shipment.trackingCode}`}>
//               Track
//             </Link>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShipmentItem;
