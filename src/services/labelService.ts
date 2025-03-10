
// This service handles label generation functionality
// It uses PDFKit to generate shipping labels

import { toast } from "@/components/ui/use-toast";
import PDFDocument from "pdfkit";
import blobStream from "blob-stream";

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
}

export interface LabelResponse {
  labelUrl: string;
  success: boolean;
  message?: string;
}

export const generateLabel = async (request: LabelRequest): Promise<LabelResponse> => {
  try {
    console.log("Generating label for shipment:", request);
    
    // Create a new PDF document
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = doc.pipe(blobStream());
    
    // Add company logo placeholder
    doc.fontSize(20).text("E-PARSEL", { align: "center" });
    doc.moveDown();
    
    // Add carrier name
    doc.fontSize(16).text(`Carrier: ${request.carrierName}`, { align: "center" });
    doc.moveDown();
    
    // Add shipment details
    doc.fontSize(14).text(`Shipment ID: ${request.shipmentId}`);
    doc.text(`Tracking Code: ${request.trackingCode}`);
    doc.moveDown();
    
    // Draw a line separator
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
    doc.moveDown();
    
    // From address
    doc.fontSize(12).text("FROM:", { underline: true });
    doc.text(request.senderAddress);
    doc.moveDown();
    
    // To address
    doc.fontSize(12).text("TO:", { underline: true });
    doc.text(request.recipientAddress);
    doc.moveDown();
    
    // Package details
    doc.fontSize(12).text("PACKAGE DETAILS:", { underline: true });
    doc.text(`Weight: ${request.packageDetails.weight}`);
    doc.text(`Dimensions: ${request.packageDetails.dimensions}`);
    doc.moveDown();
    
    // Add a barcode placeholder (in a real app, you'd use a barcode library)
    doc.rect(100, doc.y, 400, 80).stroke();
    doc.fontSize(10).text("BARCODE PLACEHOLDER", 100, doc.y - 40, { align: "center", width: 400 });
    doc.fontSize(12).text(request.trackingCode, 100, doc.y + 20, { align: "center", width: 400 });
    
    // Add footer
    doc.fontSize(8).text("Please keep this label visible on the package", 50, doc.page.height - 50, {
      align: "center",
      width: doc.page.width - 100
    });
    
    // Finalize the PDF
    doc.end();
    
    // Convert blob stream to URL
    return new Promise((resolve) => {
      stream.on("finish", () => {
        // Create a blob URL that can be used to download the PDF
        const blob = stream.toBlob("application/pdf");
        const url = URL.createObjectURL(blob);
        
        resolve({
          labelUrl: url,
          success: true
        });
      });
    });
    
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

// Helper function to create a downloadable link for the label
export const downloadLabel = (labelUrl: string, filename: string = "shipping-label.pdf") => {
  const link = document.createElement("a");
  link.href = labelUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
