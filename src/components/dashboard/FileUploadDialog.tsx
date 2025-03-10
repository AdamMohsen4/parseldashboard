
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileX, CheckCircle } from "lucide-react";
import { uploadDocument } from "@/services/documentService";
import { toast } from "@/components/ui/use-toast";

interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

const FileUploadDialog = ({ isOpen, onClose, onUploadComplete }: FileUploadDialogProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      // Upload each file
      for (const file of files) {
        await uploadDocument(file);
      }
      
      toast({
        title: "Files Uploaded",
        description: `Successfully uploaded ${files.length} document${files.length > 1 ? 's' : ''}.`,
      });
      
      // Reset and close
      setFiles([]);
      onUploadComplete();
      onClose();
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Upload shipping documents, invoices, or other important files.
          </DialogDescription>
        </DialogHeader>
        
        <div 
          className={`mt-4 border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? 'border-primary bg-primary/5' : 'border-border'}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm font-medium mb-1">Drag and drop files here</p>
          <p className="text-xs text-muted-foreground mb-3">
            or click to browse from your computer
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            Choose Files
          </Button>
          <input 
            id="file-upload" 
            type="file" 
            multiple 
            className="hidden" 
            onChange={handleFileChange}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Supported formats: PDF, CSV, Excel, JPG
          </p>
        </div>
        
        {files.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Selected files:</h4>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                  <div className="flex items-center space-x-2 truncate">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm truncate">{file.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => removeFile(index)}
                  >
                    <FileX className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <DialogFooter className="flex space-x-2 justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={files.length === 0 || uploading}
          >
            {uploading ? "Uploading..." : `Upload ${files.length > 0 ? `(${files.length})` : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadDialog;
