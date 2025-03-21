
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

  const goToPreviousMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - 1);
    setCurrentMonth(date);
  };

  const goToNextMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() + 1);
    setCurrentMonth(date);
  };

  return (
    <Card className="h-full bg-white border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-gray-800">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            onClick={goToNextMonth}
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
      <CardContent className="p-0 pt-2">
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5]"></div>
          </div>
        ) : (
          <div className="flex justify-center items-center transform origin-center">
            <Calendar
              mode="single"
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="mx-auto rounded-md border-0 w-full max-w-full pointer-events-auto flex flex-col items-center p-0"
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
