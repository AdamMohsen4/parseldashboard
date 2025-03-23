
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getCountryFlag } from "@/lib/utils";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

interface LocationSelectorProps {
  pickupCountry: string;
  setPickupCountry: (country: string) => void;
  pickupPostalCode: string;
  setPickupPostalCode: (code: string) => void;
  deliveryCountry: string;
  setDeliveryCountry: (country: string) => void;
  deliveryPostalCode: string;
  setDeliveryPostalCode: (code: string) => void;
  onSwapLocations: () => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  pickupCountry,
  setPickupCountry,
  pickupPostalCode,
  setPickupPostalCode,
  deliveryCountry,
  setDeliveryCountry,
  deliveryPostalCode,
  setDeliveryPostalCode,
  onSwapLocations
}) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[200px] rounded-lg border mb-8">
      <ResizablePanel defaultSize={50}>
        <div className="p-0">
          <div className="bg-slate-700 text-white p-3 font-semibold">
            Från
          </div>
          
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromCountry">Land</Label>
              <div className="relative">
                <select
                  id="fromCountry"
                  className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background appearance-none cursor-pointer"
                  value={pickupCountry}
                  onChange={(e) => setPickupCountry(e.target.value)}
                >
                  <option value="SE">Sverige</option>
                  <option value="FI">Finland</option>
                  <option value="NO">Norge</option>
                  <option value="DK">Danmark</option>
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  {getCountryFlag(pickupCountry)}
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fromPostal">Postnummer</Label>
              <Input
                id="fromPostal"
                placeholder="Enter postal code"
                value={pickupPostalCode}
                onChange={(e) => setPickupPostalCode(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {pickupPostalCode}, Stockholm
              </p>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="fromCompany"
                  name="fromType"
                  className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="fromCompany">Företag</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="fromPrivate"
                  name="fromType"
                  className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                  defaultChecked
                />
                <Label htmlFor="fromPrivate">Privatperson</Label>
              </div>
            </div>
          </div>
        </div>
      </ResizablePanel>
      
      <ResizableHandle withHandle>
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-200 hover:bg-slate-300 cursor-pointer z-10"
          onClick={onSwapLocations}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 16L3 12M3 12L7 8M3 12H21M17 8L21 12M21 12L17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </ResizableHandle>
      
      <ResizablePanel defaultSize={50}>
        <div className="p-0">
          <div className="bg-slate-700 text-white p-3 font-semibold">
            Till
          </div>
          
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="toCountry">Land</Label>
              <div className="relative">
                <select
                  id="toCountry"
                  className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background appearance-none cursor-pointer"
                  value={deliveryCountry}
                  onChange={(e) => setDeliveryCountry(e.target.value)}
                >
                  <option value="SE">Sverige</option>
                  <option value="FI">Finland</option>
                  <option value="NO">Norge</option>
                  <option value="DK">Danmark</option>
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  {getCountryFlag(deliveryCountry)}
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="toPostal">Postnummer</Label>
              <Input
                id="toPostal"
                placeholder="Enter postal code"
                value={deliveryPostalCode}
                onChange={(e) => setDeliveryPostalCode(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {deliveryPostalCode}, Helsinki
              </p>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="toCompany"
                  name="toType"
                  className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="toCompany">Företag</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="toPrivate"
                  name="toType"
                  className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                  defaultChecked
                />
                <Label htmlFor="toPrivate">Privatperson</Label>
              </div>
            </div>
          </div>
        </div>
      </ResizablePanel>

      
    </ResizablePanelGroup>
    

  );
};

export default LocationSelector;
