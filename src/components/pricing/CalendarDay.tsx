
import React from "react";
import { isSameMonth, isWithinInterval } from "date-fns";
import { PricingDay, DateRange, getPricingForDay, formatPrice } from "@/utils/pricingUtils";

interface CalendarDayProps {
  date: Date;
  currentMonth: Date;
  pricingData: PricingDay[];
  dateRange: DateRange;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ 
  date, 
  currentMonth, 
  pricingData,
  dateRange 
}) => {
  const pricing = getPricingForDay(pricingData, date);
  const isInDateRange = isWithinInterval(date, dateRange);
  
  // Styles based on pricing data
  let dayClasses = "h-9 w-9 p-0 font-normal flex flex-col items-center justify-center";
  
  // For days in current month
  if (isSameMonth(date, currentMonth)) {
    if (isInDateRange && pricing) {
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
      {isInDateRange && pricing && pricing.basePrice > 0 && (
        <span className="text-[8px] mt-0.5 font-medium">
          {formatPrice(pricing.basePrice)}
        </span>
      )}
    </div>
  );
};

export default CalendarDay;
