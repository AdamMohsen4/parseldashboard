
import React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShipmentDetailsFormProps {
  isVisible: boolean;
  onComplete: (data: ShipmentDetailsData) => void;
}

export interface ShipmentDetailsData {
  // Sender details
  senderName: string;
  senderAddress: string;
  senderPostcode: string;
  senderCity: string;
  senderCountry: string;
  senderPhoneCountryCode: string;
  senderPhoneNumber: string;
  senderEmail: string;
  
  // Recipient details
  recipientName: string;
  recipientAddress: string;
  recipientAddress2: string;
  recipientPostcode: string;
  recipientCity: string;
  recipientCountry: string;
  recipientPhoneCountryCode: string;
  recipientPhoneNumber: string;
  recipientEmail: string;
  
  // Additional info
  additionalInstructions: string;
  reference: string;
  packageValue: string;
  packageContents: string;
}

const ShipmentDetailsForm: React.FC<ShipmentDetailsFormProps> = ({ 
  isVisible, 
  onComplete 
}) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = React.useState<ShipmentDetailsData>({
    senderName: "",
    senderAddress: "",
    senderPostcode: "",
    senderCity: "",
    senderCountry: "Finland",
    senderPhoneCountryCode: "+358",
    senderPhoneNumber: "",
    senderEmail: "",
    
    recipientName: "",
    recipientAddress: "",
    recipientAddress2: "",
    recipientPostcode: "",
    recipientCity: "",
    recipientCountry: "Sweden",
    recipientPhoneCountryCode: "+46",
    recipientPhoneNumber: "",
    recipientEmail: "",
    
    additionalInstructions: "",
    reference: "",
    packageValue: "",
    packageContents: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };
  
  if (!isVisible) return null;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-background rounded-lg p-4 border">
      {/* Sender Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {t('shipment.senderDetails', 'Sender Details')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="senderName">
              {t('shipment.name', 'Name')} *
            </Label>
            <Input
              id="senderName"
              name="senderName"
              value={formData.senderName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="senderEmail">
              {t('shipment.email', 'Email')} *
            </Label>
            <Input
              id="senderEmail"
              name="senderEmail"
              type="email"
              value={formData.senderEmail}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="senderAddress">
            {t('shipment.address', 'Street Address')} *
          </Label>
          <Input
            id="senderAddress"
            name="senderAddress"
            value={formData.senderAddress}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="senderPostcode">
              {t('shipment.postcode', 'Postal Code')} *
            </Label>
            <Input
              id="senderPostcode"
              name="senderPostcode"
              value={formData.senderPostcode}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="senderCity">
              {t('shipment.city', 'City')} *
            </Label>
            <Input
              id="senderCity"
              name="senderCity"
              value={formData.senderCity}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="senderCountry">
            {t('shipment.country', 'Country')} *
          </Label>
          <Select 
            name="senderCountry" 
            value={formData.senderCountry}
            onValueChange={(value) => handleSelectChange("senderCountry", value)}
          >
            <SelectTrigger id="senderCountry">
              <SelectValue placeholder={t('shipment.selectCountry', 'Select Country')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Finland">Finland</SelectItem>
              <SelectItem value="Sweden">Sweden</SelectItem>
              <SelectItem value="Denmark">Denmark</SelectItem>
              <SelectItem value="Norway">Norway</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="senderPhoneCountryCode">
              {t('shipment.countryCode', 'Country Code')}
            </Label>
            <Select 
              name="senderPhoneCountryCode" 
              value={formData.senderPhoneCountryCode}
              onValueChange={(value) => handleSelectChange("senderPhoneCountryCode", value)}
            >
              <SelectTrigger id="senderPhoneCountryCode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+358">FI: +358</SelectItem>
                <SelectItem value="+46">SE: +46</SelectItem>
                <SelectItem value="+45">DK: +45</SelectItem>
                <SelectItem value="+47">NO: +47</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="senderPhoneNumber">
              {t('shipment.phoneNumber', 'Phone Number')} *
              <span className="block text-xs text-muted-foreground mt-1">
                {t('shipment.withoutFirstZero', 'Without the first zero')}
              </span>
            </Label>
            <Input
              id="senderPhoneNumber"
              name="senderPhoneNumber"
              value={formData.senderPhoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Recipient Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {t('shipment.recipientDetails', 'Recipient Details')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recipientName">
              {t('shipment.name', 'Name')} *
            </Label>
            <Input
              id="recipientName"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recipientEmail">
              {t('shipment.email', 'Email')}
              <span className="block text-xs text-muted-foreground mt-1">
                {t('shipment.recipientEmailInfo', 'The recipient will receive information about the order if this field is filled in')}
              </span>
            </Label>
            <Input
              id="recipientEmail"
              name="recipientEmail"
              type="email"
              value={formData.recipientEmail}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="recipientAddress">
            {t('shipment.address', 'Street Address')} *
          </Label>
          <Input
            id="recipientAddress"
            name="recipientAddress"
            value={formData.recipientAddress}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="recipientAddress2">
            {t('shipment.address2', 'Street Address 2')}
          </Label>
          <Input
            id="recipientAddress2"
            name="recipientAddress2"
            value={formData.recipientAddress2}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recipientPostcode">
              {t('shipment.postcode', 'Postal Code')} *
            </Label>
            <Input
              id="recipientPostcode"
              name="recipientPostcode"
              value={formData.recipientPostcode}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recipientCity">
              {t('shipment.city', 'City')} *
            </Label>
            <Input
              id="recipientCity"
              name="recipientCity"
              value={formData.recipientCity}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="recipientCountry">
            {t('shipment.country', 'Country')} *
          </Label>
          <Select 
            name="recipientCountry" 
            value={formData.recipientCountry}
            onValueChange={(value) => handleSelectChange("recipientCountry", value)}
          >
            <SelectTrigger id="recipientCountry">
              <SelectValue placeholder={t('shipment.selectCountry', 'Select Country')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Finland">Finland</SelectItem>
              <SelectItem value="Sweden">Sweden</SelectItem>
              <SelectItem value="Denmark">Denmark</SelectItem>
              <SelectItem value="Norway">Norway</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recipientPhoneCountryCode">
              {t('shipment.countryCode', 'Country Code')}
            </Label>
            <Select 
              name="recipientPhoneCountryCode" 
              value={formData.recipientPhoneCountryCode}
              onValueChange={(value) => handleSelectChange("recipientPhoneCountryCode", value)}
            >
              <SelectTrigger id="recipientPhoneCountryCode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+358">FI: +358</SelectItem>
                <SelectItem value="+46">SE: +46</SelectItem>
                <SelectItem value="+45">DK: +45</SelectItem>
                <SelectItem value="+47">NO: +47</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recipientPhoneNumber">
              {t('shipment.phoneNumber', 'Phone Number')} *
              <span className="block text-xs text-muted-foreground mt-1">
                {t('shipment.withoutFirstZero', 'Without the first zero')}
              </span>
            </Label>
            <Input
              id="recipientPhoneNumber"
              name="recipientPhoneNumber"
              value={formData.recipientPhoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Additional Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {t('shipment.additionalDetails', 'Additional Details')}
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="additionalInstructions">
            {t('shipment.additionalInstructions', 'Additional Instructions/Transport Instructions')}
          </Label>
          <Textarea
            id="additionalInstructions"
            name="additionalInstructions"
            value={formData.additionalInstructions}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reference">
            {t('shipment.reference', 'Reference (shown on invoice)')}
            <span className="block text-xs text-muted-foreground mt-1">
              {t('shipment.referenceRequired', 'Reference is required for import deliveries')}
            </span>
          </Label>
          <Input
            id="reference"
            name="reference"
            value={formData.reference}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="packageValue">
            {t('shipment.packageValue', 'Package Value (min 1 €)')} *
            <span className="block text-xs text-muted-foreground mt-1">
              {t('shipment.packageValueInfo', 'Package value is required for potential customs procedures. The value should match the commercial invoice.')}
            </span>
          </Label>
          <Input
            id="packageValue"
            name="packageValue"
            type="number"
            min="1"
            value={formData.packageValue}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="packageContents">
            {t('shipment.packageContents', 'Package Contents')}
            <span className="block text-xs text-muted-foreground mt-1">
              {t('shipment.englishRequired', 'Fill in the information in English if you are sending the package abroad')}
            </span>
          </Label>
          <Textarea
            id="packageContents"
            name="packageContents"
            value={formData.packageContents}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
      </div>
      
      <div className="pt-4">
        <button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          {t('shipment.continueToShipping', 'Continue to Shipping')}
        </button>
      </div>
    </form>
  );
};

export default ShipmentDetailsForm;
