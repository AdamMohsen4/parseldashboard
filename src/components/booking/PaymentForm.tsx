import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CreditCard, 
  AlertCircle, 
  Calendar, 
  LockKeyhole,
  Smartphone,
  Building2,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentFormProps {
  totalPrice: number;
  onPaymentComplete: () => void;
  onCancel: () => void;
  onSubmit: (paymentData: PaymentData) => void;
}

export interface PaymentData {
  paymentMethod: 'swish' | 'ebanking' | 'card';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  swishNumber?: string;
  bankName?: string;
  termsAccepted: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  totalPrice,
  onPaymentComplete,
  onCancel,
  onSubmit
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'swish' | 'ebanking' | 'card'>('swish');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [swishNumber, setSwishNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      toast.error('You must accept the terms and conditions to continue');
      return;
    }

    // Simple validation
    if (paymentMethod === 'card') {
      if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        toast.error('Please fill in all card details');
        return;
      }
      
      // Basic card number validation (16 digits)
      if (cardNumber.replace(/\s/g, '').length !== 16 || !/^\d+$/.test(cardNumber.replace(/\s/g, ''))) {
        toast.error('Please enter a valid card number');
        return;
      }
      
      // Basic expiry date validation (MM/YY)
      if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        toast.error('Please enter a valid expiry date (MM/YY)');
        return;
      }
      
      // Basic CVV validation (3-4 digits)
      if (!/^\d{3,4}$/.test(cvv)) {
        toast.error('Please enter a valid CVV code');
        return;
      }
    } else if (paymentMethod === 'swish') {
      if (!swishNumber) {
        toast.error('Please enter your Swish number');
        return;
      }
      
      // Basic Swish number validation (10 digits)
      if (!/^\d{10}$/.test(swishNumber.replace(/\s/g, ''))) {
        toast.error('Please enter a valid Swish number (10 digits)');
        return;
      }
    } else if (paymentMethod === 'ebanking') {
      if (!bankName) {
        toast.error('Please select your bank');
        return;
      }
    }
    
    setIsProcessing(true);
    
    // Create payment data object
    const paymentData: PaymentData = {
      paymentMethod,
      termsAccepted,
      cardNumber: paymentMethod === 'card' ? cardNumber : undefined,
      expiryDate: paymentMethod === 'card' ? expiryDate : undefined,
      cardholderName: paymentMethod === 'card' ? cardholderName : undefined,
      swishNumber: paymentMethod === 'swish' ? swishNumber : undefined,
      bankName: paymentMethod === 'ebanking' ? bankName : undefined,
    };
    
    // Send the payment data to the parent component
    onSubmit(paymentData);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Payment processed successfully!');
      onPaymentComplete();
    }, 2000);
  };
  
  // Format card number with spaces every 4 digits
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  return (
    <Card className="border rounded-lg mb-8">
      <div className="bg-slate-700 text-white p-3 font-semibold">
        Betalning - {totalPrice.toFixed(2)}€
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment methods</h2>
          
          <div className="space-y-2">
            <RadioGroup 
              defaultValue="swish" 
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as 'swish' | 'ebanking' | 'card')}
              className="gap-3"
            >
              <div className={`flex items-center space-x-2 border p-4 rounded-md ${paymentMethod === 'swish' ? 'border-primary' : 'border-gray-200'}`}>
                <RadioGroupItem value="swish" id="swish" />
                <Label htmlFor="swish" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  <span>Swish</span>
                </Label>
              </div>
              
              <div className={`flex items-center space-x-2 border p-4 rounded-md ${paymentMethod === 'ebanking' ? 'border-primary' : 'border-gray-200'}`}>
                <RadioGroupItem value="ebanking" id="ebanking" />
                <Label htmlFor="ebanking" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span>eBanking</span>
                </Label>
              </div>
              
              <div className={`flex items-center space-x-2 border p-4 rounded-md ${paymentMethod === 'card' ? 'border-primary' : 'border-gray-200'}`}>
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span>Card payment</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
          
        <form onSubmit={handleSubmit} className="space-y-4">
          {paymentMethod === 'swish' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="swishNumber">Swish Number</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="swishNumber"
                    type="tel"
                    value={swishNumber}
                    onChange={(e) => setSwishNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="07X XXX XX XX"
                    className="pl-10"
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3 text-sm text-blue-700">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Swish Information</p>
                  <p>You will receive a Swish payment request to your mobile phone. Accept the payment in your Swish app to complete the transaction.</p>
                </div>
              </div>
            </div>
          )}
          
          {paymentMethod === 'ebanking' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankSelection">Select Your Bank</Label>
                <RadioGroup 
                  value={bankName}
                  onValueChange={setBankName}
                  className="grid grid-cols-2 gap-3"
                >
                  {['Nordea', 'SEB', 'Handelsbanken', 'Swedbank', 'Danske Bank', 'Länsförsäkringar'].map((bank) => (
                    <div key={bank} className={`flex items-center space-x-2 border p-3 rounded-md ${bankName === bank ? 'border-primary' : 'border-gray-200'}`}>
                      <RadioGroupItem value={bank} id={`bank-${bank}`} />
                      <Label htmlFor={`bank-${bank}`} className="cursor-pointer">{bank}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3 text-sm text-blue-700">
                <ExternalLink className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Bank Information</p>
                  <p>You will be redirected to your bank's website to complete the payment.</p>
                </div>
              </div>
            </div>
          )}
          
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="4111 1111 1111 1111"
                    className="pl-10"
                    maxLength={19}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="expiryDate"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      placeholder="MM/YY"
                      className="pl-10"
                      maxLength={5}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="cvv"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      className="pl-10"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3 text-sm text-blue-700">
                <LockKeyhole className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Secure Payment</p>
                  <p>All payment information is encrypted and secure.</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex items-start gap-2">
            <Checkbox 
              id="terms" 
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="terms"
                className="text-sm text-muted-foreground"
              >
                I accept the {' '}
                <a href="#" className="text-blue-600 hover:underline">terms and conditions</a> and I have read the {' '}
                <a href="#" className="text-blue-600 hover:underline">privacy statement</a>
              </Label>
            </div>
          </div>
          
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <ul className="list-disc ml-5 space-y-1">
              <li>Domestic parcel services</li>
              <li>Letter services and international parcels</li>
              <li>General delivery conditions</li>
            </ul>
          </div>
          
          <div className="flex justify-between gap-4 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Previous
            </Button>
            
            <Button 
              type="submit"
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white min-w-[7rem]"
              onClick={handleSubmit}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                `Pay (${totalPrice.toFixed(2)}€)`
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default PaymentForm;
