
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DocumentUpload from "./DocumentUpload";

interface SimpleRequestFormProps {
  userId: string;
  onSubmit: (formData: {
    companyName: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    requirements: string;
    documentUrl: string;
  }) => void;
  isSubmitting: boolean;
}

const SimpleRequestForm: React.FC<SimpleRequestFormProps> = ({ 
  userId, 
  onSubmit, 
  isSubmitting 
}) => {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [requirements, setRequirements] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");

  const handleDocumentUploaded = (url: string) => {
    setDocumentUrl(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      companyName,
      contactName,
      contactEmail,
      contactPhone,
      requirements,
      documentUrl
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick 3PL Service Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input 
                id="companyName" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="contactName">Contact Name</Label>
              <Input 
                id="contactName" 
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input 
                id="contactEmail" 
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input 
                id="contactPhone" 
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="requirements">Brief Requirements</Label>
            <Textarea 
              id="requirements" 
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Briefly describe your logistics needs"
              className="min-h-[100px]"
            />
          </div>
          
          <DocumentUpload 
            userId={userId} 
            onDocumentUploaded={handleDocumentUploaded} 
          />
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting || (!documentUrl && !requirements)}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleRequestForm;
