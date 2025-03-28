import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import NavBar from "@/components/layout/NavBar";

interface BusinessInfo {
  name: string;
  vatNumber: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  contactPerson: string;
  email: string;
  phone: string;
}

const HighVolumeBookingPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: '',
    vatNumber: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    contactPerson: '',
    email: '',
    phone: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file type
      if (selectedFile.type === 'text/csv' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          selectedFile.type === 'application/vnd.ms-excel') {
        setFile(selectedFile);
        toast({
          title: "File selected",
          description: `Selected file: ${selectedFile.name}`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV or Excel file",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Here you would typically:
      // 1. Validate the business information
      // 2. Upload the file
      // 3. Process the data
      // 4. Create the shipment records

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Success!",
        description: "Your high volume shipment request has been submitted.",
      });

      // Reset form
      setBusinessInfo({
        name: '',
        vatNumber: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        contactPerson: '',
        email: '',
        phone: '',
      });
      setFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">High Volume Shipment Booking</h1>
          
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important Information</AlertTitle>
            <AlertDescription>
              For high volume shipments, please provide your business details and upload a CSV or Excel file containing your shipment data. The file should include columns for recipient name, address, city, postal code, country, and package details.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Please provide your business details for the high volume shipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Business Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={businessInfo.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vatNumber">VAT Number</Label>
                    <Input
                      id="vatNumber"
                      name="vatNumber"
                      value={businessInfo.vatNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={businessInfo.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={businessInfo.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={businessInfo.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={businessInfo.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      name="contactPerson"
                      value={businessInfo.contactPerson}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={businessInfo.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={businessInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label>Shipment Data File</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label
                      htmlFor="file-upload"
                      className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent"
                    >
                      <Upload className="h-4 w-4" />
                      {file ? file.name : 'Upload CSV or Excel file'}
                    </Label>
                    {file && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFile(null)}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: CSV, Excel (.xlsx, .xls)
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isUploading}>
                  {isUploading ? 'Processing...' : 'Submit High Volume Shipment'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HighVolumeBookingPage; 