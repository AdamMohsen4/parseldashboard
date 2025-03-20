
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import GooglePlacesAutocomplete from "@/components/inputs/GooglePlacesAutocomplete";
import { ArrowRight, Search, X } from "lucide-react";

interface AddressInputsProps {
  onSearch: (pickup: string, delivery: string) => void;
}

const AddressInputs: React.FC<AddressInputsProps> = ({ onSearch }) => {
  const { t } = useTranslation();
  const [pickup, setPickup] = useState<string>('');
  const [delivery, setDelivery] = useState<string>('');

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

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-center text-gray-800">
          {t('shipping.findRates', 'Find Shipping Rates')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="space-y-1 md:col-span-5">
              <label htmlFor="pickup" className="text-sm font-medium text-gray-700">
                {t('shipping.pickup', 'From')}
              </label>
              <div className="relative">
                <GooglePlacesAutocomplete
                  id="pickup"
                  placeholder={t('shipping.enterPickup', 'Enter pickup address')}
                  onPlaceSelect={(address) => setPickup(address)}
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full pr-8"
                />
                {pickup && (
                  <button 
                    type="button" 
                    onClick={handleClearPickup}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="hidden md:flex md:col-span-2 justify-center">
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-1 md:col-span-5">
              <label htmlFor="delivery" className="text-sm font-medium text-gray-700">
                {t('shipping.delivery', 'To')}
              </label>
              <div className="relative">
                <GooglePlacesAutocomplete
                  id="delivery"
                  placeholder={t('shipping.enterDelivery', 'Enter delivery address')}
                  onPlaceSelect={(address) => setDelivery(address)}
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                  className="w-full pr-8"
                />
                {delivery && (
                  <button 
                    type="button" 
                    onClick={handleClearDelivery}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              type="submit" 
              disabled={!pickup || !delivery}
              className="px-8 py-2 bg-primary hover:bg-primary/90 transition-colors"
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
