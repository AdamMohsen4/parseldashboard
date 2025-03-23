
import React from 'react';
import ShipmentVolume from "./ShipmentVolume";

interface DeliveryOptionsProps {
  selectedVolume: string;
  setSelectedVolume: (volume: string) => void;
}

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({ 
  selectedVolume, 
  setSelectedVolume 
}) => {
  return (
    <div className="border rounded-lg mb-8">
      <div className="bg-slate-700 text-white p-3 font-semibold">
        Ange sändningsdetaljer
      </div>
      
      <div className="p-6">
        <ShipmentVolume 
          selectedVolume={selectedVolume}
          onVolumeSelect={setSelectedVolume}
        />
      </div>
    </div>
  );
};

export default DeliveryOptions;
