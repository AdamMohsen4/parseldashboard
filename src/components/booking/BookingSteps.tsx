
import React from 'react';

interface BookingStepsProps {
  currentStep: number;
}

const BookingSteps: React.FC<BookingStepsProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          {step > 1 && <div className="flex-1 h-px bg-border"></div>}
          <div className="flex flex-col items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
              currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              <span className="text-xs font-bold">{step}</span>
            </div>
            <span className={`text-sm mt-1 ${
              currentStep >= step ? 'font-medium' : 'text-muted-foreground'
            }`}>
              {step === 1 ? 'Overview' : 
               step === 2 ? 'Package Details' : 
               step === 3 ? 'Address' : 'Payment'}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default BookingSteps;
