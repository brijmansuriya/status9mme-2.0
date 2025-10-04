import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
    disabled?: boolean
    className?: string
    id?: string
    size?: "sm" | "md" | "lg"
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ className, checked = false, onCheckedChange, disabled = false, id, size = "md", ...props }, ref) => {
        const handleClick = () => {
            if (!disabled && onCheckedChange) {
                onCheckedChange(!checked)
            }
        }

        const handleKeyDown = (event: React.KeyboardEvent) => {
            if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault()
                handleClick()
            }
        }

        const sizeClasses = {
            sm: "h-4 w-7",
            md: "h-6 w-11",
            lg: "h-8 w-14"
        }

        const thumbSizeClasses = {
            sm: "h-3 w-3",
            md: "h-5 w-5",
            lg: "h-6 w-6"
        }

        const translateClasses = {
            sm: checked ? "translate-x-3" : "translate-x-0",
            md: checked ? "translate-x-5" : "translate-x-0",
            lg: checked ? "translate-x-6" : "translate-x-0"
        }

        return (
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-labelledby={id}
                disabled={disabled}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                className={cn(
                    "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 ease-in-out",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    sizeClasses[size],
                    checked
                        ? "bg-blue-600 shadow-inner"
                        : "bg-gray-200 dark:bg-gray-700",
                    className
                )}
                ref={ref}
                {...props}
            >
                <span
                    className={cn(
                        "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out",
                        thumbSizeClasses[size],
                        translateClasses[size]
                    )}
                />
            </button>
        )
    }
)

Switch.displayName = "Switch"

export { Switch }
