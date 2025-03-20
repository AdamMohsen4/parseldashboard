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
      className={cn("p-10", className)} // Increased padding
      classNames={{
        months: "flex flex-col sm:flex-row space-y-12 sm:space-x-12 sm:space-y-0", // Increased spacing
        month: "space-y-14", // Increased spacing
        caption: "flex justify-center pt-8 relative items-center", // Increased padding
        caption_label: "text-2xl font-bold", // Increased font size
        nav: "space-x-5 flex items-center", // Increased spacing
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-14 w-14 bg-transparent p-0 opacity-50 hover:opacity-100" // Increased button size
        ),
        nav_button_previous: "absolute left-5", // Adjusted position
        nav_button_next: "absolute right-5", // Adjusted position
        table: "w-full border-collapse space-y-5", // Increased spacing
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-16 font-medium text-xl", // Increased font size and cell width
        row: "flex w-full mt-6", // Increased spacing
        cell: "h-16 w-16 text-center text-2xl p-0 relative", // Increased cell size and font size
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-16 w-16 p-0 font-bold aria-selected:opacity-100" // Increased day size and font weight
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
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-10 w-10" />, // Increased icon size
        IconRight: ({ ..._props }) => <ChevronRight className="h-10 w-10" />, // Increased icon size
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
