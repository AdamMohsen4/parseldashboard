
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  postfix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, postfix, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center", className)}>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            postfix && "rounded-r-none border-r-0",
            className
          )}
          ref={ref}
          {...props}
        />
        {postfix && (
          <span className="flex h-10 items-center rounded-r-md border border-input bg-muted px-3 text-sm text-muted-foreground">
            {postfix}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
