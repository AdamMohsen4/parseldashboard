
// import React from 'react';
// import Card from '../common/Card';
// import { TrackingPoint } from '@/types';
// import { MapPin, AlertCircle } from 'lucide-react';

// interface TrackingMapProps {
//   trackingPoints: TrackingPoint[];
//   isLoading: boolean;
// }

// const TrackingMap: React.FC<TrackingMapProps> = ({ trackingPoints, isLoading }) => {
//   // For MVP, we'll show a placeholder map with tracking points displayed as a list
//   // In a real implementation, we'd use a map library like react-leaflet

//   if (isLoading) {
//     return (
//       <Card className="w-full h-72 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-pulse mb-4">
//             <MapPin className="h-10 w-10 mx-auto text-muted" />
//           </div>
//           <p className="text-muted-foreground">Loading tracking data...</p>
//         </div>
//       </Card>
//     );
//   }

//   if (trackingPoints.length === 0) {
//     return (
//       <Card className="w-full h-72 flex items-center justify-center">
//         <div className="text-center">
//           <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//           <h3 className="font-medium mb-2">No tracking data available</h3>
//           <p className="text-muted-foreground text-sm max-w-md">
//             Tracking information will appear here once your shipment is in transit.
//           </p>
//         </div>
//       </Card>
//     );
//   }

//   return (
//     <Card className="w-full animate-fade-in">
//       <div className="border-b pb-4 mb-4">
//         <h2 className="text-xl font-semibold">Shipment Location</h2>
//         <p className="text-muted-foreground text-sm">Real-time tracking of your parcel</p>
//       </div>
      
//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Map placeholder */}
//         <div className="flex-1 bg-muted/30 rounded-lg border border-border h-72 relative overflow-hidden">
//           <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
//             <div className="text-center">
//               <MapPin className="h-12 w-12 mx-auto mb-2" />
//               <p className="font-medium">Map Visualization</p>
//               <p className="text-sm">Interactive map will appear here in the final version</p>
//             </div>
//           </div>
          
//           {/* Dots representing tracking points */}
//           {trackingPoints.map((point, index) => {
//             // Calculate pseudo-positions based on the order of points
//             const progress = index / (trackingPoints.length - 1);
//             const top = 20 + progress * 60; // Top position from 20% to 80%
//             const left = 20 + progress * 60; // Left position from 20% to 80%
            
//             return (
//               <div 
//                 key={point.id}
//                 className="absolute w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
//                 style={{ 
//                   top: `${top}%`, 
//                   left: `${left}%`,
//                   animationDelay: `${index * 0.2}s`
//                 }}
//               />
//             );
//           })}
//         </div>
        
//         {/* Location list */}
//         <div className="w-full md:w-64 flex-shrink-0">
//           <h3 className="font-medium mb-3">Tracking Updates</h3>
//           <div className="space-y-4">
//             {trackingPoints.map((point, index) => (
//               <div key={point.id} className="relative pl-6">
//                 {/* Connection line */}
//                 {index < trackingPoints.length - 1 && (
//                   <div className="absolute left-2.5 top-3 bottom-0 w-px bg-border -translate-x-1/2" />
//                 )}
                
//                 {/* Status dot */}
//                 <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full border-2 border-primary bg-background flex items-center justify-center">
//                   <div className="w-2.5 h-2.5 rounded-full bg-primary" />
//                 </div>
                
//                 {/* Content */}
//                 <div>
//                   <p className="font-medium text-sm">{point.status}</p>
//                   <p className="text-xs text-muted-foreground">{point.location}</p>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     {new Date(point.timestamp).toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default TrackingMap;
