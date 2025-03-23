
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressDetailsProps {
  senderName: string;
  setSenderName: (name: string) => void;
  senderEmail: string;
  setSenderEmail: (email: string) => void;
  senderPhone: string;
  setSenderPhone: (phone: string) => void;
  senderAddress: string;
  setSenderAddress: (address: string) => void;
  recipientName: string;
  setRecipientName: (name: string) => void;
  recipientEmail: string;
  setRecipientEmail: (email: string) => void;
  recipientPhone: string;
  setRecipientPhone: (phone: string) => void;
  recipientAddress: string;
  setRecipientAddress: (address: string) => void;
  pickupCountry: string;
  pickupPostalCode: string;
  deliveryCountry: string;
  deliveryPostalCode: string;
}

const AddressDetails: React.FC<AddressDetailsProps> = ({
  senderName, setSenderName,
  senderEmail, setSenderEmail,
  senderPhone, setSenderPhone,
  senderAddress, setSenderAddress,
  recipientName, setRecipientName,
  recipientEmail, setRecipientEmail,
  recipientPhone, setRecipientPhone,
  recipientAddress, setRecipientAddress,
  pickupCountry, pickupPostalCode,
  deliveryCountry, deliveryPostalCode
}) => {
  return (
    <>
      <div className="border rounded-lg mb-8">
        <div className="bg-slate-700 text-white p-3 font-semibold">
          Avsändare
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="senderName">Namn</Label>
              <Input
                id="senderName"
                placeholder="Avsändarens namn"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="senderPhone">Telefon</Label>
              <Input
                id="senderPhone"
                placeholder="Telefonnummer"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="senderEmail">E-post</Label>
            <Input
              id="senderEmail"
              type="email"
              placeholder="E-postadress"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="senderAddress">Adress</Label>
            <Input
              id="senderAddress"
              placeholder="Gatunamn, husnummer"
              value={senderAddress}
              onChange={(e) => setSenderAddress(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="senderPostalCode">Postnummer</Label>
              <Input
                id="senderPostalCode"
                value={pickupPostalCode}
                disabled
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="senderCountry">Land</Label>
              <Input
                id="senderCountry"
                value={pickupCountry}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg mb-8">
        <div className="bg-slate-700 text-white p-3 font-semibold">
          Mottagare
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Namn</Label>
              <Input
                id="recipientName"
                placeholder="Mottagarens namn"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipientPhone">Telefon</Label>
              <Input
                id="recipientPhone"
                placeholder="Telefonnummer"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recipientEmail">E-post</Label>
            <Input
              id="recipientEmail"
              type="email"
              placeholder="E-postadress"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recipientAddress">Adress</Label>
            <Input
              id="recipientAddress"
              placeholder="Gatunamn, husnummer"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipientPostalCode">Postnummer</Label>
              <Input
                id="recipientPostalCode"
                value={deliveryPostalCode}
                disabled
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipientCountry">Land</Label>
              <Input
                id="recipientCountry"
                value={deliveryCountry}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressDetails;
