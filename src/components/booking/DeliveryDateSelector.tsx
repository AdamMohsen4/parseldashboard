
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, isSameDay } from "date-fns";
import { useTranslation } from "react-i18next";
import { ArrowRight, CalendarIcon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DeliveryDateSelectorProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date | undefined;
}

interface DatePricing {
  date: Date;
  price: number;
  priceType: 'low' | 'medium' | 'high' | 'normal';
}

const DeliveryDateSelector: React.FC<DeliveryDateSelectorProps> = ({
  onDateSelect,
  selectedDate
}) => {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [pricingData, setPricingData] = useState<DatePricing[]>([]);

  // Generate mock pricing data for the next 30 days
  useEffect(() => {
    const today = new Date();
    const data: DatePricing[] = [];
    
    for (let i = 1; i <= 30; i++) {
      const date = addDays(today, i);
      const dayOfWeek = date.getDay();
      
      // Assign price types based on weekday
      let priceType: 'low' | 'medium' | 'high' | 'normal' = 'normal';
      
      // Set some weekdays to have special pricing
      if (dayOfWeek === 2 || dayOfWeek === 4) { // Tuesday and Thursday
        priceType = 'low';
      } else if (dayOfWeek === 1) { // Monday
        priceType = 'medium';
      } else if (dayOfWeek === 5) { // Friday
        priceType = 'high';
      }
      
      // Calculate price based on type
      let price = 9.90; // Default price
      if (priceType === 'low') price = 6.90;
      if (priceType === 'medium') price = 8.90;
      if (priceType === 'high') price = 12.90;
      
      data.push({ date, price, priceType });
    }
    
    setPricingData(data);
  }, []);

  // Custom day renderer for the calendar
  const renderDay = (day: Date) => {
    // Find pricing for this day
    const pricing = pricingData.find(p => isSameDay(p.date, day));
    const isSelected = selectedDate && isSameDay(selectedDate, day);
    
    // Only style days with pricing data (future days)
    if (!pricing) return <div className="relative h-9 w-9 p-0 font-normal flex items-center justify-center">{day.getDate()}</div>;
    
    // Determine background color based on price type
    let bgColor = "bg-white";
    let textColor = "text-gray-700";
    let borderColor = "border-transparent";
    
    if (isSelected) {
      bgColor = "bg-primary";
      textColor = "text-white";
      borderColor = "border-primary";
    } else {
      switch (pricing.priceType) {
        case 'low':
          bgColor = "bg-green-50";
          textColor = "text-green-800";
          borderColor = "border-green-200";
          break;
        case 'medium':
          bgColor = "bg-yellow-50";
          textColor = "text-yellow-800";
          borderColor = "border-yellow-200";
          break;
        case 'high':
          bgColor = "bg-red-50";
          textColor = "text-red-800";
          borderColor = "border-red-200";
          break;
      }
    }
    
    return (
      <div className={`relative h-9 w-9 p-0 flex flex-col items-center justify-center rounded-md border ${borderColor} ${bgColor} ${textColor}`}>
        <span className="text-sm">{day.getDate()}</span>
        {pricing && pricing.price !== 9.90 && (
          <span className="text-[10px] font-medium">{pricing.price.toFixed(2)} €</span>
        )}
      </div>
    );
  };

  const getSelectedDatePrice = (): number => {
    if (!selectedDate) return 9.90;
    const pricing = pricingData.find(p => isSameDay(p.date, selectedDate));
    return pricing ? pricing.price : 9.90;
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            {t('booking.deliveryDate', 'Välj leveransdatum')}
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {t('booking.deliveryDateTooltip', 'Gröna dagar har lägre priser. Röda dagar har högre priser.')}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect as any}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            fromDate={addDays(new Date(), 1)}
            toDate={addDays(new Date(), 90)}
            disabled={[{ before: addDays(new Date(), 1) }]}
            components={{
              Day: ({ date, ...props }) => (
                <div {...props}>
                  {renderDay(date)}
                </div>
              )
            }}
            className="pointer-events-auto"
          />
        </div>
        
        {selectedDate && (
          <div className="mt-4 p-4 bg-slate-50 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-600">Leveransdatum</p>
                <p className="font-medium">{format(selectedDate, 'PPP', { locale: require('date-fns/locale/sv') })}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{getSelectedDatePrice().toFixed(2)} €</p>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></div>
            <span>{t('booking.lowPrice', 'Lägre pris')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300"></div>
            <span>{t('booking.mediumPrice', 'Medium pris')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-red-100 border border-red-300"></div>
            <span>{t('booking.highPrice', 'Högre pris')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-white border border-gray-300"></div>
            <span>{t('booking.normalPrice', 'Normalt pris')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryDateSelector;
