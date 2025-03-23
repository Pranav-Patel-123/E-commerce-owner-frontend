import type { LucideIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const statCardVariants = cva("", {
  variants: {
    variant: {
      default: "border-border",
      primary: "border-primary/20 bg-primary/5",
      success: "border-green-500/20 bg-green-500/5",
      warning: "border-yellow-500/20 bg-yellow-500/5",
      danger: "border-red-500/20 bg-red-500/5",
      info: "border-blue-500/20 bg-blue-500/5",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const iconVariants = cva("h-5 w-5", {
  variants: {
    variant: {
      default: "text-muted-foreground",
      primary: "text-primary",
      success: "text-green-500",
      warning: "text-yellow-500",
      danger: "text-red-500",
      info: "text-blue-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface StatCardProps extends VariantProps<typeof statCardVariants> {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ title, value, icon: Icon, description, trend, variant, className }: StatCardProps) {
  return (
    <Card className={cn(statCardVariants({ variant }), className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn(iconVariants({ variant }))} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && (
          <div className="mt-1 flex items-center text-xs">
            <span className={cn("mr-1", trend.isPositive ? "text-green-500" : "text-red-500")}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground">vs. last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

