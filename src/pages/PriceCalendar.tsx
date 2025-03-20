
import React, { useState, useEffect } from "react";
import { addWeeks } from "date-fns";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/layout/NavBar";
import { generateMockPricingData, PricingDay, DateRange } from "@/utils/pricingUtils";
import PriceCalendarView from "@/components/pricing/PriceCalendarView";
import PriceLegend from "@/components/pricing/PriceLegend";
import AddressInputs from "@/components/pricing/AddressInputs";
import { toast } from "@/components/ui/use-toast";
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from "@/components/ui/resizable";

const PriceCalendar = () => {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [pricingData, setPricingData] = useState<PricingDay[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [pickup, setPickup] = useState<string>('');
  const [delivery, setDelivery] = useState<string>('');

  // Calculate the date range for the next two weeks
  const today = new Date();
  const twoWeeksFromNow = addWeeks(today, 2);
  
  const nextTwoWeeksRange: DateRange = {
    start: today,
    end: twoWeeksFromNow
  };

  // Handle address search
  const handleSearch = (pickupAddress: string, deliveryAddress: string) => {
    setPickup(pickupAddress);
    setDelivery(deliveryAddress);
    setShowCalendar(true);
    setIsLoading(true);
    
    // Show toast notification
    toast({
      title: t('shipping.searchingRates', 'Searching for rates'),
      description: t('shipping.betweenLocations', 'Between {{pickup}} and {{delivery}}', 
        { pickup: pickupAddress, delivery: deliveryAddress }),
    });

    // Generate pricing data based on the locations
    setTimeout(() => {
      const data = generateMockPricingData(currentMonth, nextTwoWeeksRange);
      setPricingData(data);
      setIsLoading(false);
    }, 800);
  };

  // Fetch or generate new pricing data when month changes (only if locations are selected)
  useEffect(() => {
    if (showCalendar) {
      setIsLoading(true);
      setTimeout(() => {
        const data = generateMockPricingData(currentMonth, nextTwoWeeksRange);
        setPricingData(data);
        setIsLoading(false);
      }, 800);
    }
  }, [currentMonth, showCalendar]);

  // Create journey title from pickup and delivery locations
  const getJourneyTitle = () => {
    if (pickup && delivery) {
      return `${t('shipping.shipFrom', 'Ship from')} ${pickup} ${t('shipping.to', 'to')} ${delivery}`;
    }
    return t('shipping.findRates', 'Find Shipping Rates');
  };

  return (
    <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <NavBar />
      
      <div className="mt-8 space-y-6">
        {showCalendar && (
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">{getJourneyTitle()}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {t('shipping.selectDate', 'Select your preferred shipping date')}
            </p>
          </div>
        )}
        
        {/* Address Input Section */}
        <AddressInputs onSearch={handleSearch} />
        
        {/* Calendar Section - Only show after search */}
        {showCalendar && (
          <div className="h-[calc(100vh-300px)] min-h-[500px]">
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-full bg-background/95 rounded-lg border"
            >
              <ResizablePanel defaultSize={75} minSize={40} className="p-3">
                <PriceCalendarView
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  pricingData={pricingData}
                  isLoading={isLoading}
                  dateRange={nextTwoWeeksRange}
                />
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={25} minSize={15} maxSize={40} className="p-3">
                <PriceLegend 
                  pricingData={pricingData} 
                  pickup={pickup}
                  delivery={delivery}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              {t('shipping.pricesNote', '* Prices are estimated based on current demand and may change')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceCalendar;
