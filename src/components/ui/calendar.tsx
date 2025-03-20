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
      className={cn("p-8", className)} // Further increased padding
      classNames={{
        months: "flex flex-col sm:flex-row space-y-10 sm:space-x-10 sm:space-y-0", // Further increased spacing
        month: "space-y-12", // Further increased spacing
        caption: "flex justify-center pt-6 relative items-center", // Further increased padding
        caption_label: "text-xl font-bold", // Further increased font size
        nav: "space-x-4 flex items-center", // Further increased spacing
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-12 w-12 bg-transparent p-0 opacity-50 hover:opacity-100" // Further increased button size
        ),
        nav_button_previous: "absolute left-4", // Adjusted position
        nav_button_next: "absolute right-4", // Adjusted position
        table: "w-full border-collapse space-y-4", // Further increased spacing
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-14 font-medium text-lg", // Further increased font size and cell width
        row: "flex w-full mt-5", // Further increased spacing
        cell: "h-14 w-14 text-center text-xl p-0 relative", // Further increased cell size and font size
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-14 w-14 p-0 font-bold aria-selected:opacity-100" // Further increased day size and font weight
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-8 w-8" />, // Further increased icon size
        IconRight: ({ ..._props }) => <ChevronRight className="h-8 w-8" />, // Further increased icon size
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
