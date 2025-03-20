
// This service handles label generation functionality
// In a real app, this would connect to a backend API
// For our MVP, we'll generate a mock PDF label

import { toast } from "@/components/ui/use-toast";
import jsPDF from "jspdf";
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
  labelBlob?: Blob; // Added for direct PDF download
}

// Helper function to generate QR code as data URL
const generateQRCode = async (text: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 200,
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};

// Create a PDF label with shipment information and QR code
const createLabelPDF = async (request: LabelRequest): Promise<Blob> => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a6", // Standard shipping label size
  });
  
  // Set background color and border
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "F");
  
  // Add label header with carrier name
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(request.carrierName.toUpperCase(), 10, 10);
  
  // Add batch information
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Batch: Batch-001-HEL`, 10, 17);
  
  // Add tracking code
  doc.setFontSize(11);
  doc.text(`Tracking: ${request.trackingCode}`, 10, 24);
  
  // Add shipment ID
  doc.text(`Shipment ID: ${request.shipmentId}`, 10, 30);
  
  // Add sender information
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("FROM:", 10, 40);
  doc.setFont("helvetica", "normal");
  doc.text(request.senderAddress.split(",").slice(0, 2).join(", "), 10, 45);
  
  // Add recipient information
  doc.setFont("helvetica", "bold");
  doc.text("TO:", 10, 60);
  doc.setFont("helvetica", "normal");
  doc.text(request.recipientAddress.split(",").slice(0, 2).join(", "), 10, 65);
  
  // Add package details
  doc.setFont("helvetica", "bold");
  doc.text("PACKAGE:", 10, 80);
  doc.setFont("helvetica", "normal");
  doc.text(`Weight: ${request.packageDetails.weight}`, 10, 85);
  doc.text(`Dimensions: ${request.packageDetails.dimensions}`, 10, 90);
  
  // Generate and add QR code
  try {
    const qrCodeDataUrl = await generateQRCode(
      JSON.stringify({
        shipmentId: request.shipmentId,
        trackingCode: request.trackingCode,
        carrier: request.carrierName
      })
    );
    
    // Position QR code in the bottom right
    doc.addImage(qrCodeDataUrl, "PNG", 70, 55, 30, 30);
    
    // Add scan instruction
    doc.setFontSize(8);
    doc.text("SCAN FOR TRACKING", 75, 90);
    
    // Return the PDF as a blob
    return doc.output("blob");
  } catch (error) {
    console.error("Error adding QR code to PDF:", error);
    throw error;
  }
};

export const generateLabel = async (request: LabelRequest): Promise<LabelResponse> => {
  try {
    // Log the label generation request
    console.log("Generating label for shipment:", request);
    
    // Simulate a brief delay like an API call would have
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate the PDF label
    const labelBlob = await createLabelPDF(request);
    
    // Create a blob URL for preview purposes
    const labelUrl = URL.createObjectURL(labelBlob);
    
    return {
      labelUrl,
      labelBlob,
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

// Helper function to trigger the download of the label PDF
export const downloadLabel = (labelBlob: Blob, fileName: string = "shipping-label.pdf") => {
  const url = URL.createObjectURL(labelBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
