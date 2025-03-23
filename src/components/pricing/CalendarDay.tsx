
import React from "react";
import { PricingDay, DateRange } from "@/utils/pricingUtils";
import { isSameMonth, isWithinInterval } from "date-fns";

interface CalendarDayProps {
  date: Date;
  currentMonth: Date;
  pricingData: PricingDay[];
  dateRange: DateRange;
  isSelected?: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  currentMonth,
  pricingData,
  dateRange,
  isSelected = false
}) => {
  // Check if the date is in the current month
  const isCurrentMonth = isSameMonth(date, currentMonth);
  
  // Check if the date is within the valid date range
  const isInRange = isWithinInterval(date, {
    start: dateRange.start,
    end: dateRange.end
  });
  
  // Find pricing data for this date
  const dayPricing = pricingData.find(d => 
    d.date.getDate() === date.getDate() && 
    d.date.getMonth() === date.getMonth() && 
    d.date.getFullYear() === date.getFullYear()
  );
  
  // Determine the color based on the load factor
  let bgColor = "bg-white";
  let textColor = isCurrentMonth ? "text-gray-700" : "text-gray-400";
  let priceIndicator = null;
  
  if (isInRange && dayPricing) {
    if (dayPricing.loadFactor === 'low') {
      bgColor = "bg-green-100";
      priceIndicator = <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>;
    } else if (dayPricing.loadFactor === 'medium') {
      bgColor = "bg-yellow-50";
      priceIndicator = <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-500 rounded-full"></div>;
    } else if (dayPricing.loadFactor === 'high') {
      bgColor = "bg-red-50";
      priceIndicator = <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>;
    }
  }
  
  // If selected, change colors
  if (isSelected) {
    bgColor = "bg-primary";
    textColor = "text-white";
  }
  
  return (
    <div className={`relative flex items-center justify-center w-full h-full rounded-md ${bgColor}`}>
      <span className={`text-sm font-medium ${textColor}`}>{date.getDate()}</span>
      {priceIndicator}
    </div>
  );
};

export default CalendarDay;
