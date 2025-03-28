
import { useState, useEffect } from 'react';
import { addWeeks, startOfDay } from "date-fns";
import { generateMockPricingData, DateRange } from "@/utils/pricingUtils";

export const usePriceCalendar = () => {
  const [showPriceCalendar, setShowPriceCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [pricingData, setPricingData] = useState([]);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<Date | null>(null);

  const today = startOfDay(new Date());
  const threeWeeksFromNow = addWeeks(today, 3);
  
  const dateRange: DateRange = {
    start: today,
    end: threeWeeksFromNow
  };

  useEffect(() => {
    if (showPriceCalendar) {
      loadPriceCalendarData();
    }
  }, [showPriceCalendar, currentMonth]);

  const loadPriceCalendarData = () => {
    setIsCalendarLoading(true);
    
    setTimeout(() => {
      const data = generateMockPricingData(currentMonth, dateRange);
      setPricingData(data);
      setIsCalendarLoading(false);
    }, 600);
  };

  const handleDeliveryDateSelect = (date: Date) => {
    setSelectedDeliveryDate(date);
  };

  return {
    showPriceCalendar,
    setShowPriceCalendar,
    currentMonth,
    setCurrentMonth,
    pricingData,
    isCalendarLoading,
    selectedDeliveryDate,
    setSelectedDeliveryDate,
    dateRange,
    handleDeliveryDateSelect
  };
};
