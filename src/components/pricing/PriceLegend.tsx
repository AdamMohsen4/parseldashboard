
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { formatPrice, PricingDay } from "@/utils/pricingUtils";
import { useTranslation } from "react-i18next";
import { isSameDay } from "date-fns";
import { ArrowRight, Calendar, Package } from "lucide-react";

interface PriceLegendProps {
  pricingData: PricingDay[];
}

const PriceLegend: React.FC<PriceLegendProps> = ({ pricingData }) => {
  const { t } = useTranslation();
  
  const todayPricing = pricingData.filter(day => isSameDay(day.date, new Date()));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('shipping.legend', 'Price Legend')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-green-100 mr-2"></div>
            <Label>{t('shipping.lowVolume', 'Low Volume')}</Label>
            <span className="ml-auto font-medium">{formatPrice(9.99)}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-yellow-100 mr-2"></div>
            <Label>{t('shipping.mediumVolume', 'Medium Volume')}</Label>
            <span className="ml-auto font-medium">{formatPrice(14.99)}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-red-100 mr-2"></div>
            <Label>{t('shipping.highVolume', 'High Volume')}</Label>
            <span className="ml-auto font-medium">{formatPrice(19.99)}</span>
          </div>
          <div className="flex items-center text-gray-400">
            <div className="w-4 h-4 rounded border border-gray-200 mr-2"></div>
            <Label>{t('shipping.unavailable', 'Unavailable')}</Label>
          </div>
        </div>
        
        {todayPricing.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h3 className="font-medium mb-2">{t('shipping.todaysRates', "Today's Shipping Rates")}</h3>
            {todayPricing.map((today, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>{t('shipping.baseRate', 'Base Rate')}:</span>
                  <span className="font-medium">{formatPrice(today.basePrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t('shipping.estimatedOrders', 'Est. Orders')}:</span>
                  <span className="font-medium">{today.estimatedOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t('shipping.volumeLevel', 'Volume Level')}:</span>
                  <span className={`font-medium capitalize px-2 py-0.5 rounded-full text-xs ${
                    today.loadFactor === 'low' ? 'bg-green-100 text-green-800' :
                    today.loadFactor === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {t(`shipping.${today.loadFactor}`, today.loadFactor)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button className="w-full" onClick={() => toast({
          title: t('shipping.bookNow', 'Book Now'),
          description: t('shipping.bestPriceToday', 'Lock in today\'s rate for your shipment!'),
        })}>
          <Calendar className="mr-2 h-4 w-4" />
          {t('shipping.bookShipment', 'Book Shipment')}
        </Button>
        
        <Button variant="outline" className="w-full" onClick={() => toast({
          title: t('shipping.compareRates', 'Compare Rates'),
          description: t('shipping.seeAllOptions', 'See all available shipping options'),
        })}>
          <Package className="mr-2 h-4 w-4" />
          {t('shipping.compareOptions', 'Compare Options')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PriceLegend;
