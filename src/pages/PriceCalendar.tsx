
import React, { useState, useCallback, useEffect } from "react";
import { addWeeks } from "date-fns";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/layout/NavBar";
import { generateMockPricingData, PricingDay, DateRange } from "@/utils/pricingUtils";
import PriceCalendarView from "@/components/pricing/PriceCalendarView";
import PriceLegend from "@/components/pricing/PriceLegend";
import AddressInputs from "@/components/pricing/AddressInputs";
import { toast } from "@/components/ui/use-toast";

const PriceCalendar = () => {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [pricingData, setPricingData] = useState<PricingDay[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [pickup, setPickup] = useState<string>('');
  const [delivery, setDelivery] = useState<string>('');

  // Calculate the date range for the next two weeks once
  const dateRangeRef = React.useRef<DateRange>({
    start: new Date(),
    end: addWeeks(new Date(), 2)
  });

  // Memoized function to fetch pricing data
  const fetchPricingData = useCallback((month: Date) => {
    setIsLoading(true);
    
    // Use setTimeout to simulate API call and prevent UI freezing
    setTimeout(() => {
      try {
        const data = generateMockPricingData(month, dateRangeRef.current);
        setPricingData(data);
      } catch (error) {
        console.error("Error generating pricing data:", error);
        toast({
          title: t('common.error', 'Error'),
          description: t('shipping.errorLoadingRates', 'Error loading shipping rates. Please try again.'),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [t]);

  // Handle address search with memoization to prevent unnecessary re-renders
  const handleSearch = useCallback((pickupAddress: string, deliveryAddress: string) => {
    if (!pickupAddress || !deliveryAddress) return;
    
    setPickup(pickupAddress);
    setDelivery(deliveryAddress);
    setShowCalendar(true);
    
    // Show toast notification
    toast({
      title: t('shipping.searchingRates', 'Searching for rates'),
      description: t('shipping.betweenLocations', 'Between {{pickup}} and {{delivery}}', 
        { pickup: pickupAddress, delivery: deliveryAddress }),
    });

    // Reset dateRange to ensure we show the next two weeks from today
    dateRangeRef.current = {
      start: new Date(),
      end: addWeeks(new Date(), 2)
    };
    
    // Fetch pricing data
    fetchPricingData(currentMonth);
  }, [currentMonth, fetchPricingData, t]);

  // Fetch pricing data when month changes (only if locations are selected)
  useEffect(() => {
    if (showCalendar && pickup && delivery) {
      fetchPricingData(currentMonth);
    }
  }, [currentMonth, showCalendar, pickup, delivery, fetchPricingData]);

  // Create journey title from pickup and delivery locations
  const getJourneyTitle = useCallback(() => {
    if (pickup && delivery) {
      return `${t('shipping.shipFrom', 'Ship from')} ${pickup} ${t('shipping.to', 'to')} ${delivery}`;
    }
    return t('shipping.findRates', 'Find Shipping Rates');
  }, [pickup, delivery, t]);

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
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
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-9 order-2 lg:order-1">
                <PriceCalendarView
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  pricingData={pricingData}
                  isLoading={isLoading}
                  dateRange={dateRangeRef.current}
                />
              </div>
              
              <div className="lg:col-span-3 order-1 lg:order-2">
                <PriceLegend 
                  pricingData={pricingData} 
                  pickup={pickup}
                  delivery={delivery}
                />
              </div>
            </div>
            
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
