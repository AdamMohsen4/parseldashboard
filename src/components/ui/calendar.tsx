import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
  
      classNames={{
        months: "flex flex-col sm:flex-row gap-4", 
        month: "space-y-4", 
        caption: "flex justify-between items-center py-2 px-4 bg-gray-100 rounded-md", 
        caption_label: "text-sm font-semibold", 
        nav: "flex items-center space-x-2", 
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all"
        ),
        nav_button_previous: "", 
        nav_button_next: "", 
        table: "w-full border-collapse", 
        head_row: "flex", 
        head_cell: "text-gray-600 font-medium w-9 text-xs uppercase", 
        row: "flex w-full", 
        cell: "h-10 w-10 text-center text-sm relative", 
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-medium rounded-md transition-all hover:bg-gray-200"
        ),
        day_range_end: "rounded-r-md", 
        day_selected: "bg-primary text-white font-bold hover:bg-primary-dark", 
        day_today: "border border-primary text-primary font-bold", 
        day_outside: "text-gray-400 opacity-50", 
        day_disabled: "text-gray-300 opacity-50 cursor-not-allowed", 
        day_range_middle: "bg-gray-100 text-gray-700", 
        day_hidden: "invisible", 
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-5 w-5 text-gray-600" />, 
        IconRight: ({ ..._props }) => <ChevronRight className="h-5 w-5 text-gray-600" />, 
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
