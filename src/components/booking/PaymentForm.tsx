
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
  onPaymentComplete: (paymentData: {
    method: 'swish' | 'ebanking' | 'card';
    details: any;
    termsAccepted: boolean;
  }) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  totalPrice,
  onPaymentComplete,
  onCancel
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'swish' | 'ebanking' | 'card'>('swish');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [swishNumber, setSwishNumber] = useState('46735765336');
  const [bankName, setBankName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!termsAccepted) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    if (paymentMethod === 'card') {
      if (!cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (cardNumber.replace(/\s/g, '').length !== 16 || !/^\d+$/.test(cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      if (!expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }
      
      if (!cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(cvv)) {
        newErrors.cvv = 'Please enter a valid CVV (3-4 digits)';
      }
      
      if (!cardholderName.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      }
    } else if (paymentMethod === 'swish') {
      if (!swishNumber.trim()) {
        newErrors.swishNumber = 'Swish number is required';
      } else if (!/^\d{8,12}$/.test(swishNumber.replace(/\s/g, ''))) {
        newErrors.swishNumber = 'Please enter a valid Swish number';
      }
    } else if (paymentMethod === 'ebanking') {
      if (!bankName) {
        newErrors.bankName = 'Please select your bank';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      // Prepare payment details based on selected method
      let details = {};
      
      switch (paymentMethod) {
        case 'card':
          details = {
            cardNumber,
            expiryDate,
            cvv,
            cardholderName
          };
          break;
        case 'swish':
          details = {
            swishNumber
          };
          break;
        case 'ebanking':
          details = {
            bankName
          };
          break;
      }
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Payment processed successfully!');
      onPaymentComplete({
        method: paymentMethod,
        details,
        termsAccepted
      });
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
        Payment - {totalPrice.toFixed(2)}€
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment methods</h2>
          
          <div className="space-y-2">
            <RadioGroup 
              defaultValue="swish" 
              value={paymentMethod}
              onValueChange={(value) => {
                setPaymentMethod(value as 'swish' | 'ebanking' | 'card');
                setErrors({});
              }}
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
                    className={`pl-10 ${errors.swishNumber ? 'border-red-500' : ''}`}
                    maxLength={12}
                  />
                </div>
                {errors.swishNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.swishNumber}</p>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3 text-sm text-blue-700">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Swish Information</p>
                  <p>You will receive a Swish payment request to your mobile phone. Accept the payment in your Swish app to complete the transaction.</p>
                  <p className="mt-2 font-medium">Payment will be sent to: +46 735 765 336</p>
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
                {errors.bankName && (
                  <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
                )}
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
                    className={`pl-10 ${errors.cardNumber ? 'border-red-500' : ''}`}
                    maxLength={19}
                  />
                </div>
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                )}
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
                      className={`pl-10 ${errors.expiryDate ? 'border-red-500' : ''}`}
                      maxLength={5}
                    />
                  </div>
                  {errors.expiryDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                  )}
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
                      className={`pl-10 ${errors.cvv ? 'border-red-500' : ''}`}
                      maxLength={4}
                    />
                  </div>
                  {errors.cvv && (
                    <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="John Doe"
                  className={errors.cardholderName ? 'border-red-500' : ''}
                />
                {errors.cardholderName && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>
                )}
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
                className={`text-sm ${errors.terms ? 'text-red-500' : 'text-muted-foreground'}`}
              >
                I accept the {' '}
                <a href="#" className="text-blue-600 hover:underline">terms and conditions</a> and I have read the {' '}
                <a href="#" className="text-blue-600 hover:underline">privacy statement</a>
              </Label>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
              )}
            </div>
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
              className="bg-orange-500 hover:bg-orange-600 text-white min-w-[150px]"
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
                `Pay ${totalPrice.toFixed(2)}€`
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default PaymentForm;
