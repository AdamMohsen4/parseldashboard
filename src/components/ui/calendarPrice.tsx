import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function CalendarPrice({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
  
      classNames={{
        months: "flex flex-col sm:flex-row gap-6 w-full", 
        month: "space-y-4 shadow-md rounded-lg overflow-hidden", 
        caption: "flex justify-between items-center py-3 px-5 bg-slate-50 border-b", 
        caption_label: "text-base font-bold text-slate-700", 
        nav: "flex items-center space-x-2", 
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-white text-slate-600 border-slate-200 rounded-full hover:bg-slate-100 transition-all"
        ),
        nav_button_previous: "", 
        nav_button_next: "", 
        table: "w-full border-collapse", 
        head_row: "bg-slate-100", 
        head_cell: "text-slate-500 font-semibold w-14 text-xs uppercase py-2", 
        row: " w-full border-b last:border-b-0 border-slate-200", 
        cell: "h-14 w-16 text-center text-sm relative", 
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-12 w-12 p-0 font-medium rounded-md text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all"
        ),
        day_range_end: "bg-primary text-white rounded-r-md", 
        day_selected: "bg-primary text-white font-bold hover:bg-primary-dark", 
        day_today: "border border-primary text-primary font-semibold", 
        day_outside: "text-slate-400 opacity-60", 
        day_disabled: "text-slate-300 opacity-50 cursor-not-allowed", 
        day_range_middle: "bg-slate-100 text-slate-700", 
        day_hidden: "invisible", 
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-6 w-6 text-slate-600" />, 
        IconRight: ({ ..._props }) => <ChevronRight className="h-6 w-6 text-slate-600" />, 
      }}
      {...props}
    />
  );
}

CalendarPrice.displayName = "CalendarPrice";

export { CalendarPrice };