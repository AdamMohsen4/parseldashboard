
import React, { useState } from 'react';
import { Check, AlertCircle, TruckIcon, Clock, EuroIcon, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import { ShippingRate } from '@/types';
import Card from '../common/Card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RateTableProps {
  rates: ShippingRate[];
  onSelectRate: (rate: ShippingRate) => void;
  isLoading: boolean;
}

const RateTable: React.FC<RateTableProps> = ({ rates, onSelectRate, isLoading }) => {
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);
  
  const handleSelectRate = (rate: ShippingRate) => {
    setSelectedRateId(rate.id);
    onSelectRate(rate);
  };
  
  if (isLoading) {
    return (
      <Card className="w-full h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <TruckIcon className="h-10 w-10 mx-auto text-muted" />
          </div>
          <p className="text-muted-foreground">Calculating best shipping rates...</p>
        </div>
      </Card>
    );
  }
  
  if (rates.length === 0) {
    return (
      <Card className="w-full">
        <div className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-12 w-12 text-muted mb-4" />
          <h3 className="text-xl font-medium mb-2">No rates available</h3>
          <p className="text-muted-foreground text-center max-w-md">
            We couldn't find any shipping rates for the provided details. 
            Please adjust your parcel dimensions or locations and try again.
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="w-full animate-fade-in">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-semibold">Shipping Options</h2>
        <p className="text-muted-foreground">Select the best option for your needs</p>
      </div>
      
      <div className="space-y-4">
        {rates.map((rate) => (
          <div
            key={rate.id}
            className={cn(
              "group relative border rounded-lg transition-all overflow-hidden cursor-pointer",
              selectedRateId === rate.id 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50 hover:bg-secondary/50"
            )}
            onClick={() => handleSelectRate(rate)}
          >
            <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Carrier */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-secondary/80 rounded-md flex items-center justify-center">
                  <TruckIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{rate.carrier}</h3>
                  <p className="text-sm text-muted-foreground">Standard Service</p>
                </div>
              </div>
              
              {/* Delivery Time */}
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <span className="font-medium">{rate.eta} {rate.eta === 1 ? 'day' : 'days'}</span>
                  <p className="text-sm text-muted-foreground">Est. delivery time</p>
                </div>
              </div>
              
              {/* Price */}
              <div className="flex items-center space-x-2">
                <EuroIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <span className="font-medium">€{rate.price.toFixed(2)}</span>
                  <p className="text-sm text-muted-foreground">
                    <span className="line-through">€{rate.originalPrice.toFixed(2)}</span> <span className="text-green-600">Save {Math.round((1 - rate.price / (rate.originalPrice + 3)) * 100)}%</span>
                  </p>
                </div>
              </div>
              
              {/* Book Button */}
              <div className="md:text-right">
                <Button 
                  size="sm"
                  variant={selectedRateId === rate.id ? "default" : "outline"}
                  className="w-full md:w-auto"
                >
                  {selectedRateId === rate.id ? (
                    <>
                      <Check className="mr-1 h-4 w-4" />
                      Selected
                    </>
                  ) : (
                    "Select"
                  )}
                </Button>
              </div>
            </div>
            
            {/* Selection indicator */}
            {selectedRateId === rate.id && (
              <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
            )}
          </div>
        ))}
      </div>
      
      {selectedRateId && (
        <div className="mt-6 flex justify-center">
          <Button 
            size="lg" 
            className="px-8"
            icon={<ArrowRight className="h-5 w-5" />}
            iconPosition="right"
            onClick={() => {
              const selectedRate = rates.find(r => r.id === selectedRateId);
              if (selectedRate) {
                toast.success(`Selected ${selectedRate.carrier} shipping for €${selectedRate.price.toFixed(2)}`);
              }
            }}
          >
            Continue to Booking
          </Button>
        </div>
      )}
    </Card>
  );
};

export default RateTable;
