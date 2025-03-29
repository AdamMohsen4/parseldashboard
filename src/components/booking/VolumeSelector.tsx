import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Truck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type VolumeType = 'high' | 'low';

interface VolumeSelectorProps {
  onVolumeSelect: (volume: VolumeType) => void;
}

const VolumeSelector: React.FC<VolumeSelectorProps> = ({ onVolumeSelect }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLowVolume = () => {
    onVolumeSelect('low');
    // Stay on the current page for low volume
  };

  const handleHighVolume = () => {
    onVolumeSelect('high');
    // Redirect to high volume booking page
    navigate('/shipment/high-volume');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8">{t('booking.volumeSelector.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Low Volume Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold">{t('booking.volumeSelector.lowVolume.title')}</h2>
            <p className="text-sm text-gray-500">{t('booking.volumeSelector.lowVolume.subtitle')}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                {t('booking.volumeSelector.lowVolume.features.individual')}
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                {t('booking.volumeSelector.lowVolume.features.rates')}
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                {t('booking.volumeSelector.lowVolume.features.process')}
              </li>
            </ul>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleLowVolume}
            >
              {t('booking.volumeSelector.lowVolume.button')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* High Volume Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Truck className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-semibold">{t('booking.volumeSelector.highVolume.title')}</h2>
            <p className="text-sm text-gray-500">{t('booking.volumeSelector.highVolume.subtitle')}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                {t('booking.volumeSelector.highVolume.features.bulk')}
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                {t('booking.volumeSelector.highVolume.features.rates')}
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                {t('booking.volumeSelector.highVolume.features.upload')}
              </li>
            </ul>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleHighVolume}
            >
              {t('booking.volumeSelector.highVolume.button')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VolumeSelector; 