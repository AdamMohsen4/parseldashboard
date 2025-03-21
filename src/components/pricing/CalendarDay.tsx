
import React from 'react';
import { PricingDay, DateRange } from '@/utils/pricingUtils';
import { isSameDay, isWithinInterval, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';

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
  const navigate = useNavigate();
  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
  
  // Check if date is within the valid range
  const isInRange = isWithinInterval(date, {
    start: dateRange.start,
    end: dateRange.end
  });
  
  // Find pricing for this date
  const pricing = pricingData.find(day => isSameDay(new Date(day.date), date));
  const hasPrice = Boolean(pricing);
  
  // Determine price level color
  const getPriceColor = () => {
    if (!pricing) return '';
    
    if (pricing.priceLevel === 'low') {
      return 'bg-green-500 text-white hover:bg-green-600';
    }
    if (pricing.priceLevel === 'medium') {
      return 'bg-yellow-500 text-gray-900 hover:bg-yellow-600';
    }
    if (pricing.priceLevel === 'high') {
      return 'bg-red-500 text-white hover:bg-red-600';
    }
    
    return '';
  };
  
  const handleSelectDate = () => {
    if (pricing && isInRange) {
      navigate('/shipment', { 
        state: { 
          selectedDate: format(date, 'yyyy-MM-dd'),
          price: pricing.price
        } 
      });
    }
  };
  
  return (
    <div 
      className={`w-full h-full min-h-[60px] p-0 flex flex-col justify-start items-center rounded relative ${
        !isCurrentMonth ? 'opacity-40' : ''
      }`}
    >
      <div className="text-sm font-medium w-7 h-7 flex items-center justify-center mb-1">
        {format(date, 'd')}
      </div>
      
      {isInRange && hasPrice ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSelectDate}
          className={`text-xs font-medium py-1 px-2 rounded w-full max-w-[90%] ${getPriceColor()}`}
        >
          {formatCurrency(pricing.price)}
        </Button>
      ) : (
        <div className="h-6"></div>
      )}
    </div>
  );
};

export default CalendarDay;
