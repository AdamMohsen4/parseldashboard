
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  LockKeyhole,
  ChevronsUpDown
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentFormProps {
  totalPrice: number;
  onPaymentComplete: () => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  totalPrice,
  onPaymentComplete,
  onCancel
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'invoice'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    }
    
    setIsProcessing(true);
    
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
        <Tabs defaultValue="card" onValueChange={(v) => setPaymentMethod(v as 'card' | 'invoice')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Kreditkort</span>
            </TabsTrigger>
            <TabsTrigger value="invoice" className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 5L2 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 5V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 5V3C9 2.46957 9.21071 1.96086 9.58579 1.58579C9.96086 1.21071 10.4696 1 11 1H13C13.5304 1 14.0391 1.21071 14.4142 1.58579C14.7893 1.96086 15 2.46957 15 3V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 12L14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Faktura</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Kortnummer</Label>
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
                  <Label htmlFor="expiryDate">Utgångsdatum</Label>
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
                <Label htmlFor="cardholderName">Kortinnehavarens namn</Label>
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
                  <p className="font-medium">Säker betalning</p>
                  <p>All betalningsinformation är krypterad och säker.</p>
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
                  className="bg-green-600 hover:bg-green-700 text-white min-w-[150px]"
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
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Pay {totalPrice.toFixed(2)}€
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="invoice">
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-md flex items-start gap-3 text-sm text-amber-700">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Faktura information</p>
                  <p>En faktura kommer att skickas till din e-postadress inom 24 timmar efter leverans.</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-post för faktura</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefonnummer</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+46 123 456 789"
                    />
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-md flex items-start gap-3 text-sm text-green-700">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">14 dagars betalningstid</p>
                    <p>Du har 14 dagar på dig att betala fakturan från det datum du tar emot den.</p>
                  </div>
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
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700 text-white min-w-[150px]"
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
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 5L2 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 5V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 5V3C9 2.46957 9.21071 1.96086 9.58579 1.58579C9.96086 1.21071 10.4696 1 11 1H13C13.5304 1 14.0391 1.21071 14.4142 1.58579C14.7893 1.96086 15 2.46957 15 3V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 12L14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Pay with Invoice
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default PaymentForm;
