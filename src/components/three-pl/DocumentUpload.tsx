
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadDocument } from "@/services/threePLService";
import { Check, FileText, Upload, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface DocumentUploadProps {
  userId: string;
  onDocumentUploaded: (url: string) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ userId, onDocumentUploaded }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadError(null);
      setUploadComplete(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) {
      toast({
        title: "Upload Error",
        description: "No file selected or user not logged in.",
        variant: "destructive",
      });
      return;
    }

    console.log("Starting upload for user:", userId);
    setIsUploading(true);
    setUploadError(null);

    try {
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setUploadError("File too large. Maximum size is 10MB.");
        setIsUploading(false);
        return;
      }
      
      const url = await uploadDocument(selectedFile, userId);
      
      if (url) {
        setUploadComplete(true);
        onDocumentUploaded(url);
        toast({
          title: "Upload Successful",
          description: "Your document has been uploaded successfully.",
        });
      } else {
        setUploadError("Failed to get document URL after upload");
        toast({
          title: "Upload Failed",
          description: "There was a problem uploading your document.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in document upload:", error);
      setUploadError("An unexpected error occurred");
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setUploadComplete(false);
    setUploadError(null);
    // Notify parent that no document is selected
    onDocumentUploaded("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <Label htmlFor="document-upload" className="font-medium">
          Upload Requirements Document (Optional)
        </Label>
      </div>
      
      <div className="border border-dashed rounded-md p-6 bg-muted/30">
        {uploadComplete ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              <span>{selectedFile?.name} uploaded successfully</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClearFile}>
              <X className="h-4 w-4 mr-1" /> Remove
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                If you prefer not to fill out the entire form, you can upload a document with your requirements.
              </p>
              <p className="text-xs text-muted-foreground">
                Accepted formats: PDF, DOCX, XLS, XLSX (Max: 10MB)
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Input
                  id="document-upload"
                  type="file"
                  accept=".pdf,.docx,.doc,.xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="flex-1"
                />
                
                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedFile || isUploading || uploadComplete}
                  variant="outline"
                >
                  {isUploading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" /> Upload
                    </>
                  )}
                </Button>
              </div>
              
              {selectedFile && !uploadComplete && !isUploading && (
                <div className="text-sm">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
              
              {uploadError && (
                <div className="text-sm text-destructive">
                  Error: {uploadError}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;
