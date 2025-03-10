
import React, { useState } from 'react';
import { Package, Navigation, Scale, Ruler, Clock, Truck } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import { ParcelDimensions, Location, DeliveryUrgency } from '@/types';
import { API } from '@/services/api';
import { toast } from 'sonner';

interface BookingFormProps {
  onRatesCalculated: (rates: any[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  onRatesCalculated, 
  isLoading, 
  setIsLoading 
}) => {
  // Form state
  const [dimensions, setDimensions] = useState<ParcelDimensions>({
    weight: 1,
    length: 20,
    width: 15,
    height: 10
  });
  
  const [pickupLocation, setPickupLocation] = useState<Location>({
    address: '',
    city: 'Malmö',
    country: 'Sweden',
    postalCode: '21134'
  });
  
  const [deliveryLocation, setDeliveryLocation] = useState<Location>({
    address: '',
    city: 'Helsinki',
    country: 'Finland',
    postalCode: '00100'
  });
  
  const [urgency, setUrgency] = useState<DeliveryUrgency>(3);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Validate form
      if (dimensions.weight <= 0 || dimensions.length <= 0 || 
          dimensions.width <= 0 || dimensions.height <= 0) {
        toast.error('Please enter valid parcel dimensions');
        return;
      }
      
      if (!pickupLocation.city || !deliveryLocation.city) {
        toast.error('Please enter valid pickup and delivery locations');
        return;
      }
      
      // Call API to calculate rates
      const rates = await API.getRates(
        dimensions,
        pickupLocation,
        deliveryLocation,
        urgency
      );
      
      onRatesCalculated(rates);
      toast.success('Shipping rates calculated successfully');
    } catch (error) {
      console.error('Error calculating rates:', error);
      toast.error('Failed to calculate shipping rates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden animate-fade-in">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Package className="text-primary h-6 w-6" />
          <span>Parcel Information</span>
        </h2>
        <p className="text-muted-foreground">Enter your shipment details to get the best rates</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dimensions Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Scale className="text-primary h-5 w-5" />
            <h3>Parcel Dimensions</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Weight (kg)
              </label>
              <input
                type="number"
                min="0.1"
                max="50"
                step="0.1"
                value={dimensions.weight}
                onChange={(e) => setDimensions({ ...dimensions, weight: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                required
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Length (cm)
                </label>
                <input
                  type="number"
                  min="1"
                  value={dimensions.length}
                  onChange={(e) => setDimensions({ ...dimensions, length: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Width (cm)
                </label>
                <input
                  type="number"
                  min="1"
                  value={dimensions.width}
                  onChange={(e) => setDimensions({ ...dimensions, width: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="1"
                  value={dimensions.height}
                  onChange={(e) => setDimensions({ ...dimensions, height: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Locations Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Navigation className="text-primary h-5 w-5" />
            <h3>Pickup & Delivery</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Pickup Location
              </label>
              <input
                type="text"
                placeholder="City, Country"
                value={`${pickupLocation.city}, ${pickupLocation.country}`}
                onChange={(e) => {
                  const [city, country] = e.target.value.split(',').map(part => part.trim());
                  setPickupLocation({
                    ...pickupLocation,
                    city: city || '',
                    country: country || pickupLocation.country
                  });
                }}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Delivery Location
              </label>
              <input
                type="text"
                placeholder="City, Country"
                value={`${deliveryLocation.city}, ${deliveryLocation.country}`}
                onChange={(e) => {
                  const [city, country] = e.target.value.split(',').map(part => part.trim());
                  setDeliveryLocation({
                    ...deliveryLocation,
                    city: city || '',
                    country: country || deliveryLocation.country
                  });
                }}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Urgency Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Clock className="text-primary h-5 w-5" />
            <h3>Delivery Time</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <label className="relative flex cursor-pointer flex-col rounded-md border border-input bg-background p-4 hover:bg-secondary/50 focus:outline-none">
              <span className="flex items-center justify-center text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Express
              </span>
              <span className="flex items-center justify-center text-lg font-bold">1 Day</span>
              <input
                type="radio"
                name="urgency"
                value="1"
                checked={urgency === 1}
                onChange={() => setUrgency(1)}
                className="absolute h-0 w-0 opacity-0"
              />
              {urgency === 1 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
              )}
            </label>
            
            <label className="relative flex cursor-pointer flex-col rounded-md border border-input bg-background p-4 hover:bg-secondary/50 focus:outline-none">
              <span className="flex items-center justify-center text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Standard
              </span>
              <span className="flex items-center justify-center text-lg font-bold">3 Days</span>
              <input
                type="radio"
                name="urgency"
                value="3"
                checked={urgency === 3}
                onChange={() => setUrgency(3)}
                className="absolute h-0 w-0 opacity-0"
              />
              {urgency === 3 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
              )}
            </label>
            
            <label className="relative flex cursor-pointer flex-col rounded-md border border-input bg-background p-4 hover:bg-secondary/50 focus:outline-none">
              <span className="flex items-center justify-center text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Economy
              </span>
              <span className="flex items-center justify-center text-lg font-bold">5 Days</span>
              <input
                type="radio"
                name="urgency"
                value="5"
                checked={urgency === 5}
                onChange={() => setUrgency(5)}
                className="absolute h-0 w-0 opacity-0"
              />
              {urgency === 5 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
              )}
            </label>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
            icon={<Truck className="h-5 w-5" />}
          >
            Calculate Shipping Rates
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default BookingForm;
