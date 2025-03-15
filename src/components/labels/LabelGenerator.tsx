
import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Shipment } from '@/types';
import { File, Download, Printer, QrCode, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { generateLabel } from '@/services/labelService';

interface LabelGeneratorProps {
  shipment: Shipment;
}

const LabelGenerator: React.FC<LabelGeneratorProps> = ({ shipment }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [labelUrl, setLabelUrl] = useState<string | null>(shipment.labelUrl || null);
  
  const handleGenerateLabel = async () => {
    setIsGenerating(true);
    
    try {
      const dimensions = `${shipment.dimensions.length}x${shipment.dimensions.width}x${shipment.dimensions.height} cm`;
      const result = await generateLabel({
        shipmentId: shipment.id,
        carrierName: shipment.carrier,
        trackingCode: shipment.trackingCode || `EP${Math.floor(Math.random() * 1000000)}FI`,
        senderAddress: shipment.pickupLocation.address,
        recipientAddress: shipment.deliveryLocation.address,
        packageDetails: {
          weight: shipment.dimensions.weight,
          dimensions: dimensions
        }
      });
      
      if (result.success) {
        setLabelUrl(result.labelUrl);
        toast.success('Label generated successfully!');
      } else {
        toast.error('Failed to generate label. Please try again.');
      }
    } catch (error) {
      console.error('Error generating label:', error);
      toast.error('Failed to generate label. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownloadLabel = async () => {
    if (!shipment.trackingCode) {
      toast.error('No tracking code available for this shipment');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const dimensions = `${shipment.dimensions.length}x${shipment.dimensions.width}x${shipment.dimensions.height} cm`;
      const result = await generateLabel({
        shipmentId: shipment.id,
        carrierName: shipment.carrier,
        trackingCode: shipment.trackingCode,
        senderAddress: shipment.pickupLocation.address,
        recipientAddress: shipment.deliveryLocation.address,
        packageDetails: {
          weight: shipment.dimensions.weight,
          dimensions: dimensions
        }
      });
      
      if (result.success && result.pdfBlob) {
        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = result.labelUrl;
        downloadLink.download = `label-${shipment.trackingCode}.pdf`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Clean up the URL object
        setTimeout(() => URL.revokeObjectURL(result.labelUrl), 100);
        
        toast.success('Label downloaded successfully!');
      } else {
        toast.error('Failed to download label. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading label:', error);
      toast.error('Failed to download label. Please try again.');
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
  
  const handlePrintLabel = () => {
    if (labelUrl) {
      const printWindow = window.open(labelUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
      toast.success('Sending to printer...');
    } else {
      toast.error('No label available to print');
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
              <iframe
                src={labelUrl}
                className="absolute inset-0 w-full h-full border-0"
                title="Shipping Label Preview"
              />
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
                    <QrCode className="h-4 w-4" />
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
                  onClick={handleDownloadLabel}
                  isLoading={isGenerating}
                >
                  Download Label
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  icon={<Printer className="h-5 w-5" />}
                  onClick={handlePrintLabel}
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
