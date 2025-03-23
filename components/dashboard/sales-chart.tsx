"use client"

import { useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data
const dailyData = [
  { name: "Mon", sales: 4000, orders: 24 },
  { name: "Tue", sales: 3000, orders: 18 },
  { name: "Wed", sales: 2000, orders: 12 },
  { name: "Thu", sales: 2780, orders: 19 },
  { name: "Fri", sales: 1890, orders: 14 },
  { name: "Sat", sales: 2390, orders: 20 },
  { name: "Sun", sales: 3490, orders: 22 },
]

const weeklyData = [
  { name: "Week 1", sales: 18000, orders: 120 },
  { name: "Week 2", sales: 16000, orders: 100 },
  { name: "Week 3", sales: 14000, orders: 90 },
  { name: "Week 4", sales: 22000, orders: 140 },
]

const monthlyData = [
  { name: "Jan", sales: 65000, orders: 420 },
  { name: "Feb", sales: 59000, orders: 380 },
  { name: "Mar", sales: 80000, orders: 510 },
  { name: "Apr", sales: 81000, orders: 520 },
  { name: "May", sales: 56000, orders: 360 },
  { name: "Jun", sales: 55000, orders: 350 },
  { name: "Jul", sales: 40000, orders: 250 },
  { name: "Aug", sales: 60000, orders: 380 },
  { name: "Sep", sales: 70000, orders: 450 },
  { name: "Oct", sales: 90000, orders: 580 },
  { name: "Nov", sales: 85000, orders: 540 },
  { name: "Dec", sales: 110000, orders: 700 },
]

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-primary">Sales: ${payload[0].value as number}</p>
        <p className="text-sm text-muted-foreground">Orders: {payload[1].value as number}</p>
      </div>
    )
  }

  return null
}

export function SalesChart() {
  const [period, setPeriod] = useState("monthly")

  const data = period === "daily" ? dailyData : period === "weekly" ? weeklyData : monthlyData

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Compare sales and orders over time</CardDescription>
          </div>
          <Tabs defaultValue="monthly" value={period} onValueChange={setPeriod}>
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="sales" name="Sales ($)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="orders" name="Orders" fill="#c4b5fd" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

