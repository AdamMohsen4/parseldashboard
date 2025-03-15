
import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Shipment } from '@/types';
import { File, Download, Printer, Copy, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { API } from '@/services/api';

interface LabelGeneratorProps {
  shipment: Shipment;
}

const LabelGenerator: React.FC<LabelGeneratorProps> = ({ shipment }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [labelUrl, setLabelUrl] = useState<string | null>(shipment.labelUrl || null);
  
  const handleGenerateLabel = async () => {
    setIsGenerating(true);
    
    try {
      const url = await API.generateLabel(shipment.id);
      setLabelUrl(url);
      toast.success('Label generated successfully!');
    } catch (error) {
      console.error('Error generating label:', error);
      toast.error('Failed to generate label. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopyTrackingCode = () => {
    if (shipment.trackingCode) {
      navigator.clipboard.writeText(shipment.trackingCode);
      toast.success('Tracking code copied to clipboard!');
    }
  };
  
  return (
    <Card className="w-full animate-fade-in">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-xl font-semibold">Shipping Label</h2>
        <p className="text-muted-foreground text-sm">
          Generate, download or print your shipping label
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Label preview */}
        <div className="flex-1 border rounded-lg overflow-hidden bg-secondary/30">
          {labelUrl ? (
            <div className="relative aspect-[1/1.4] w-full bg-white flex items-center justify-center">
              {/* This would be a PDF viewer in a real app */}
              <div className="absolute inset-0 p-8">
                {/* Simplified label preview */}
                <div className="border-2 border-gray-800 h-full rounded-md p-6 flex flex-col">
                  <div className="text-center border-b-2 border-gray-800 pb-4">
                    <div className="text-2xl font-bold mb-1">{shipment.carrier}</div>
                    <div className="font-mono text-sm">{shipment.trackingCode}</div>
                  </div>
                  
                  <div className="flex flex-col justify-between flex-1 py-4">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">FROM:</div>
                      <div className="font-medium">Sender Name</div>
                      <div>{shipment.pickupLocation.address}</div>
                      <div>
                        {shipment.pickupLocation.city}, {shipment.pickupLocation.postalCode}
                      </div>
                      <div>{shipment.pickupLocation.country}</div>
                    </div>
                    
                    <div className="h-24 border-2 border-gray-800 my-4 flex items-center justify-center">
                      {/* Barcode placeholder */}
                      <div className="font-mono text-xs">
                        {shipment.trackingCode}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-600 mb-1">TO:</div>
                      <div className="font-medium">Recipient Name</div>
                      <div>{shipment.deliveryLocation.address}</div>
                      <div>
                        {shipment.deliveryLocation.city}, {shipment.deliveryLocation.postalCode}
                      </div>
                      <div>{shipment.deliveryLocation.country}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Check className="text-green-500 h-16 w-16" />
            </div>
          ) : (
            <div className="aspect-[1/1.4] w-full bg-muted/20 flex items-center justify-center p-6">
              <div className="text-center">
                <File className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No label generated yet</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  Generate a shipping label to view, download or print it.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="lg:w-72 space-y-5">
          {/* Shipment info */}
          <div className="p-4 rounded-lg bg-secondary/50 border space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Shipment ID</div>
              <div className="font-mono text-sm">{shipment.id}</div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Tracking Number</div>
              <div className="font-mono text-sm flex items-center">
                {shipment.trackingCode || 'Not available yet'}
                {shipment.trackingCode && (
                  <button 
                    onClick={handleCopyTrackingCode}
                    className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Carrier</div>
              <div className="font-medium">{shipment.carrier}</div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Weight</div>
              <div>{shipment.dimensions.weight} kg</div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="space-y-3">
            {!labelUrl ? (
              <Button
                className="w-full"
                isLoading={isGenerating}
                onClick={handleGenerateLabel}
                icon={<File className="h-5 w-5" />}
              >
                Generate Label
              </Button>
            ) : (
              <>
                <Button
                  className="w-full"
                  icon={<Download className="h-5 w-5" />}
                  onClick={() => toast.success('Label downloaded successfully!')}
                >
                  Download Label
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  icon={<Printer className="h-5 w-5" />}
                  onClick={() => toast.success('Sending to printer...')}
                >
                  Print Label
                </Button>
              </>
            )}
          </div>
          
          {/* Reminder */}
          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Important</h4>
              <p className="text-xs text-yellow-700 mt-1">
                Attach this label securely to your parcel. Make sure the barcode is clearly visible and not covered.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LabelGenerator;
