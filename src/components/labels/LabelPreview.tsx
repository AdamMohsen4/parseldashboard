
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { downloadLabel } from "@/services/labelService";
import { toast } from "@/components/ui/use-toast";

interface LabelPreviewProps {
  labelUrl: string;
  trackingCode: string;
  shipmentId: string;
}

const LabelPreview = ({ labelUrl, trackingCode, shipmentId }: LabelPreviewProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = () => {
    setIsDownloading(true);
    try {
      downloadLabel(labelUrl, `shipping-label-${trackingCode}.pdf`);
      toast({
        title: "Label Downloaded",
        description: "Your shipping label has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error downloading label:", error);
      toast({
        title: "Download Failed",
        description: "Unable to download the shipping label. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Shipping Label</CardTitle>
        <CardDescription>Your shipping label is ready for download</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="w-full bg-muted/20 border rounded-md p-6 mb-4 flex flex-col items-center">
          <FileText className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-2">Shipment ID: {shipmentId}</p>
          <p className="text-sm text-muted-foreground">Tracking Code: {trackingCode}</p>
        </div>
        {labelUrl && (
          <iframe 
            src={labelUrl} 
            className="w-full h-64 border rounded-md mb-4"
            title="Shipping Label Preview"
          />
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleDownload} 
          disabled={isDownloading || !labelUrl} 
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? "Downloading..." : "Download Label"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LabelPreview;
