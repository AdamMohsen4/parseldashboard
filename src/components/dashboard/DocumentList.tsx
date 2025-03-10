
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Download, Trash2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { DocumentFile, deleteDocument } from "@/services/documentService";
import { MoreVertical } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { formatFileSize } from "@/lib/utils";

interface DocumentListProps {
  documents: DocumentFile[];
  onDelete: () => void;
}

const DocumentList = ({ documents, onDelete }: DocumentListProps) => {
  const [deleting, setDeleting] = useState<string | null>(null);

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'csv':
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="h-10 w-10 text-green-500 flex-shrink-0" />;
      case 'pdf':
      default:
        return <FileText className="h-10 w-10 text-red-500 flex-shrink-0" />;
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await deleteDocument(id);
      toast({
        title: "Document Deleted",
        description: "The document has been successfully deleted.",
      });
      onDelete();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-start p-4 border border-border rounded-lg">
          {getFileIcon(doc.type)}
          <div className="ml-4 flex-grow min-w-0">
            <p className="font-medium truncate">{doc.name}</p>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span>{doc.uploadDate}</span>
              <span className="mx-2">•</span>
              <span>{formatFileSize(doc.size)}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => handleDelete(doc.id)}
                disabled={deleting === doc.id}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deleting === doc.id ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
