import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Info } from "lucide-react";
import { CalendarPrice} from "@/components/ui/calendarPrice";
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

interface PriceCalendarViewProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  pricingData: PricingDay[];
  isLoading: boolean;
  dateRange: DateRange;
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date | null;
}

const PriceCalendarView: React.FC<PriceCalendarViewProps> = ({
  currentMonth,
  setCurrentMonth,
  pricingData,
  isLoading,
  dateRange,
  onDateSelect,
  selectedDate
}) => {
  const { t } = useTranslation();

  return (
    <Card className="h-full bg-white border border-gray-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          <h4 className="text-sm font-medium"></h4>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{t('shipping.priceCalendarInfo', 'Shipping rates vary based on demand.')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex justify-center items-center transform origin-center pb-8">
            <CalendarPrice 
              mode="single"
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              selected={selectedDate || undefined}
              onSelect={(date) => date && onDateSelect?.(date)}
              className="mx-auto rounded-md border-0 w-full max-w-[90%] pointer-events-auto flex flex-col items-center"
              showOutsideDays
              components={{
                Day: ({ date, ...props }) => (
                  <div>
                    {date && (
                      <CalendarDay 
                        date={date}
                        currentMonth={currentMonth}
                        pricingData={pricingData}
                        dateRange={dateRange}
                        onSelect={onDateSelect}
                        isSelected={selectedDate && date ? selectedDate.getTime() === date.getTime() : false}
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
