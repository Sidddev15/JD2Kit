import * as React from "react"
import { cn } from "@/lib/utils"

type AccordionContextValue = {
  openValues: Set<string>
  toggle: (value: string) => void
  type: "single" | "multiple"
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple"
  defaultValue?: string | string[]
}

export function Accordion({
  className,
  children,
  type = "single",
  defaultValue,
  ...props
}: AccordionProps) {
  const initial = React.useMemo(() => {
    if (type === "single") {
      return new Set(typeof defaultValue === "string" ? [defaultValue] : [])
    }
    return new Set(Array.isArray(defaultValue) ? defaultValue : [])
  }, [defaultValue, type])

  const [openValues, setOpenValues] = React.useState<Set<string>>(initial)

  const toggle = React.useCallback(
    (value: string) => {
      setOpenValues((prev) => {
        const next = new Set(prev)
        if (type === "single") {
          if (prev.has(value)) next.clear()
          else {
            next.clear()
            next.add(value)
          }
        } else {
          if (next.has(value)) next.delete(value)
          else next.add(value)
        }
        return next
      })
    },
    [type],
  )

  return (
    <AccordionContext.Provider value={{ openValues, toggle, type }}>
      <div className={cn("w-full space-y-2", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

function useAccordion(component: string) {
  const ctx = React.useContext(AccordionContext)
  if (!ctx) throw new Error(`${component} must be used within <Accordion>`)
  return ctx
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const { openValues } = useAccordion("AccordionItem")
  const open = openValues.has(value)

  return (
    <div
      data-state={open ? "open" : "closed"}
      className={cn("rounded-md border bg-card", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string
}

export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ className, children, value, ...props }, ref) => {
  const { openValues, toggle } = useAccordion("AccordionTrigger")
  const isOpen = value ? openValues.has(value) : false

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex w-full items-center justify-between gap-2 px-4 py-3 text-sm font-medium transition hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      onClick={() => value && toggle(value)}
      {...props}
    >
      {children}
      <span className={cn("ml-2 transition-transform", isOpen ? "rotate-90" : "rotate-0")}>
        ▸
      </span>
    </button>
  )
})
AccordionTrigger.displayName = "AccordionTrigger"

export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, value, ...props }, ref) => {
    const { openValues } = useAccordion("AccordionContent")
    const open = value ? openValues.has(value) : false
    if (!open) return null

    return (
      <div
        ref={ref}
        className={cn("px-4 pb-4 text-sm text-muted-foreground", className)}
        {...props}
      >
        {children}
      </div>
    )
  },
)
AccordionContent.displayName = "AccordionContent"
