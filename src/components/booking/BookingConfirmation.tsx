import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Download, Truck, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import LabelLanguageSelector from "@/components/labels/LabelLanguageSelector";

interface BookingConfirmationProps {
  bookingResult: any;
  carrier: {
    name: string;
    eta: string;
    price: number;
  };
  canCancelBooking: boolean;
  labelLanguage: string;
  setLabelLanguage: (language: string) => void;
  isGeneratingLabel: boolean;
  handleGenerateLabel: () => void;
  handleCancelBooking: () => void;
  onBookAnother: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingResult,
  carrier,
  canCancelBooking,
  labelLanguage,
  setLabelLanguage,
  isGeneratingLabel,
  handleGenerateLabel,
  handleCancelBooking,
  onBookAnother
}) => {
  return (
    <Card className="max-w-4xl mx-auto">
      <div className="bg-slate-700 text-white p-3 font-semibold">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Booking Confirmed
        </div>
      </div>
      
      <CardContent className="p-6 space-y-6">
        <div className="bg-slate-50 p-6 rounded-lg border">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-slate-200 p-3 rounded-md">
              <Truck className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-medium">Your shipment is booked!</h2>
              <p className="text-sm text-slate-500">Tracking code: {bookingResult?.trackingCode || bookingResult?.tracking_code}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Carrier</p>
              <p className="text-lg font-medium">{bookingResult?.carrier_name || carrier.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Total Price</p>
              <p className="text-lg font-medium">€{bookingResult?.totalPrice || bookingResult?.total_price}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Estimated Delivery</p>
              <p className="text-lg font-medium">{carrier.eta}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Status</p>
              <p className="text-lg font-medium text-green-600">Pending</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium mb-4">Shipping Label</h3>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <LabelLanguageSelector 
                  value={labelLanguage}
                  onChange={setLabelLanguage}
                />
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleGenerateLabel}
                disabled={isGeneratingLabel}
              >
                <Download className="h-4 w-4" />
                {isGeneratingLabel ? "Generating..." : "Generate & Download Label"}
              </Button>
            </div>
          </div>
        </div>
        
        {canCancelBooking && (
          <div className="bg-slate-50 p-6 rounded-lg border">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-slate-200 p-3 rounded-md">
                <XCircle className="h-6 w-6 text-slate-700" />
              </div>
              <div>
                <h3 className="font-medium">Need to cancel?</h3>
                <p className="text-sm text-slate-500">
                  You can cancel this booking until:
                  <span className="font-medium block">
                    {new Date(bookingResult.cancellationDeadline || bookingResult.cancellation_deadline).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleCancelBooking}
            >
              Cancel Booking
            </Button>
          </div>
        )}
        
        <div className="flex justify-between gap-4 pt-4">
          <Button
            variant="outline"
            asChild
          >
            <Link to="/dashboard">View All Shipments</Link>
          </Button>
          <Button 
            onClick={onBookAnother}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Book Another Shipment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingConfirmation;
