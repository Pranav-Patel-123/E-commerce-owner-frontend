"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_COLLAPSED = "4rem"

type SidebarContext = {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultExpanded?: boolean
}

function SidebarProvider({ children, defaultExpanded = true }: SidebarProviderProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // Toggle sidebar with keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "[" && (e.metaKey || e.ctrlKey)) {
        setExpanded((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded, mobileOpen, setMobileOpen }}>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  )
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

function Sidebar({ children, className, ...props }: SidebarProps) {
  const { expanded, mobileOpen, setMobileOpen } = useSidebar()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-20 h-full border-r bg-background transition-all duration-300 ease-in-out",
          expanded ? "w-[16rem]" : "w-[4rem]",
          "hidden md:block",
          className,
        )}
        {...props}
      >
        {children}
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[80%] max-w-[16rem]">
          <div className="h-full">{children}</div>
        </SheetContent>
      </Sheet>
    </>
  )
}

function SidebarTrigger() {
  const { setMobileOpen } = useSidebar()

  return (
    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}>
      <PanelLeft className="h-5 w-5" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}

function SidebarToggle() {
  const { expanded, setExpanded } = useSidebar()

  return (
    <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setExpanded(!expanded)}>
      <PanelLeft className={cn("h-5 w-5 transition-transform", !expanded && "rotate-180")} />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}

const sidebarItemVariants = cva(
  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors relative",
  {
    variants: {
      variant: {
        default: "hover:bg-accent hover:text-accent-foreground",
        active: "bg-primary/10 text-primary hover:bg-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

interface SidebarItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  icon: React.ReactNode
  active?: boolean
  href: string
  children: React.ReactNode
  badge?: number
}

function SidebarItem({ icon, active, href, children, badge, className, ...props }: SidebarItemProps) {
  const { expanded } = useSidebar()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={href}
          className={cn(sidebarItemVariants({ variant: active ? "active" : "default" }), "h-10", className)}
          {...props}
        >
          <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
          <span className={cn("flex-1 truncate", !expanded && "hidden")}>{children}</span>
          {badge !== undefined && badge > 0 && (
            <span
              className={cn(
                "flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground",
                !expanded && "absolute right-2 top-1",
              )}
            >
              {badge}
            </span>
          )}
        </a>
      </TooltipTrigger>
      {!expanded && (
        <TooltipContent side="right" className="flex items-center gap-4">
          {children}
          {badge !== undefined && badge > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {badge}
            </span>
          )}
        </TooltipContent>
      )}
    </Tooltip>
  )
}

function SidebarSection({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-3 py-2", className)} {...props}>
      {children}
    </div>
  )
}

function SidebarHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded } = useSidebar()

  return (
    <div className={cn("flex h-14 items-center border-b px-3", className)} {...props}>
      {children}
    </div>
  )
}

function SidebarFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-auto border-t p-3", className)} {...props}>
      {children}
    </div>
  )
}

export {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarToggle,
  SidebarItem,
  SidebarSection,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
}

