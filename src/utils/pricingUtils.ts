
import { startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, isSameDay } from "date-fns";

export interface PricingDay {
  date: Date;
  loadFactor: 'low' | 'medium' | 'high';
  basePrice: number;
  estimatedOrders: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// Function to generate mock pricing data for the calendar
export const generateMockPricingData = (currentMonth: Date, dateRange: DateRange): PricingDay[] => {
  // Get all days in the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Generate pricing data for each day
  const data: PricingDay[] = daysInMonth.map(day => {
    // Only generate detailed pricing for the specified date range
    if (isWithinInterval(day, dateRange)) {
      // Randomly generate load factor, more likely to be high on weekends. 
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
        low: 8.99,
        medium: 10.99,
        high: 13.99
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
      // For days outside the date range window, just provide basic data
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

// Format price with currency
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  }).format(price);
};

// Get pricing data for a specific day
export const getPricingForDay = (pricingData: PricingDay[], day: Date): PricingDay | undefined => {
  return pricingData.find(pricingDay => 
    isSameDay(pricingDay.date, day)
  );
};
