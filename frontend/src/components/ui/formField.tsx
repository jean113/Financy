import { Label } from "./label"
import { Input } from "./input"
import { cn } from "@/lib/utils"
import { forwardRef, useState } from "react"
import type { LucideIcon } from "lucide-react"

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helper?: string
  icon?: LucideIcon,
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helper, icon: Icon, className, id, ...props }, ref) => {
    const [focused, setFocused] = useState(false)

    return (
      <div className="space-y-1">
        <Label
          htmlFor={id}
          className={cn(
            "text-sm transition-colors",
            focused && !error && "text-brand-base",
            error && "text-red-500"
          )}
        >
          {label}
        </Label>
        <div className="relative">
          {Icon && (
            <Icon
              size={18}
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
                !error && focused && "text-brand-base",
                !error && !focused && "text-gray-500",
                error && "text-red-500"
              )}
            />
          )}
          <Input
            id={id}
            ref={ref}
            className={cn(
              "h-12 focus-visible:ring-0 focus-visible:border-input",
              Icon && "pl-10",
              className
            )}
            onFocus={(e) => {
              setFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />
        </div>
        {helper && !error && <span className="text-gray-500 text-xs">{helper}</span>}
      </div>
    )
  }
)

FormField.displayName = "FormField"