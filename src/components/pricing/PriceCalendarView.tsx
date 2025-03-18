
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingDay, DateRange } from "@/utils/pricingUtils";
import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CalendarDay from "./CalendarDay";
import { format } from "date-fns";

interface PriceCalendarViewProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  pricingData: PricingDay[];
  isLoading: boolean;
  dateRange: DateRange;
}

const PriceCalendarView: React.FC<PriceCalendarViewProps> = ({
  currentMonth,
  setCurrentMonth,
  pricingData,
  isLoading,
  dateRange
}) => {
  const { t } = useTranslation();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentMonth(newDate);
  };

  return (
    <Card className="h-full bg-white border border-gray-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigateMonth('prev')}
            className="h-8 w-8 rounded-full border-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigateMonth('next')}
            className="h-8 w-8 rounded-full border-gray-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{t('shipping.priceCalendarInfo', 'Shipping rates vary based on demand. Green indicates lower prices, yellow for medium, and red for premium rates.')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="scale-110 transform origin-center pb-6">
            <Calendar
              mode="single"
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border-0 w-full pointer-events-auto"
              showOutsideDays
              components={{
                Day: ({ date, ...props }) => (
                  <div {...props}>
                    {date && (
                      <CalendarDay 
                        date={date}
                        currentMonth={currentMonth}
                        pricingData={pricingData}
                        dateRange={dateRange}
                      />
                    )}
                  </div>
                )
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceCalendarView;
