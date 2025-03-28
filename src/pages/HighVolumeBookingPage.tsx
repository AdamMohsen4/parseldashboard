import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, FileText, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import NavBar from "@/components/layout/NavBar";
import { processCSVFile, processExcelFile, validateShipmentData } from '@/utils/fileProcessing';
import { ShipmentData, HighVolumeShipment } from '@/types/shipment';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

type Step = 'business-info' | 'upload-data' | 'review';

const HighVolumeBookingPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>('business-info');
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
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      try {
        setIsProcessing(true);
        setFile(selectedFile);
        
        let processedShipments: ShipmentData[];
        if (selectedFile.type === 'text/csv') {
          processedShipments = await processCSVFile(selectedFile);
        } else {
          processedShipments = await processExcelFile(selectedFile);
        }

        const validation = validateShipmentData(processedShipments);
        if (!validation.valid) {
          setValidationErrors(validation.errors);
          toast({
            title: "Validation Errors",
            description: "Please fix the errors in your file before proceeding.",
            variant: "destructive",
          });
        } else {
          setValidationErrors([]);
          setShipments(processedShipments);
          toast({
            title: "File Processed",
            description: `Successfully processed ${processedShipments.length} shipments.`,
          });
        }
      } catch (error) {
        toast({
          title: "Error Processing File",
          description: error instanceof Error ? error.message : "An error occurred while processing the file.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleNext = () => {
    if (currentStep === 'business-info') {
      setCurrentStep('upload-data');
    } else if (currentStep === 'upload-data' && shipments.length > 0 && validationErrors.length === 0) {
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    if (currentStep === 'upload-data') {
      setCurrentStep('business-info');
    } else if (currentStep === 'review') {
      setCurrentStep('upload-data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const highVolumeShipment: HighVolumeShipment = {
        businessInfo,
        shipments,
        totalPackages: shipments.length,
        totalWeight: shipments.reduce((sum, s) => sum + s.packageWeight, 0),
        estimatedCost: shipments.length * 10, // Example calculation
      };

      // Here you would typically:
      // 1. Send the data to your backend
      // 2. Process the shipments
      // 3. Generate shipping labels
      // 4. Send confirmation emails

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
      setShipments([]);
      setCurrentStep('business-info');
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderBusinessInfoStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>
          Please provide your business details for the high volume shipment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
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

          <div className="flex justify-end">
            <Button type="button" onClick={handleNext}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderUploadDataStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Upload Shipment Data</CardTitle>
        <CardDescription>
          Upload a CSV or Excel file containing your shipment data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Shipment Data File</Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={isProcessing}
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
                  onClick={() => {
                    setFile(null);
                    setShipments([]);
                    setValidationErrors([]);
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Supported formats: CSV, Excel (.xlsx, .xls)
            </p>
          </div>

          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation Errors</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {shipments.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Preview ({shipments.length} shipments)</h3>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Weight</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipments.slice(0, 5).map((shipment, index) => (
                      <TableRow key={index}>
                        <TableCell>{shipment.recipientName}</TableCell>
                        <TableCell>{shipment.recipientAddress}</TableCell>
                        <TableCell>{shipment.packageWeight} kg</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button 
              type="button" 
              onClick={handleNext}
              disabled={shipments.length === 0 || validationErrors.length > 0}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderReviewStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Review Your Shipment</CardTitle>
        <CardDescription>
          Please review your business information and shipment data before submitting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Business Name</Label>
                <p>{businessInfo.name}</p>
              </div>
              <div>
                <Label>VAT Number</Label>
                <p>{businessInfo.vatNumber}</p>
              </div>
              <div>
                <Label>Address</Label>
                <p>{businessInfo.address}</p>
              </div>
              <div>
                <Label>City</Label>
                <p>{businessInfo.city}</p>
              </div>
              <div>
                <Label>Postal Code</Label>
                <p>{businessInfo.postalCode}</p>
              </div>
              <div>
                <Label>Country</Label>
                <p>{businessInfo.country}</p>
              </div>
              <div>
                <Label>Contact Person</Label>
                <p>{businessInfo.contactPerson}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p>{businessInfo.email}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p>{businessInfo.phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Shipment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-md">
                <Label>Total Packages</Label>
                <p className="text-2xl font-bold">{shipments.length}</p>
              </div>
              <div className="p-4 border rounded-md">
                <Label>Total Weight</Label>
                <p className="text-2xl font-bold">
                  {shipments.reduce((sum, s) => sum + s.packageWeight, 0).toFixed(2)} kg
                </p>
              </div>
              <div className="p-4 border rounded-md">
                <Label>Estimated Cost</Label>
                <p className="text-2xl font-bold">€{(shipments.length * 10).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Submit Shipment'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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

          {currentStep === 'business-info' && renderBusinessInfoStep()}
          {currentStep === 'upload-data' && renderUploadDataStep()}
          {currentStep === 'review' && renderReviewStep()}
        </div>
      </div>
    </div>
  );
};

export default HighVolumeBookingPage; 