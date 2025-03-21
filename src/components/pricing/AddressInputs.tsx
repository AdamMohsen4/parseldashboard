
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import GooglePlacesAutocomplete from "@/components/inputs/GooglePlacesAutocomplete";
import { ArrowRight, Search, X, Navigation, Flag, MapPin } from "lucide-react";
import { getCountryFlag } from '@/lib/utils';
import { Input } from "@/components/ui/input";

interface AddressInputsProps {
  onSearch: (pickup: string, delivery: string) => void;
}

const AddressInputs: React.FC<AddressInputsProps> = ({ onSearch }) => {
  const { t } = useTranslation();
  const [pickup, setPickup] = useState<string>('');
  const [delivery, setDelivery] = useState<string>('');
  const [pickupCountry, setPickupCountry] = useState<string>('SE');
  const [deliveryCountry, setDeliveryCountry] = useState<string>('FI');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pickup && delivery) {
      onSearch(pickup, delivery);
    }
  };

  const handleClearPickup = () => {
    setPickup('');
  };

  const handleClearDelivery = () => {
    setDelivery('');
  };

  const handlePickupSelect = (address: string) => {
    setPickup(address);
    // Extract country code from address (this is simplified)
    if (address.includes("Sweden") || address.includes("Sverige")) {
      setPickupCountry('SE');
    } else if (address.includes("Finland")) {
      setPickupCountry('FI');
    } else if (address.includes("Norway") || address.includes("Norge")) {
      setPickupCountry('NO');
    } else if (address.includes("Denmark") || address.includes("Danmark")) {
      setPickupCountry('DK');
    }
  };

  const handleDeliverySelect = (address: string) => {
    setDelivery(address);
    // Extract country code from address (this is simplified)
    if (address.includes("Sweden") || address.includes("Sverige")) {
      setDeliveryCountry('SE');
    } else if (address.includes("Finland")) {
      setDeliveryCountry('FI');
    } else if (address.includes("Norway") || address.includes("Norge")) {
      setDeliveryCountry('NO');
    } else if (address.includes("Denmark") || address.includes("Danmark")) {
      setDeliveryCountry('DK');
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-xl text-center text-gray-800 flex items-center justify-center gap-2">
          <Navigation className="h-5 w-5 text-[#9b87f5]" />
          {t('shipping.findRates', 'Find Shipping Rates')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="space-y-1 md:col-span-5">
              <label htmlFor="pickup" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#9b87f5]" />
                {t('shipping.pickup', 'From')}
              </label>
              <div className="relative">
                <Input
                  id="pickup"
                  placeholder={t('shipping.enterPickup', 'Enter pickup address')}
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="pr-16 border-gray-300 focus-visible:ring-[#9b87f5]"
                  suffix={
                    pickup ? (
                      <button 
                        type="button" 
                        onClick={handleClearPickup}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null
                  }
                  icon={
                    <div className="flex items-center">
                      <span className="mr-1">{getCountryFlag(pickupCountry)}</span>
                    </div>
                  }
                />
                <GooglePlacesAutocomplete
                  id="pickup-autocomplete"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  onPlaceSelect={handlePickupSelect}
                  className="hidden" // Hide the original input but keep its functionality
                />
              </div>
            </div>

            <div className="hidden md:flex md:col-span-2 justify-center">
              <div className="w-10 h-10 rounded-full bg-[#F1F0FB] flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-[#9b87f5]" />
              </div>
            </div>

            <div className="space-y-1 md:col-span-5">
              <label htmlFor="delivery" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#9b87f5]" />
                {t('shipping.delivery', 'To')}
              </label>
              <div className="relative">
                <Input
                  id="delivery"
                  placeholder={t('shipping.enterDelivery', 'Enter delivery address')}
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                  className="pr-16 border-gray-300 focus-visible:ring-[#9b87f5]"
                  suffix={
                    delivery ? (
                      <button 
                        type="button" 
                        onClick={handleClearDelivery}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null
                  }
                  icon={
                    <div className="flex items-center">
                      <span className="mr-1">{getCountryFlag(deliveryCountry)}</span>
                    </div>
                  }
                />
                <GooglePlacesAutocomplete
                  id="delivery-autocomplete"
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                  onPlaceSelect={handleDeliverySelect}
                  className="hidden" // Hide the original input but keep its functionality
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              type="submit" 
              disabled={!pickup || !delivery}
              className="px-8 py-2 bg-[#9b87f5] hover:bg-[#8778d9] transition-colors"
            >
              <Search className="mr-2 h-4 w-4" />
              {t('shipping.search', 'Search')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddressInputs;
