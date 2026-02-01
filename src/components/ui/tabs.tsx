import * as React from "react"
import { cn } from "@/lib/utils"

type TabsContextValue = {
  value: string
  setValue: (v: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export function Tabs({ value, defaultValue, onValueChange, children, className, ...props }: TabsProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? "")
  const current = value !== undefined ? value : internal

  const setValue = React.useCallback(
    (next: string) => {
      if (value === undefined) setInternal(next)
      onValueChange?.(next)
    },
    [value, onValueChange],
  )

  return (
    <TabsContext.Provider value={{ value: current, setValue }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function useTabs(component: string) {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error(`${component} must be used within <Tabs>`)
  return ctx
}

export const TabsList = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
)

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: current, setValue } = useTabs("TabsTrigger")
    const active = current === value
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          active
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
          className,
        )}
        onClick={() => setValue(value)}
        {...props}
      >
        {children}
      </button>
    )
  },
)
TabsTrigger.displayName = "TabsTrigger"

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: current } = useTabs("TabsContent")
    if (current !== value) return null
    return (
      <div
        ref={ref}
        className={cn("mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
        {...props}
      >
        {children}
      </div>
    )
  },
)
TabsContent.displayName = "TabsContent"
