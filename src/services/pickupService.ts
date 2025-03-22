
// // This service handles pickup slot scheduling
// // In a real app, this would connect to carrier APIs
// // For our MVP, we'll use hardcoded slots

// import { toast } from "@/components/ui/use-toast";

// export interface PickupSlot {
//   id: string;
//   date: string;
//   timeWindow: string;
//   available: boolean;
// }

// export interface PickupRequest {
//   shipmentId: string;
//   carrierName: string;
//   pickupAddress: string;
//   preferredDate?: string;
//   slotId?: string;
// }

// export interface PickupResponse {
//   confirmed: boolean;
//   pickupTime?: string;
//   message?: string;
// }

// // Hardcoded pickup slots for MVP
// const availablePickupSlots: PickupSlot[] = [
//   { id: 'slot-1', date: '2023-11-10', timeWindow: '09:00 - 12:00', available: true },
//   { id: 'slot-2', date: '2023-11-10', timeWindow: '13:00 - 16:00', available: true },
//   { id: 'slot-3', date: '2023-11-11', timeWindow: '09:00 - 12:00', available: true },
//   { id: 'slot-4', date: '2023-11-11', timeWindow: '13:00 - 16:00', available: true },
//   { id: 'slot-5', date: '2023-11-12', timeWindow: '09:00 - 12:00', available: true },
// ];

// // Get available pickup slots
// export const getPickupSlots = async (): Promise<PickupSlot[]> => {
//   // Simulate API call delay
//   await new Promise(resolve => setTimeout(resolve, 800));
//   return availablePickupSlots;
// };

// // Schedule a pickup
// export const schedulePickup = async (request: PickupRequest): Promise<PickupResponse> => {
//   try {
//     console.log("Scheduling pickup:", request);
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     let pickupTime = "";
    
//     // If a slot ID was provided, find the corresponding slot
//     if (request.slotId) {
//       const slot = availablePickupSlots.find(s => s.id === request.slotId);
//       if (slot) {
//         pickupTime = `${slot.date} ${slot.timeWindow.split(' - ')[0]}`;
//       }
//     } else {
//       // Default to first available slot if none was specified
//       const firstAvailable = availablePickupSlots.find(s => s.available);
//       if (firstAvailable) {
//         pickupTime = `${firstAvailable.date} ${firstAvailable.timeWindow.split(' - ')[0]}`;
//       }
//     }
    
//     if (!pickupTime) {
//       return {
//         confirmed: false,
//         message: "No available pickup slots"
//       };
//     }
    
//     return {
//       confirmed: true,
//       pickupTime
//     };
//   } catch (error) {
//     console.error("Error scheduling pickup:", error);
//     toast({
//       title: "Pickup Scheduling Failed",
//       description: "Unable to schedule pickup. Please try again.",
//       variant: "destructive",
//     });
//     return {
//       confirmed: false,
//       message: "Failed to schedule pickup"
//     };
//   }
// };
