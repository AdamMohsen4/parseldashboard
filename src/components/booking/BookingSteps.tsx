
import React from 'react';

// Define step labels as a constant to avoid recreating on each render
const STEP_LABELS = ['Overview', 'Package Details', 'Address', 'Payment'];

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
              {STEP_LABELS[step-1]}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default React.memo(BookingSteps);
