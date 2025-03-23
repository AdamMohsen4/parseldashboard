
import React from 'react';
import { getCountryName } from '@/lib/utils';

interface BookingSummaryProps {
  senderName: string;
  senderAddress: string;
  pickupPostalCode: string;
  pickupCountry: string;
  recipientName: string;
  recipientAddress: string;
  deliveryPostalCode: string;
  deliveryCountry: string;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  senderName,
  senderAddress,
  pickupPostalCode,
  pickupCountry,
  recipientName,
  recipientAddress,
  deliveryPostalCode,
  deliveryCountry
}) => {
  return (
    <div className="bg-slate-50 p-6 rounded-lg border">
      <h3 className="text-lg font-medium mb-4">Sammanfattning</h3>
      
      <div className="flex items-start gap-4">
        <div className="bg-slate-200 p-3 rounded-md">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-700">
            <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12L20 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12L4 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 flex-1">
          <div>
            <p className="font-medium">Från</p>
            <p>{senderName}</p>
            <p>{pickupPostalCode}</p>
            <p>{senderAddress || "Stockholm"}</p>
            <p>{getCountryName(pickupCountry)}</p>
          </div>
          
          <div>
            <p className="font-medium">Till</p>
            <p>{recipientName}</p>
            <p>{deliveryPostalCode}</p>
            <p>{recipientAddress || "Helsinki"}</p>
            <p>{getCountryName(deliveryCountry)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
