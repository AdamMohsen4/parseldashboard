
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import GooglePlacesAutocomplete from "@/components/inputs/GooglePlacesAutocomplete";
import { ArrowRight, Search } from "lucide-react";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('shipping.findRates', 'Find Shipping Rates')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="pickup" className="text-sm font-medium">
                {t('shipping.pickup', 'Pickup Location')}
              </label>
              <GooglePlacesAutocomplete
                id="pickup"
                placeholder={t('shipping.enterPickup', 'Enter pickup address')}
                onPlaceSelect={(address) => setPickup(address)}
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="delivery" className="text-sm font-medium">
                {t('shipping.delivery', 'Delivery Location')}
              </label>
              <GooglePlacesAutocomplete
                id="delivery"
                placeholder={t('shipping.enterDelivery', 'Enter delivery address')}
                onPlaceSelect={(address) => setDelivery(address)}
                value={delivery}
                onChange={(e) => setDelivery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={!pickup || !delivery}>
              <Search className="mr-2 h-4 w-4" />
              {t('shipping.findRates', 'Find Rates')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddressInputs;
