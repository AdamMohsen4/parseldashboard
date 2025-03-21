
import React, { useState, useEffect, useCallback } from "react";
import { addWeeks } from "date-fns";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/layout/NavBar";
import { generateMockPricingData, PricingDay, DateRange } from "@/utils/pricingUtils";
import PriceCalendarView from "@/components/pricing/PriceCalendarView";
import PriceLegend from "@/components/pricing/PriceLegend";
import AddressInputs from "@/components/pricing/AddressInputs";
import { toast } from "@/components/ui/use-toast";
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import { Package, Navigation, MapPin, CalendarDays } from "lucide-react";

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
  const handleSearch = useCallback((pickupAddress: string, deliveryAddress: string) => {
    setPickup(pickupAddress);
    setDelivery(deliveryAddress);
    setShowCalendar(true);
    setIsLoading(true);
    
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
  }, [currentMonth, nextTwoWeeksRange, t]);

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
  }, [currentMonth, showCalendar, nextTwoWeeksRange]);

  // Create journey title from pickup and delivery locations
  const getJourneyTitle = () => {
    if (pickup && delivery) {
      return `${t('shipping.shipFrom', 'Ship from')} ${pickup} ${t('shipping.to', 'to')} ${delivery}`;
    }
    return t('shipping.findRates', 'Find Shipping Rates');
  };

  return (
    <div className="min-h-screen bg-[#F6F6F7]">
      <NavBar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Progress Steps */}
          {showCalendar && (
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between max-w-3xl mx-auto">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#9b87f5] text-white flex items-center justify-center mb-1">
                    <span className="text-sm font-semibold">1</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700">{t('shipping.details', 'Details')}</span>
                </div>
                <div className="flex-1 h-1 bg-gray-200 mx-2">
                  <div className={`h-full bg-[#9b87f5] ${showCalendar ? 'w-full' : 'w-0'} transition-all duration-500`}></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full ${showCalendar ? 'bg-[#9b87f5] text-white' : 'bg-gray-200 text-gray-500'} flex items-center justify-center mb-1`}>
                    <span className="text-sm font-semibold">2</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700">{t('shipping.selectDate', 'Select Date')}</span>
                </div>
                <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mb-1">
                    <span className="text-sm font-semibold">3</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700">{t('shipping.booking', 'Booking')}</span>
                </div>
              </div>
            </div>
          )}
          
          {showCalendar && (
            <div className="text-center mb-4 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <h1 className="text-2xl font-semibold text-gray-800 flex items-center justify-center gap-2">
                <MapPin className="h-5 w-5 text-[#9b87f5]" />
                {getJourneyTitle()}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {t('shipping.selectDate', 'Select your preferred shipping date')}
              </p>
            </div>
          )}
          
          {/* Address Input Section */}
          <AddressInputs onSearch={handleSearch} />
          
          {/* Calendar Section - Only show after search */}
          {showCalendar && (
            <div className="space-y-6">
              <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[600px] rounded-lg border"
              >
                <ResizablePanel defaultSize={75} minSize={50} className="bg-white">
                  <div className="h-full p-2">
                    <PriceCalendarView
                      currentMonth={currentMonth}
                      setCurrentMonth={setCurrentMonth}
                      pricingData={pricingData}
                      isLoading={isLoading}
                      dateRange={nextTwoWeeksRange}
                    />
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={25} minSize={20} className="bg-white">
                  <div className="h-full p-4">
                    <PriceLegend 
                      pricingData={pricingData} 
                      pickup={pickup}
                      delivery={delivery}
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
              
              <div className="mt-6 text-center text-sm text-gray-500 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <CalendarDays className="h-4 w-4 inline-block mr-1 text-gray-500" />
                {t('shipping.pricesNote', '* Prices are estimated based on current demand and may change')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceCalendar;
