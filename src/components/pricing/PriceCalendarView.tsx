
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
}

const PriceCalendarView: React.FC<PriceCalendarViewProps> = ({
  currentMonth,
  setCurrentMonth,
  pricingData,
  isLoading,
  dateRange
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t('shipping.priceCalendar', 'Price Calendar')}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('shipping.priceCalendarInfo', 'Prices are estimated based on predicted order volume. Only the next 2 weeks show prices.')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Calendar
            mode="single"
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md border w-full"
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
        )}
      </CardContent>
    </Card>
  );
};

export default PriceCalendarView;
