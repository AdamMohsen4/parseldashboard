import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Truck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type VolumeType = 'high' | 'low';

interface VolumeSelectorProps {
  onVolumeSelect: (volume: VolumeType) => void;
}

const VolumeSelector: React.FC<VolumeSelectorProps> = ({ onVolumeSelect }) => {
  const navigate = useNavigate();

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
      <h1 className="text-2xl font-bold text-center mb-8">Choose Your Shipping Volume</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Low Volume Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold">Low Volume</h2>
            <p className="text-sm text-gray-500">Perfect for individual shipments</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Individual package booking
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Standard shipping rates
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Flexible pickup options
              </li>
            </ul>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleLowVolume}
            >
              Continue to Booking
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* High Volume Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <Truck className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-semibold">High Volume</h2>
            <p className="text-sm text-gray-500">For businesses with regular shipments</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Bulk shipping solutions
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Competitive rates
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Dedicated support
              </li>
            </ul>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleHighVolume}
            >
              Start High Volume Booking
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VolumeSelector; 