
import React from 'react';
import { Card } from '../common/Card';
import { useTranslation } from 'react-i18next';
import Image from '../common/Image';

interface ShipmentVolumeProps {
  selectedVolume: string;
  onVolumeSelect: (volume: string) => void;
}

interface PackageSize {
  id: string;
  name: string;
  dimensions: string;
  deliveryTime: string;
  price: number;
  imageSrc: string;
  badge?: string;
}

const ShipmentVolume: React.FC<ShipmentVolumeProps> = ({ 
  selectedVolume, 
  onVolumeSelect 
}) => {
  const { t } = useTranslation();
  
  const packageSizes: PackageSize[] = [
    {
      id: 'xxs',
      name: 'Småpaket (XXS)',
      dimensions: 'max. 3 x 25 x 35 cm, 2 kg',
      deliveryTime: 'Framme inom 5 arbetsdagar',
      price: 5.90,
      imageSrc: '/lovable-uploads/79302520-d7e5-401c-97a5-f55983f65418.png',
    },
    {
      id: 's',
      name: 'S paket',
      dimensions: 'max. 11 x 32 x 42 cm, 25 kg',
      deliveryTime: 'Framme inom 1–3 arbetsdagar',
      price: 7.90,
      imageSrc: '/lovable-uploads/79302520-d7e5-401c-97a5-f55983f65418.png',
    },
    {
      id: 'm',
      name: 'M paket',
      dimensions: 'max. 19 x 36 x 60 cm, 25 kg',
      deliveryTime: 'Framme inom 1–3 arbetsdagar',
      price: 9.90,
      imageSrc: '/lovable-uploads/79302520-d7e5-401c-97a5-f55983f65418.png',
    },
    {
      id: 'l',
      name: 'L paket',
      dimensions: 'max. 37 x 36 x 60 cm, 25 kg',
      deliveryTime: 'Framme inom 1–3 arbetsdagar',
      price: 11.90,
      imageSrc: '/lovable-uploads/79302520-d7e5-401c-97a5-f55983f65418.png',
    },
    {
      id: 'xl',
      name: 'XL paket',
      dimensions: 'max. 100 x 60 x 40 cm, 25 kg',
      deliveryTime: 'Framme inom 1–3 arbetsdagar',
      price: 19.90,
      imageSrc: '/lovable-uploads/79302520-d7e5-401c-97a5-f55983f65418.png',
    },
    {
      id: 'xxl',
      name: 'XXL paket',
      dimensions: 'Max 200 cm och längd + omkrets max 300 cm, max 25 kg',
      deliveryTime: 'Framme inom 1–3 arbetsdagar',
      price: 39.90,
      imageSrc: '/lovable-uploads/79302520-d7e5-401c-97a5-f55983f65418.png',
      badge: 'Levereras till brevlådan'
    },
  ];

  return (
    <div className="my-6">
      <h2 className="text-2xl font-medium mb-6">Välj paketstorlek</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packageSizes.map((pkg) => (
          <div 
            key={pkg.id}
            className={`
              relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200
              ${selectedVolume === pkg.id 
                ? 'border-2 border-primary shadow-md' 
                : 'border border-gray-200 hover:border-gray-300 hover:shadow-sm'}
            `}
            onClick={() => onVolumeSelect(pkg.id)}
          >
            {pkg.badge && (
              <div className="absolute top-0 left-0 bg-slate-700 text-white text-xs py-1 px-2 rounded-br-md">
                {pkg.badge}
              </div>
            )}
            
            <div className="bg-rose-50 bg-opacity-50 p-4 flex justify-center">
              <img
                src={pkg.imageSrc}
                alt={`Package size ${pkg.name}`}
                className="h-24 object-contain"
              />
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-lg">{pkg.name}</h3>
              <p className="text-sm text-slate-600 my-2">{pkg.dimensions}</p>
              <p className="text-sm text-slate-600 mb-4">{pkg.deliveryTime}</p>
              
              <div className={`
                text-center py-2 px-4 rounded-full font-medium
                ${selectedVolume === pkg.id 
                  ? 'bg-primary text-white' 
                  : 'bg-orange-500 text-white'}
              `}>
                {pkg.price.toFixed(2)} €
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-slate-100 rounded-lg p-6">
        <h3 className="font-medium text-lg mb-4">Osäker på paketets storlek?</h3>
        <p className="text-slate-600 mb-4">
          Mät paketets bredd, höjd och djup. Fyll i informationen i fälten nedan för att få en storleksrekommendation för ditt paket.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="number"
              placeholder="Bredd"
              className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">cm</span>
          </div>
          
          <div className="relative">
            <input
              type="number"
              placeholder="Höjd"
              className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">cm</span>
          </div>
          
          <div className="relative">
            <input
              type="number"
              placeholder="Djup"
              className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">cm</span>
          </div>
        </div>
        
        <button className="mt-4 border border-orange-500 text-orange-500 hover:bg-orange-50 rounded-full py-2 px-6 transition-colors">
          Visa lämpliga storlekar
        </button>
      </div>
    </div>
  );
};

export default ShipmentVolume;
