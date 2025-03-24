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
        // Set a larger minimum height for the entire calendar
        months: "flex flex-col sm:flex-row gap-6 w-full min-h-[500px] bg-prima ",
        month: "space-y-4 shadow-md rounded-lg overflow-hidden",
        caption: "flex justify-between items-center py-3 px-5 bg-slate-50 border-b",
        caption_label: "text-base font-bold ",
        nav: "flex items-center space-x-2",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-10 w-10 bg-white text-slate-600 border-slate-200 rounded-full hover:bg-slate-100 transition-all"
        ),
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse table-fixed",
        head_row: "bg-primary",
        head_cell:
          "text-slate-500 font-semibold text-xs uppercase py-3 text-white",
        row: "table-row border-b last:border-b-0 border-slate-200",
        // Increase row height
        cell: "table-cell h-20 text-center text-sm relative",
        // Increase the size of the day buttons
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-16 w-16 p-0 font-medium rounded-md  hover:bg-slate-100 hover:text-slate-900 transition-all mx-auto"
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
        IconLeft: (props) => <ChevronLeft {...props} className="h-6 w-6 text-slate-600" />,
        IconRight: (props) => <ChevronRight {...props} className="h-6 w-6 text-slate-600" />,
      }}
      {...props}
    />
  );
}

CalendarPrice.displayName = "CalendarPrice";

export { CalendarPrice };
