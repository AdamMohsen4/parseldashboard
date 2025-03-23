
// import React from 'react';
// import { format } from 'date-fns';
// import { Shipment, TrackingPoint } from '@/types';
// import Card from '../common/Card';
// import { Activity, Package, MapPin, AlertCircle, Check, Calendar, Truck } from 'lucide-react';

// interface TimelineProps {
//   shipment: Shipment | null;
//   trackingPoints: TrackingPoint[];
//   isLoading: boolean;
// }

// const Timeline: React.FC<TimelineProps> = ({ shipment, trackingPoints, isLoading }) => {
//   // Format date helper
//   const formatDateTime = (dateString: string) => {
//     try {
//       return format(new Date(dateString), 'MMM d, yyyy • HH:mm');
//     } catch (e) {
//       return 'Invalid date';
//     }
//   };
  
//   if (isLoading) {
//     return (
//       <Card className="w-full h-72 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-pulse mb-4">
//             <Activity className="h-10 w-10 mx-auto text-muted" />
//           </div>
//           <p className="text-muted-foreground">Loading shipment timeline...</p>
//         </div>
//       </Card>
//     );
//   }
  
//   if (!shipment) {
//     return (
//       <Card className="w-full h-72 flex items-center justify-center">
//         <div className="text-center">
//           <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//           <h3 className="font-medium mb-2">No shipment selected</h3>
//           <p className="text-muted-foreground text-sm max-w-md">
//             Select a shipment to view its timeline.
//           </p>
//         </div>
//       </Card>
//     );
//   }
  
//   // Create a unified timeline that includes both shipment events and tracking points
//   const createTimelineEvents = () => {
//     const events = [];
    
//     // Add shipment creation event
//     events.push({
//       id: 'creation',
//       title: 'Shipment Created',
//       description: `Parcel scheduled for pickup in ${shipment.pickupLocation.city}, ${shipment.pickupLocation.country}`,
//       icon: <Package className="h-5 w-5" />,
//       timestamp: shipment.createdAt,
//       type: 'shipment'
//     });
    
//     // Add pickup scheduled event if present
//     if (shipment.pickupTime) {
//       events.push({
//         id: 'pickup-scheduled',
//         title: 'Pickup Scheduled',
//         description: `Carrier will collect the parcel`,
//         icon: <Calendar className="h-5 w-5" />,
//         timestamp: shipment.pickupTime,
//         type: 'shipment'
//       });
//     }
    
//     // Add tracking events
//     trackingPoints.forEach(point => {
//       events.push({
//         id: point.id,
//         title: point.status,
//         description: point.location,
//         icon: point.status === 'Delivered' 
//           ? <Check className="h-5 w-5" /> 
//           : point.status === 'Picked up' 
//             ? <Truck className="h-5 w-5" />
//             : <MapPin className="h-5 w-5" />,
//         timestamp: point.timestamp,
//         type: 'tracking'
//       });
//     });
    
//     // Add delivery event if present
//     if (shipment.deliveryTime) {
//       events.push({
//         id: 'delivery',
//         title: 'Delivered',
//         description: `Parcel delivered in ${shipment.deliveryLocation.city}, ${shipment.deliveryLocation.country}`,
//         icon: <Check className="h-5 w-5" />,
//         timestamp: shipment.deliveryTime,
//         type: 'shipment'
//       });
//     }
    
//     // Sort by timestamp
//     return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
//   };
  
//   const timelineEvents = createTimelineEvents();
  
//   return (
//     <Card className="w-full animate-fade-in">
//       <div className="border-b pb-4 mb-6">
//         <h2 className="text-xl font-semibold">Shipment Timeline</h2>
//         <div className="flex items-center justify-between">
//           <p className="text-muted-foreground text-sm">
//             Tracking: {shipment.trackingCode || 'Not available yet'}
//           </p>
//           <div className="flex items-center space-x-2">
//             <MapPin className="h-4 w-4 text-primary" />
//             <span className="text-sm font-medium">
//               {shipment.pickupLocation.city} → {shipment.deliveryLocation.city}
//             </span>
//           </div>
//         </div>
//       </div>
      
//       <div className="space-y-6 px-1">
//         {timelineEvents.map((event, index) => (
//           <div key={event.id} className="relative pl-10 pb-6" style={{ '--index': index } as React.CSSProperties}>
//             {/* Vertical line */}
//             {index < timelineEvents.length - 1 && (
//               <div className="absolute left-4 top-10 bottom-0 w-px bg-border -translate-x-1/2" />
//             )}
            
//             {/* Icon */}
//             <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${
//               event.type === 'tracking' ? 'bg-primary text-white' : 'bg-secondary border border-border'
//             }`}>
//               {event.icon}
//             </div>
            
//             {/* Content */}
//             <div className="animate-in" style={{ animationDelay: `calc(var(--index) * 50ms)` }}>
//               <h3 className="font-medium text-base">{event.title}</h3>
//               <p className="text-muted-foreground text-sm">{event.description}</p>
//               <p className="text-xs text-muted-foreground mt-1">{formatDateTime(event.timestamp)}</p>
//             </div>
//           </div>
//         ))}
        
//         {timelineEvents.length === 0 && (
//           <div className="py-10 text-center">
//             <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
//             <h3 className="font-medium mb-1">No timeline events yet</h3>
//             <p className="text-muted-foreground text-sm">
//               Timeline events will appear here once your shipment begins its journey.
//             </p>
//           </div>
//         )}
//       </div>
//     </Card>
//   );
// };

// export default Timeline;
