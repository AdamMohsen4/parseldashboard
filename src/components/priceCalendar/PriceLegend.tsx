
// import React from "react";
// import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/use-toast";
// import { formatPrice, PricingDay } from "@/utils/pricingUtils";
// import { useTranslation } from "react-i18next";
// import { isSameDay } from "date-fns";
// import { ArrowRight, Calendar, Package } from "lucide-react";

// interface PriceLegendProps {
//   pricingData: PricingDay[];
//   pickup?: string;
//   delivery?: string;
// }

// const PriceLegend: React.FC<PriceLegendProps> = ({ pricingData, pickup, delivery }) => {
//   const { t } = useTranslation();
  
//   const todayPricing = pricingData.filter(day => isSameDay(day.date, new Date()));

//   const handleBookNow = () => {
//     toast({
//       title: t('shipping.bookNow', 'Book Now'),
//       description: t('shipping.bestPriceToday', 'Lock in today\'s rate for your shipment!'),
//     });
//   };

//   const handleCompareRates = () => {
//     toast({
//       title: t('shipping.compareRates', 'Compare Rates'),
//       description: t('shipping.seeAllOptions', 'See all available shipping options'),
//     });
//   };

//   return (
//     <Card className="h-full bg-white border border-gray-100 shadow-sm">
//       <CardHeader className="pb-2">
//         <CardTitle className="text-xl text-gray-800">{t('shipping.rateInfo', 'Rate Information')}</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {/* Route summary */}
//         {pickup && delivery && (
//           <div className="border-b pb-4">
//             <h3 className="font-medium text-sm text-gray-500 mb-2">{t('shipping.routeSummary', 'Your Route')}</h3>
//             <div className="flex items-center text-sm mb-1">
//               <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
//               <span className="truncate">{pickup}</span>
//             </div>
            
//             <div className="flex pl-3 my-1">
//               <ArrowRight className="h-3 w-3 text-gray-400" />
//             </div>
            
//             <div className="flex items-center text-sm">
//               <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
//               <span className="truncate">{delivery}</span>
//             </div>
//           </div>
//         )}

//         {/* Price legend */}
//         <div className="space-y-3">
//           <h3 className="font-medium text-sm text-gray-500">{t('shipping.legend', 'Price Guide')}</h3>
          
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="w-4 h-4 rounded bg-green-50 border-b-2 border-green-200 mr-2"></div>
//               <span className="text-sm">{t('shipping.lowVolume', 'High Demand')}</span>
//             </div>
//             <span className="text-sm font-medium">{formatPrice(8.99)}</span>
//           </div>
          
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="w-4 h-4 rounded bg-yellow-50 border-b-2 border-yellow-200 mr-2"></div>
//               <span className="text-sm">{t('shipping.mediumVolume', 'Medium Demand')}</span>
//             </div>
//             <span className="text-sm font-medium">{formatPrice(10.99)}</span>
//           </div>
          
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="w-4 h-4 rounded bg-red-50 border-b-2 border-red-200 mr-2"></div>
//               <span className="text-sm">{t('shipping.highVolume', 'Low Demand')}</span>
//             </div>
//             <span className="text-sm font-medium">{formatPrice(13.99)}</span>
//           </div>
          
//           <div className="flex items-center justify-between text-gray-400">
//             <div className="flex items-center">
//               <div className="w-4 h-4 rounded border border-gray-200 mr-2"></div>
//               <span className="text-sm">{t('shipping.unavailable', 'Unavailable')}</span>
//             </div>
//             <span className="text-sm">—</span>
//           </div>
//         </div>
        
//         {/* Today's rates */}
//         {todayPricing.length > 0 && (
//           <div className="space-y-3 border-t pt-4">
//             <h3 className="font-medium text-sm text-gray-500">{t('shipping.todaysRates', "Today's Best Rate")}</h3>
            
//             {todayPricing.map((today, idx) => (
//               <div key={idx} className="space-y-2 bg-gray-50 p-3 rounded-md">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm">{t('shipping.baseRate', 'Base Rate')}:</span>
//                   <span className="font-semibold">{formatPrice(today.basePrice)}</span>
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm">{t('shipping.estimatedOrders', 'Est. Volume')}:</span>
//                   <span className="text-sm">{today.estimatedOrders} {t('shipping.packages', 'packages')}</span>
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm">{t('shipping.volumeLevel', 'Demand')}:</span>
//                   <span className={`text-xs px-2 py-0.5 rounded-full ${
//                     today.loadFactor === 'low' ? 'bg-green-100 text-green-800' :
//                     today.loadFactor === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {t(`shipping.${today.loadFactor}`, today.loadFactor)}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </CardContent>
      
//       <CardFooter className="flex flex-col space-y-3 pt-2">
//         <Button 
//           className="w-full bg-primary hover:bg-primary/90" 
//           onClick={handleBookNow}
//         >
//           <Calendar className="mr-2 h-4 w-4" />
//           {t('shipping.bookShipment', 'Book Shipment')}
//         </Button>
        
//         <Button 
//           variant="outline" 
//           className="w-full border-gray-200 text-gray-700" 
//           onClick={handleCompareRates}
//         >
//           <Package className="mr-2 h-4 w-4" />
//           {t('shipping.compareOptions', 'Compare Options')}
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default PriceLegend;
