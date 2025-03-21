
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PricingDay } from "@/utils/pricingUtils";
import { useTranslation } from "react-i18next";
import { ArrowRight, Truck, DollarSign, Clock, Calendar, Flag, MapPin } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { formatCurrency, getCountryFlag } from '@/lib/utils';

interface PriceLegendProps {
  pricingData: PricingDay[];
  pickup: string;
  delivery: string;
}

const PriceLegend: React.FC<PriceLegendProps> = ({ pricingData, pickup, delivery }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Find the lowest price
  const lowestPrice = React.useMemo(() => {
    if (!pricingData.length) return 0;
    return Math.min(...pricingData.map(day => day.price));
  }, [pricingData]);

  // Extract countries from addresses (simplified)
  const extractCountryCode = (address: string): string => {
    if (address.includes("Sweden") || address.includes("Sverige")) return "SE";
    if (address.includes("Finland")) return "FI";
    if (address.includes("Norway") || address.includes("Norge")) return "NO";
    if (address.includes("Denmark") || address.includes("Danmark")) return "DK";
    return "EU";
  };

  const pickupCountry = extractCountryCode(pickup);
  const deliveryCountry = extractCountryCode(delivery);

  const handleBookNow = () => {
    navigate("/shipment");
  };

  return (
    <Card className="h-full bg-white border-0 shadow-none">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg text-gray-800">{t('shipping.shipmentSummary', 'Shipment Summary')}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          <div className="bg-[#F1F0FB] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#9b87f5] rounded-full flex items-center justify-center text-white">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="text-sm font-medium">{t('shipping.route', 'Route')}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-base">{getCountryFlag(pickupCountry)}</span>
                <span className="text-sm text-gray-700 truncate max-w-[100px]">{pickup}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="flex items-center space-x-2">
                <span className="text-base">{getCountryFlag(deliveryCountry)}</span>
                <span className="text-sm text-gray-700 truncate max-w-[100px]">{delivery}</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-[#9b87f5] rounded-full flex items-center justify-center text-white">
                <DollarSign className="h-4 w-4" />
              </div>
              <div className="text-sm font-medium">{t('shipping.pricing', 'Pricing')}</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">{t('shipping.startingFrom', 'Starting from')}</div>
                <div className="text-xl font-semibold text-gray-800">
                  {formatCurrency(lowestPrice)}
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">{t('shipping.lowPrice', 'Low Price')}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm">{t('shipping.mediumPrice', 'Medium Price')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm">{t('shipping.highPrice', 'High Price')}</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-[#9b87f5] rounded-full flex items-center justify-center text-white">
                <Clock className="h-4 w-4" />
              </div>
              <div className="text-sm font-medium">{t('shipping.deliveryTime', 'Delivery Time')}</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">{t('shipping.standardDelivery', 'Standard Delivery')}</div>
                <div className="text-sm font-semibold">1-3 {t('shipping.days', 'days')}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">{t('shipping.expressDelivery', 'Express Delivery')}</div>
                <div className="text-sm font-semibold">24 {t('shipping.hours', 'hours')}</div>
              </div>
            </div>
          </div>
          
          <Button
            className="w-full bg-[#9b87f5] hover:bg-[#8778d9]"
            onClick={handleBookNow}
          >
            <Truck className="mr-2 h-4 w-4" />
            {t('shipping.bookNow', 'Book Now')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceLegend;
