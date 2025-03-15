
// This service handles label generation functionality
// In a real app, this would connect to a backend API
// For our MVP, we'll generate a PDF label using jsPDF

import { toast } from "@/components/ui/use-toast";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export interface LabelRequest {
  shipmentId: string;
  carrierName: string;
  trackingCode: string;
  senderAddress: string;
  recipientAddress: string;
  packageDetails: {
    weight: string;
    dimensions: string;
  };
  language?: string; // Added language option
}

export interface LabelResponse {
  labelUrl: string;
  success: boolean;
  message?: string;
  pdfBlob?: Blob; // Added PDF blob for direct download
}

// Helper function to create QR code data URL
const generateQRCode = async (text: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 150,
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return "";
  }
};

export const generateLabel = async (request: LabelRequest): Promise<LabelResponse> => {
  try {
    // Simulate API call delay
    console.log("Generating label for shipment:", request);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate a PDF label
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a6', // A6 is a good size for shipping labels
    });
    
    // Set language
    if (request.language === 'fi') {
      pdf.setLanguage('fi');
    } else {
      pdf.setLanguage('en-US');
    }
    
    // Generate QR code with tracking information
    const qrCodeData = await generateQRCode(`TRACK:${request.trackingCode}`);
    
    // Set font
    pdf.setFont("helvetica", "bold");
    
    // Add carrier name and header
    pdf.setFontSize(16);
    pdf.text(request.carrierName, 105/2, 15, { align: 'center' });
    
    // Add batch label
    const batchLabel = `Batch-001-HEL`;
    pdf.setFontSize(14);
    pdf.text(batchLabel, 105/2, 25, { align: 'center' });
    
    // Add tracking code
    pdf.setFontSize(11);
    pdf.text(`Tracking: ${request.trackingCode}`, 105/2, 33, { align: 'center' });
    
    // Add QR code
    if (qrCodeData) {
      pdf.addImage(qrCodeData, 'PNG', 32.5, 38, 40, 40);
    }
    
    // Add sender and recipient
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text("From:", 10, 85);
    pdf.text(request.senderAddress.split(',')[0], 10, 90);
    
    pdf.text("To:", 10, 100);
    const recipientLines = request.recipientAddress.split(',');
    pdf.text(recipientLines[0], 10, 105);
    if (recipientLines.length > 1) {
      pdf.text(recipientLines.slice(1).join(', '), 10, 110);
    }
    
    // Add package details
    pdf.text(`Weight: ${request.packageDetails.weight}`, 10, 120);
    pdf.text(`Dimensions: ${request.packageDetails.dimensions}`, 10, 125);
    
    // Add footer with shipment ID
    pdf.setFontSize(8);
    pdf.text(`Shipment ID: ${request.shipmentId}`, 105/2, 145, { align: 'center' });
    
    // Convert to blob for download
    const pdfBlob = pdf.output('blob');
    
    // Create a URL for the blob
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    return {
      labelUrl: pdfUrl,
      pdfBlob: pdfBlob,
      success: true
    };
  } catch (error) {
    console.error("Error generating label:", error);
    toast({
      title: "Label Generation Failed",
      description: "Unable to generate shipping label. Please try again.",
      variant: "destructive",
    });
    return {
      labelUrl: "",
      success: false,
      message: "Failed to generate label"
    };
  }
};
