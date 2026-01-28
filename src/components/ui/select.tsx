import * as React from "react"

import { cn } from "@/lib/utils"

type SelectContextValue = {
  open: boolean
  value?: string
  selectedLabel?: string
  placeholder?: string
  setOpen: (open: boolean) => void
  select: (value: string, label?: string) => void
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

export type SelectProps = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  children: React.ReactNode
}

export function Select({
  value: controlledValue,
  defaultValue,
  onValueChange,
  placeholder,
  children,
}: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | undefined
  >(defaultValue)
  const [selectedLabel, setSelectedLabel] = React.useState<string | undefined>()

  const value = controlledValue ?? uncontrolledValue

  const select = React.useCallback(
    (nextValue: string, label?: string) => {
      if (controlledValue === undefined) {
        setUncontrolledValue(nextValue)
      }
      setSelectedLabel(label ?? nextValue)
      onValueChange?.(nextValue)
      setOpen(false)
    },
    [controlledValue, onValueChange],
  )

  const ctx: SelectContextValue = {
    open,
    value,
    selectedLabel,
    placeholder,
    setOpen,
    select,
  }

  return (
    <SelectContext.Provider value={ctx}>{children}</SelectContext.Provider>
  )
}

function useSelectContext(component: string) {
  const ctx = React.useContext<SelectContextValue | null>(SelectContext)
  if (!ctx) {
    throw new Error(`${component} must be used within a Select`)
  }
  return ctx
}

export interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectTriggerProps
>(({ className, children, ...props }, ref) => {
  const { open, setOpen } = useSelectContext("SelectTrigger")
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      aria-haspopup="listbox"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <svg
        aria-hidden
        className="ml-2 h-4 w-4 shrink-0 text-muted-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

export type SelectValueProps = {
  placeholder?: string
  className?: string
}

export function SelectValue({ placeholder: ph, className }: SelectValueProps) {
  const { selectedLabel, value, placeholder } = useSelectContext("SelectValue")
  const display = selectedLabel ?? value ?? ph ?? placeholder
  return (
    <span className={cn("truncate text-left", className)}>
      {display ?? ""}
    </span>
  )
}

export interface SelectContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open } = useSelectContext("SelectContent")
    if (!open) return null
    return (
      <div
        ref={ref}
        role="listbox"
        className={cn(
          "relative mt-2 w-full rounded-md border border-input bg-popover text-popover-foreground shadow-md",
          className,
        )}
        {...props}
      >
        <div className="max-h-64 overflow-y-auto py-1">{children}</div>
      </div>
    )
  },
)
SelectContent.displayName = "SelectContent"

export interface SelectItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: current, select } = useSelectContext("SelectItem")
    const isActive = current === value

    return (
      <button
        ref={ref}
        role="option"
        aria-selected={isActive}
        className={cn(
          "flex w-full cursor-pointer items-center justify-start px-3 py-2 text-sm outline-none transition-colors hover:bg-muted focus:bg-muted",
          isActive && "font-medium text-foreground",
          className,
        )}
        onClick={() => select(value, typeof children === "string" ? children : undefined)}
        {...props}
      >
        {children}
        {isActive && (
          <svg
            aria-hidden
            className="ml-auto h-4 w-4 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
    )
  },
)
SelectItem.displayName = "SelectItem"
