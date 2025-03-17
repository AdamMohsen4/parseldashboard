import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameMonth, isSameDay, isWithinInterval, addWeeks } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/layout/NavBar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PricingDay {
  date: Date;
  loadFactor: 'low' | 'medium' | 'high';
  basePrice: number;
  estimatedOrders: number;
}

// This is the price calendar component that will be used to display days with higher or lower shipping fees based on the amount of orders
const PriceCalendar = () => {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [pricingData, setPricingData] = useState<PricingDay[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Calculate the date range for the next two weeks
  const today = new Date();
  const twoWeeksFromNow = addWeeks(today, 2);
  
  const nextTwoWeeksRange = {
    start: today,
    end: twoWeeksFromNow
  };

  // Function to generate mock pricing data for the calendar
  const generateMockPricingData = () => {
    // Get all days in the current month
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Generate pricing data for each day
    const data: PricingDay[] = daysInMonth.map(day => {
      // Only generate detailed pricing for the next two weeks
      if (isWithinInterval(day, nextTwoWeeksRange)) {
        // Randomly generate load factor, more likely to be high on weekends
        const dayOfWeek = day.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        let loadProbabilities = isWeekend 
          ? { low: 0.1, medium: 0.3, high: 0.6 }  // Weekends more likely to be high
          : { low: 0.5, medium: 0.3, high: 0.2 }; // Weekdays more likely to be low
        
        const randomVal = Math.random();
        let loadFactor: 'low' | 'medium' | 'high';
        
        if (randomVal < loadProbabilities.low) {
          loadFactor = 'low';
        } else if (randomVal < loadProbabilities.low + loadProbabilities.medium) {
          loadFactor = 'medium';
        } else {
          loadFactor = 'high';
        }
        
        // Base price depends on load factor
        const basePrices = {
          low: 9.99,
          medium: 14.99,
          high: 19.99
        };
        
        // Estimated orders
        const orderRanges = {
          low: { min: 10, max: 50 },
          medium: { min: 51, max: 150 },
          high: { min: 151, max: 300 }
        };
        
        const estimatedOrders = Math.floor(
          Math.random() * (orderRanges[loadFactor].max - orderRanges[loadFactor].min + 1) 
          + orderRanges[loadFactor].min
        );
        
        return {
          date: day,
          loadFactor,
          basePrice: basePrices[loadFactor],
          estimatedOrders
        };
      } else {
        // For days outside the two-week window, just provide basic data
        return {
          date: day,
          loadFactor: 'medium',
          basePrice: 0,
          estimatedOrders: 0
        };
      }
    });

    return data;
  };

  // Fetch or generate pricing data when the current month changes
  useEffect(() => {
    setIsLoading(true);
    
    // In a real application, I would fetch this data from Supabase
    // For now, we'll use mock data
    setTimeout(() => {
      const data = generateMockPricingData();
      setPricingData(data);
      setIsLoading(false);
    }, 800);
  }, [currentMonth]);

  // Get pricing data for a specific day
  const getPricingForDay = (day: Date): PricingDay | undefined => {
    return pricingData.find(pricingDay => 
      isSameDay(pricingDay.date, day)
    );
  };

  // Format price with currency
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(price);
  };

  // Custom day rendering for the calendar
  const renderDay = (date: Date) => {
    const pricing = getPricingForDay(date);
    const isInNextTwoWeeks = isWithinInterval(date, nextTwoWeeksRange);
    
    // Styles based on pricing data
    let dayClasses = "h-9 w-9 p-0 font-normal flex flex-col items-center justify-center";
    
    // For days in current month
    if (isSameMonth(date, currentMonth)) {
      if (isInNextTwoWeeks && pricing) {
        // Add color based on load factor
        const colorClasses = {
          low: "bg-green-100 hover:bg-green-200 text-green-800",
          medium: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800",
          high: "bg-red-100 hover:bg-red-200 text-red-800"
        };
        
        dayClasses += ` ${colorClasses[pricing.loadFactor]}`;
      } else {
        dayClasses += " text-gray-400";
      }
    } else {
      // For days outside current month
      dayClasses += " text-gray-300";
    }
    
    return (
      <div className={dayClasses}>
        {date.getDate()}
        {isInNextTwoWeeks && pricing && pricing.basePrice > 0 && (
          <span className="text-[8px] mt-0.5 font-medium">
            {formatPrice(pricing.basePrice)}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <NavBar />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('shipping.priceCalendar', 'Price Calendar')}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('shipping.priceCalendarInfo', 'Prices are estimated based on predicted order volume. Only the next 2 weeks show prices.')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Calendar
                  mode="single"
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="rounded-md border w-full"
                  showOutsideDays
                  components={{
                    Day: ({ date, ...props }) => (
                      <div {...props}>
                        {date && renderDay(date)}
                      </div>
                    )
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('shipping.legend', 'Legend')}</CardTitle>
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
              
              <div className="mt-6 pt-4 border-t">
                <h3 className="font-medium mb-2">{t('shipping.todaysRates', "Today's Shipping Rates")}</h3>
                {pricingData.filter(day => isSameDay(day.date, new Date())).map((today, idx) => (
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
                
                <Button className="w-full mt-4" onClick={() => toast({
                  title: t('shipping.bookNow', 'Book Now'),
                  description: t('shipping.bestPriceToday', 'Lock in today\'s rate for your shipment!'),
                })}>
                  {t('shipping.bookShipment', 'Book Shipment')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PriceCalendar;
