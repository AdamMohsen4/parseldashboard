
// import { ShippingRate, Shipment, TrackingPoint, ComplianceReport } from '../types';

// export const generateMockRates = (
//   weight: number,
//   urgency: number
// ): ShippingRate[] => {
//   // Base price calculation
//   const basePrice = 7 + (weight * 0.5);
//   const margin = 3;
  
//   // Generate mock rates
//   return [
//     {
//       id: '1',
//       carrier: 'PostNord',
//       originalPrice: Number((basePrice - 0.5).toFixed(2)),
//       price: Number((basePrice - 0.5 + margin).toFixed(2)),
//       eta: urgency <= 1 ? 1 : urgency - 1,
//     },
//     {
//       id: '2',
//       carrier: 'DHL',
//       originalPrice: Number(basePrice.toFixed(2)),
//       price: Number((basePrice + margin).toFixed(2)),
//       eta: urgency <= 2 ? 2 : urgency,
//     },
//     {
//       id: '3',
//       carrier: 'GLS',
//       originalPrice: Number((basePrice + 0.8).toFixed(2)),
//       price: Number((basePrice + 0.8 + margin).toFixed(2)),
//       eta: Math.max(1, urgency - 2),
//     },
//     {
//       id: '4',
//       carrier: 'UPS',
//       originalPrice: Number((basePrice + 1.5).toFixed(2)),
//       price: Number((basePrice + 1.5 + margin).toFixed(2)),
//       eta: Math.max(1, urgency - 2),
//     },
//   ].sort((a, b) => a.price - b.price);
// };

// export const mockShipments: Shipment[] = [
//   {
//     id: '1',
//     carrier: 'PostNord',
//     trackingCode: 'PN123456789',
//     status: 'in-transit',
//     pickupLocation: {
//       address: 'Stortorget 7',
//       city: 'Malmö',
//       country: 'Sweden',
//       postalCode: '21134'
//     },
//     deliveryLocation: {
//       address: 'Mannerheiminaukio 1',
//       city: 'Helsinki',
//       country: 'Finland',
//       postalCode: '00100'
//     },
//     dimensions: {
//       weight: 2.5,
//       length: 30,
//       width: 20,
//       height: 15
//     },
//     pickupTime: '2023-03-15T10:00:00Z',
//     deliveryTime: '2023-03-17T14:00:00Z',
//     price: 10.50,
//     labelUrl: '#',
//     createdAt: '2023-03-14T14:23:00Z',
//     updatedAt: '2023-03-15T11:05:00Z'
//   },
//   {
//     id: '2',
//     carrier: 'DHL',
//     trackingCode: 'DHL987654321',
//     status: 'booked',
//     pickupLocation: {
//       address: 'Kungsgatan 44',
//       city: 'Stockholm',
//       country: 'Sweden',
//       postalCode: '11135'
//     },
//     deliveryLocation: {
//       address: 'Frederiksberggade 11',
//       city: 'Copenhagen',
//       country: 'Denmark',
//       postalCode: '1459'
//     },
//     dimensions: {
//       weight: 1.8,
//       length: 25,
//       width: 18,
//       height: 10
//     },
//     pickupTime: '2023-03-16T13:00:00Z',
//     price: 9.99,
//     labelUrl: '#',
//     createdAt: '2023-03-15T09:45:00Z',
//     updatedAt: '2023-03-15T09:45:00Z'
//   },
//   {
//     id: '3',
//     carrier: 'GLS',
//     trackingCode: 'GLS456123789',
//     status: 'delivered',
//     pickupLocation: {
//       address: 'Dronning Eufemias gate 16',
//       city: 'Oslo',
//       country: 'Norway',
//       postalCode: '0191'
//     },
//     deliveryLocation: {
//       address: 'Rautatientori 1',
//       city: 'Helsinki',
//       country: 'Finland',
//       postalCode: '00100'
//     },
//     dimensions: {
//       weight: 3.2,
//       length: 40,
//       width: 30,
//       height: 20
//     },
//     pickupTime: '2023-03-10T09:00:00Z',
//     deliveryTime: '2023-03-12T11:30:00Z',
//     price: 12.50,
//     labelUrl: '#',
//     createdAt: '2023-03-09T16:20:00Z',
//     updatedAt: '2023-03-12T11:45:00Z'
//   }
// ];

// export const mockTrackingPoints: TrackingPoint[] = [
//   {
//     id: '1',
//     shipmentId: '1',
//     status: 'Picked up',
//     location: 'Malmö, Sweden',
//     timestamp: '2023-03-15T10:15:00Z',
//     latitude: 55.605,
//     longitude: 13.0038
//   },
//   {
//     id: '2',
//     shipmentId: '1',
//     status: 'In transit',
//     location: 'Stockholm, Sweden',
//     timestamp: '2023-03-15T18:30:00Z',
//     latitude: 59.3293,
//     longitude: 18.0686
//   },
//   {
//     id: '3',
//     shipmentId: '1',
//     status: 'Processing at facility',
//     location: 'Turku, Finland',
//     timestamp: '2023-03-16T09:45:00Z',
//     latitude: 60.4518,
//     longitude: 22.2666
//   },
//   {
//     id: '4',
//     shipmentId: '3',
//     status: 'Picked up',
//     location: 'Oslo, Norway',
//     timestamp: '2023-03-10T09:15:00Z',
//     latitude: 59.9139,
//     longitude: 10.7522
//   },
//   {
//     id: '5',
//     shipmentId: '3',
//     status: 'In transit',
//     location: 'Stockholm, Sweden',
//     timestamp: '2023-03-11T08:30:00Z',
//     latitude: 59.3293,
//     longitude: 18.0686
//   },
//   {
//     id: '6',
//     shipmentId: '3',
//     status: 'Out for delivery',
//     location: 'Helsinki, Finland',
//     timestamp: '2023-03-12T09:00:00Z',
//     latitude: 60.1699,
//     longitude: 24.9384
//   },
//   {
//     id: '7',
//     shipmentId: '3',
//     status: 'Delivered',
//     location: 'Helsinki, Finland',
//     timestamp: '2023-03-12T11:30:00Z',
//     latitude: 60.1699,
//     longitude: 24.9384
//   }
// ];

// export const mockComplianceReports: ComplianceReport[] = [
//   {
//     id: '1',
//     shipmentId: '1',
//     type: 'carbon',
//     data: {
//       co2e: 12.5, // kg CO2 equivalent
//       distance: 1250, // km
//       vehicle: 'Truck - Euro 6',
//       report: '/reports/carbon-1.pdf'
//     },
//     createdAt: '2023-03-15T12:00:00Z'
//   },
//   {
//     id: '2',
//     shipmentId: '1',
//     type: 'eld',
//     data: {
//       driverId: 'D123',
//       hoursOfService: 8.5,
//       restPeriods: [
//         { start: '2023-03-15T14:00:00Z', end: '2023-03-15T14:45:00Z' },
//         { start: '2023-03-15T18:00:00Z', end: '2023-03-16T02:00:00Z' }
//       ],
//       compliant: true,
//       report: '/reports/eld-1.pdf'
//     },
//     createdAt: '2023-03-16T08:00:00Z'
//   },
//   {
//     id: '3',
//     shipmentId: '3',
//     type: 'carbon',
//     data: {
//       co2e: 15.2, // kg CO2 equivalent
//       distance: 1520, // km
//       vehicle: 'Truck - Euro 5',
//       report: '/reports/carbon-3.pdf'
//     },
//     createdAt: '2023-03-12T14:00:00Z'
//   }
// ];

// export const pickupSlots = [
//   { id: '1', date: '2023-03-15', timeWindow: '09:00 - 12:00' },
//   { id: '2', date: '2023-03-15', timeWindow: '12:00 - 15:00' },
//   { id: '3', date: '2023-03-15', timeWindow: '15:00 - 18:00' },
//   { id: '4', date: '2023-03-16', timeWindow: '09:00 - 12:00' },
//   { id: '5', date: '2023-03-16', timeWindow: '12:00 - 15:00' },
//   { id: '6', date: '2023-03-16', timeWindow: '15:00 - 18:00' },
//   { id: '7', date: '2023-03-17', timeWindow: '09:00 - 12:00' },
//   { id: '8', date: '2023-03-17', timeWindow: '12:00 - 15:00' },
//   { id: '9', date: '2023-03-17', timeWindow: '15:00 - 18:00' },
// ];
