
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import PriceCalendarView from "@/components/priceCalendar/PriceCalendarView";
import { DateRange } from "@/utils/pricingUtils";

type DeliveryOption = "fast" | "cheap" | null;

interface DeliveryOptionSelectorProps {
  selectedDeliveryOption: DeliveryOption;
  onOptionSelect: (option: DeliveryOption) => void;
  showPriceCalendar: boolean;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  pricingData: any[];
  isCalendarLoading: boolean;
  dateRange: DateRange;
  selectedDeliveryDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const DeliveryOptionSelector: React.FC<DeliveryOptionSelectorProps> = ({
  selectedDeliveryOption,
  onOptionSelect,
  showPriceCalendar,
  currentMonth,
  setCurrentMonth,
  pricingData,
  isCalendarLoading,
  dateRange,
  selectedDeliveryDate,
  onDateSelect
}) => {
  return (
    <div className="mt-8 border rounded-lg shadow-sm">
      <div className="bg-slate-700 text-white p-3 font-semibold">
        Select Delivery Option
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={() => onOptionSelect('fast')}
          type="button"
          className={`h-20 text-left p-4 rounded-lg border transition-all duration-200 
            ${selectedDeliveryOption === 'fast' ? ' text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
        >
          <div className="flex flex-col items-start space-y-1">
            <span className="font-medium text-base">Fast Delivery</span>
            <span className="text-sm text-black-600">Arrives in 2-4 business days</span>
          </div>
        </Button>

        <Button
          onClick={() => onOptionSelect('cheap')}
          type="button"
          className={`h-20 text-left p-4 rounded-lg border transition-all duration-200 
            ${selectedDeliveryOption === 'cheap' ? 'text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
        >
          <div className="flex flex-col items-start space-y-1">
            <span className="font-medium text-base">Cheap Delivery</span>
            <span className="text-sm text-black-600">Save money by selecting a specific date</span>
          </div>
        </Button>
      </div>
      
      {showPriceCalendar && (
        <div className="px-6 pb-6">
          <div className="mt-4 mb-2 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
            <h3 className="font-medium">Select delivery date to get the best price</h3>
          </div>
          <div className="border rounded-lg shadow-sm bg-white">
            <PriceCalendarView
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              pricingData={pricingData}
              isLoading={isCalendarLoading}
              dateRange={dateRange}
              onDateSelect={onDateSelect}
              selectedDate={selectedDeliveryDate}
            />
          </div>
          {selectedDeliveryDate && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800">
                <span className="font-medium">Delivery date selected: </span> 
                {selectedDeliveryDate.toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryOptionSelector;
