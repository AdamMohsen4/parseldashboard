
import { toast } from "@/components/ui/use-toast";

// Define types for our document data
export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: number;
  url: string;
}

// In-memory storage for documents (would be replaced with API calls in production)
const documentsStore: DocumentFile[] = [
  {
    id: "doc-001",
    name: "Invoice-EP-78945.pdf",
    type: "pdf",
    uploadDate: "2023-06-15",
    size: 245000,
    url: "#"
  },
  {
    id: "doc-002",
    name: "CustomsForm-EP-78945.pdf",
    type: "pdf",
    uploadDate: "2023-06-15",
    size: 189000,
    url: "#"
  },
  {
    id: "doc-003",
    name: "ShipmentData-Jun2023.csv",
    type: "csv",
    uploadDate: "2023-06-01",
    size: 320000,
    url: "#"
  },
  {
    id: "doc-004",
    name: "Invoice-EP-78946.pdf",
    type: "pdf",
    uploadDate: "2023-06-14",
    size: 230000,
    url: "#"
  }
];

export const getDocuments = (): DocumentFile[] => {
  return documentsStore;
};

export const uploadDocument = async (file: File): Promise<DocumentFile> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Create a new document object
      const newDoc: DocumentFile = {
        id: `doc-${Math.floor(Math.random() * 10000)}`,
        name: file.name,
        type: file.name.split('.').pop() || "unknown",
        uploadDate: new Date().toISOString().split('T')[0],
        size: file.size,
        url: URL.createObjectURL(file)
      };
      
      // Add to our store (in a real app, this would be an API call)
      documentsStore.unshift(newDoc);
      
      resolve(newDoc);
    }, 1000);
  });
};

export const deleteDocument = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Find the index of the document to remove
      const index = documentsStore.findIndex(doc => doc.id === id);
      
      if (index !== -1) {
        // Remove the document from the store
        documentsStore.splice(index, 1);
      }
      
      resolve();
    }, 500);
  });
};
