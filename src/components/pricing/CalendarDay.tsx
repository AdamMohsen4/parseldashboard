
import React from "react";
import { isSameMonth, isWithinInterval, format } from "date-fns";
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
  
  // Base classes
  let dayClasses = "h-10 w-full p-0 font-normal flex flex-col items-center justify-center rounded hover:bg-gray-50 relative";
  
  // For days in current month
  if (isSameMonth(date, currentMonth)) {
    if (isInDateRange && pricing) {
      // Add color based on load factor
      const colorClasses = {
        low: "bg-green-50 hover:bg-green-100 border-green-200 text-green-800",
        medium: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-800",
        high: "bg-red-50 hover:bg-red-100 border-red-200 text-red-800"
      };
      
      if (pricing.basePrice > 0) {
        dayClasses += ` ${colorClasses[pricing.loadFactor]} border-b-2`;
      } else {
        dayClasses += " text-gray-400";
      }
    } else {
      dayClasses += " text-gray-400";
    }
  } else {
    // For days outside current month
    dayClasses += " text-gray-300 opacity-50";
  }
  
  // Adjust label size if we have a date
  const dateLabelClass = pricing && pricing.basePrice > 0 ? "text-xs font-normal" : "text-sm";
  
  return (
    <div className={dayClasses}>
      <span className={dateLabelClass}>{format(date, 'd')}</span>
      {isInDateRange && pricing && pricing.basePrice > 0 && (
        <span className="text-[11px] font-medium">
          {formatPrice(pricing.basePrice)}
        </span>
      )}
      {isInDateRange && pricing && pricing.basePrice > 0 && pricing.loadFactor === 'low' && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="w-5 h-0.5 border-b border-dashed border-green-500"></div>
        </div>
      )}
    </div>
  );
};

export default CalendarDay;
