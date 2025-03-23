
// import React from 'react';
// import { format } from 'date-fns';
// import { Package, Search, ExternalLink, ChevronRight } from 'lucide-react';
// import Card from '../common/Card';
// import { Shipment } from '@/types';
// import { Link } from 'react-router-dom';
// import { cn } from '@/lib/utils';

// interface ShipmentListProps {
//   shipments: Shipment[];
//   isLoading: boolean;
//   selectedShipment?: Shipment | null;
//   onSelectShipment: (shipment: Shipment) => void;
// }

// const ShipmentList: React.FC<ShipmentListProps> = ({
//   shipments,
//   isLoading,
//   selectedShipment,
//   onSelectShipment
// }) => {
//   // Get status badge color
//   const getStatusColor = (status: Shipment['status']) => {
//     switch (status) {
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'booked':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'in-transit':
//         return 'bg-purple-100 text-purple-800 border-purple-200';
//       case 'delivered':
//         return 'bg-green-100 text-green-800 border-green-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };
  
//   // Format date helper
//   const formatDate = (dateString: string) => {
//     try {
//       return format(new Date(dateString), 'MMM d, yyyy');
//     } catch (e) {
//       return 'Invalid date';
//     }
//   };
  
//   // Render loading state
//   if (isLoading) {
//     return (
//       <Card className="w-full h-96 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-pulse mb-4">
//             <Package className="h-10 w-10 mx-auto text-muted" />
//           </div>
//           <p className="text-muted-foreground">Loading shipments...</p>
//         </div>
//       </Card>
//     );
//   }
  
//   // Render empty state
//   if (shipments.length === 0) {
//     return (
//       <Card className="w-full">
//         <div className="flex flex-col items-center justify-center py-12">
//           <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
//             <Package className="h-10 w-10 text-muted-foreground" />
//           </div>
//           <h3 className="text-xl font-medium mb-2">No shipments yet</h3>
//           <p className="text-muted-foreground text-center max-w-md mb-6">
//             You haven't booked any shipments yet. 
//             Get started by creating your first shipment.
//           </p>
//           <Link to="/booking">
//             <button className="bg-primary text-white px-4 py-2 rounded-md font-medium">
//               Book Your First Shipment
//             </button>
//           </Link>
//         </div>
//       </Card>
//     );
//   }
  
//   return (
//     <Card className="w-full animate-fade-in overflow-hidden">
//       <div className="border-b pb-4 mb-4 flex justify-between items-center">
//         <div>
//           <h2 className="text-xl font-semibold">Your Shipments</h2>
//           <p className="text-muted-foreground text-sm">
//             {shipments.length} shipment{shipments.length !== 1 ? 's' : ''}
//           </p>
//         </div>
//         <div className="relative hidden sm:block">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <input
//             type="text"
//             placeholder="Search shipments..."
//             className="pl-9 pr-4 py-2 rounded-md border bg-background w-60"
//           />
//         </div>
//       </div>
      
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="text-left border-b">
//               <th className="px-4 py-3 font-medium text-muted-foreground text-sm">Tracking #</th>
//               <th className="px-4 py-3 font-medium text-muted-foreground text-sm">Route</th>
//               <th className="px-4 py-3 font-medium text-muted-foreground text-sm">Carrier</th>
//               <th className="px-4 py-3 font-medium text-muted-foreground text-sm">Date</th>
//               <th className="px-4 py-3 font-medium text-muted-foreground text-sm">Status</th>
//               <th className="px-4 py-3 font-medium text-muted-foreground text-sm"></th>
//             </tr>
//           </thead>
//           <tbody>
//             {shipments.map((shipment) => (
//               <tr 
//                 key={shipment.id}
//                 className={cn(
//                   "border-b last:border-b-0 cursor-pointer hover:bg-muted/30 transition-colors",
//                   selectedShipment?.id === shipment.id && "bg-primary/5"
//                 )}
//                 onClick={() => onSelectShipment(shipment)}
//               >
//                 <td className="px-4 py-3 font-mono text-sm">
//                   {shipment.trackingCode || 'N/A'}
//                 </td>
//                 <td className="px-4 py-3">
//                   <div className="flex items-center">
//                     <span className="text-sm">{shipment.pickupLocation.city}</span>
//                     <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
//                     <span className="text-sm">{shipment.deliveryLocation.city}</span>
//                   </div>
//                 </td>
//                 <td className="px-4 py-3">
//                   <div className="flex items-center">
//                     <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
//                     <span>{shipment.carrier}</span>
//                   </div>
//                 </td>
//                 <td className="px-4 py-3 text-sm">
//                   {formatDate(shipment.createdAt)}
//                 </td>
//                 <td className="px-4 py-3">
//                   <span 
//                     className={cn(
//                       "px-2 py-1 rounded-full text-xs font-medium border",
//                       getStatusColor(shipment.status)
//                     )}
//                   >
//                     {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3 text-right">
//                   <button className="text-primary hover:text-primary/70">
//                     <ExternalLink className="h-4 w-4" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </Card>
//   );
// };

// export default ShipmentList;
