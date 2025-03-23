
import React from 'react';

interface BookingStepsProps {
  currentStep: number;
}

const BookingSteps: React.FC<BookingStepsProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        <span className="text-xs font-bold">1</span>
      </div>
      <h2 className={`text-sm ${currentStep >= 1 ? 'font-medium' : 'text-muted-foreground'}`}>Overview</h2>
      
      <div className="flex-1 flex items-center gap-4">
        <div className="flex-1 h-px bg-border"></div>
        
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
          <span className="text-xs font-bold">2</span>
        </div>
        <span className={`text-sm ${currentStep >= 2 ? 'font-medium' : 'text-muted-foreground'}`}>Package Details</span>

        <div className="flex-1 flex items-center gap-4">
        <div className="flex-1 h-px bg-border"></div>
        
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= 3? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
          <span className="text-xs font-bold">3</span>
        </div>
        <span className={`text-sm ${currentStep >= 3 ? 'font-medium' : 'text-muted-foreground'}`}>Address</span>
      </div>

      <div className="flex-1 flex items-center gap-4">
        <div className="flex-1 h-px bg-border"></div>
        
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= 4? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
          <span className="text-xs font-bold">4</span>
        </div>
        <span className={`text-sm ${currentStep >= 4 ? 'font-medium' : 'text-muted-foreground'}`}>Payment</span>
      </div>
      </div>
    </div>
  );
};

export default BookingSteps;
