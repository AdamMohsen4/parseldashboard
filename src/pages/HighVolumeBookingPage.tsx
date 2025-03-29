import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import NavBar from "@/components/layout/NavBar";
import { processCSVFile, processExcelFile, validateShipmentData } from '@/utils/fileProcessing';
import { ShipmentData } from '@/types/shipment';
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
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

const initialBusinessInfo: BusinessInfo = {
  name: '',
  vatNumber: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
  contactPerson: '',
  email: '',
  phone: '',
};

const HighVolumeBookingPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState<Step>('business-info');
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(initialBusinessInfo);
  const [file, setFile] = useState<File | null>(null);
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      setIsProcessing(true);
      setFile(selectedFile);
      
      const processedShipments = selectedFile.type === 'text/csv' 
        ? await processCSVFile(selectedFile)
        : await processExcelFile(selectedFile);

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
  };

  const handleNext = () => {
    if (currentStep === 'business-info') {
      setCurrentStep('upload-data');
    } else if (currentStep === 'upload-data' && shipments.length > 0 && validationErrors.length === 0) {
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep === 'review' ? 'upload-data' : 'business-info');
  };

  const generateTrackingCode = () => 
    `EP${Date.now().toString().slice(-8)}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const { data: businessData, error: businessError } = await supabase
        .from('high_volume_businesses')
        .insert({
          name: businessInfo.name,
          vat_number: businessInfo.vatNumber,
          address: businessInfo.address,
          city: businessInfo.city,
          postal_code: businessInfo.postalCode,
          country: businessInfo.country,
          contact_person: businessInfo.contactPerson,
          email: businessInfo.email,
          phone: businessInfo.phone
        })
        .select()
        .single();

      if (businessError) throw new Error(`Failed to save business information: ${businessError.message}`);

      const shipmentRecords = shipments.map(shipment => ({
        business_id: businessData.id,
        tracking_code: generateTrackingCode(),
        recipient_name: shipment.recipientName,
        recipient_address: shipment.recipientAddress,
        recipient_city: shipment.recipientCity,
        recipient_postal_code: shipment.recipientPostalCode,
        recipient_country: shipment.recipientCountry,
        package_weight: shipment.packageWeight,
        package_length: shipment.packageLength,
        package_width: shipment.packageWidth,
        package_height: shipment.packageHeight,
        special_instructions: shipment.specialInstructions || null,
        status: 'pending'
      }));

      const { error: shipmentsError } = await supabase
        .from('high_volume_shipments')
        .insert(shipmentRecords);

      if (shipmentsError) throw new Error(`Failed to save shipments: ${shipmentsError.message}`);

      toast({
        title: "Success!",
        description: `Successfully created ${shipments.length} shipments for ${businessInfo.name}`,
      });

      // Reset form
      setBusinessInfo(initialBusinessInfo);
      setFile(null);
      setShipments([]);
      setCurrentStep('business-info');
    } catch (error) {
      console.error('Error submitting high volume shipment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderBusinessInfoStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>{t('booking.highVolume.businessInfo.title')}</CardTitle>
        <CardDescription>{t('booking.highVolume.businessInfo.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(businessInfo).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{t(`booking.highVolume.businessInfo.${key}`)}</Label>
                <Input
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  required
                  type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={handleNext}>
              {t('booking.highVolume.navigation.next')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderUploadDataStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>{t('booking.highVolume.uploadData.title')}</CardTitle>
        <CardDescription>{t('booking.highVolume.uploadData.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>{t('booking.highVolume.uploadData.fileLabel')}</Label>
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
                {file ? file.name : t('booking.highVolume.uploadData.uploadButton')}
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
                  {t('booking.highVolume.uploadData.clearButton')}
                </Button>
              )}
            </div>
          </div>

          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('booking.highVolume.uploadData.validationErrors')}</AlertTitle>
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
              <h3 className="font-medium">{t('booking.highVolume.uploadData.preview')} ({shipments.length} {t('booking.highVolume.uploadData.shipments')})</h3>
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
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('booking.highVolume.navigation.back')}
            </Button>
            <Button 
              type="button" 
              onClick={handleNext}
              disabled={shipments.length === 0 || validationErrors.length > 0}
            >
              {t('booking.highVolume.navigation.next')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderReviewStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>{t('booking.highVolume.review.title')}</CardTitle>
        <CardDescription>{t('booking.highVolume.review.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">{t('booking.highVolume.review.businessInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(businessInfo).map(([key, value]) => (
                <div key={key}>
                  <Label>{t(`booking.highVolume.businessInfo.${key}`)}</Label>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">{t('booking.highVolume.review.shipmentSummary')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-md">
                <Label>{t('booking.highVolume.review.totalPackages')}</Label>
                <p className="text-2xl font-bold">{shipments.length}</p>
              </div>
              <div className="p-4 border rounded-md">
                <Label>{t('booking.highVolume.review.totalWeight')}</Label>
                <p className="text-2xl font-bold">
                  {shipments.reduce((sum, s) => sum + s.packageWeight, 0).toFixed(2)} kg
                </p>
              </div>
              <div className="p-4 border rounded-md">
                <Label>{t('booking.highVolume.review.estimatedCost')}</Label>
                <p className="text-2xl font-bold">€{(shipments.length * 10).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('booking.highVolume.navigation.back')}
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? t('booking.highVolume.review.processing') : t('booking.highVolume.review.submitButton')}
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
          <h1 className="text-3xl font-bold mb-6">{t('booking.highVolume.title')}</h1>
          
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('booking.highVolume.importantInfo.title')}</AlertTitle>
            <AlertDescription>
              {t('booking.highVolume.importantInfo.description')}
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