
import React, { useState, useEffect } from "react";
import { addWeeks } from "date-fns";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/layout/NavBar";
import { generateMockPricingData, PricingDay, DateRange } from "@/utils/pricingUtils";
import PriceCalendarView from "@/components/pricing/PriceCalendarView";
import PriceLegend from "@/components/pricing/PriceLegend";

// This is the price calendar component that will be used to display days with higher or lower shipping fees based on the amount of orders
const PriceCalendar = () => {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [pricingData, setPricingData] = useState<PricingDay[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  // Calculate the date range for the next two weeks
  const today = new Date();
  const twoWeeksFromNow = addWeeks(today, 2);
  
  const nextTwoWeeksRange: DateRange = {
    start: today,
    end: twoWeeksFromNow
  };

  // Fetch or generate pricing data when the current month changes
  useEffect(() => {
    setIsLoading(true);
    
    // In a real application, I would fetch this data from Supabase
    // For now, we'll use mock data
    setTimeout(() => {
      const data = generateMockPricingData(currentMonth, nextTwoWeeksRange);
      setPricingData(data);
      setIsLoading(false);
    }, 800);
  }, [currentMonth]);

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <NavBar />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <PriceCalendarView
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            pricingData={pricingData}
            isLoading={isLoading}
            dateRange={nextTwoWeeksRange}
          />
        </div>
        
        <div className="lg:col-span-3">
          <PriceLegend pricingData={pricingData} />
        </div>
      </div>
    </div>
  );
};

export default PriceCalendar;
