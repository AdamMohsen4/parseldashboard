
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

interface DateRangeSelectorProps {
  onExport: (startDate: string, endDate: string) => Promise<void>;
  isLoading: boolean;
}

const DateRangeSelector = ({ onExport, isLoading }: DateRangeSelectorProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const handleExport = async () => {
    if (!startDate || !endDate) {
      return;
    }
    
    // Format dates as YYYY-MM-DD strings
    const startStr = format(startDate, "yyyy-MM-dd");
    const endStr = format(endDate, "yyyy-MM-dd");
    
    await onExport(startStr, endStr);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">From:</span>
        <Popover open={startOpen} onOpenChange={setStartOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-[140px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "MMM dd, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => {
                setStartDate(date);
                setStartOpen(false);
                // If end date is before start date, update it
                if (endDate && date && date > endDate) {
                  setEndDate(date);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">To:</span>
        <Popover open={endOpen} onOpenChange={setEndOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-[140px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "MMM dd, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => {
                setEndDate(date);
                setEndOpen(false);
              }}
              disabled={(date) => 
                (startDate ? date < startDate : false) || 
                date > new Date()
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button 
        onClick={handleExport} 
        disabled={!startDate || !endDate || isLoading}
        className="ml-0 sm:ml-2"
      >
        {isLoading ? "Exporting..." : "Export to Excel"}
      </Button>
    </div>
  );
};

export default DateRangeSelector;
