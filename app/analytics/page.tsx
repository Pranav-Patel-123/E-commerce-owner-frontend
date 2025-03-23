"use client"

import { useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for charts
const salesData = [
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

const categoryData = [
  { name: "Electronics", value: 35 },
  { name: "Clothing", value: 25 },
  { name: "Home & Kitchen", value: 20 },
  { name: "Books", value: 10 },
  { name: "Other", value: 10 },
]

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316"]

const trafficData = [
  { name: "Direct", value: 40 },
  { name: "Organic Search", value: 30 },
  { name: "Social Media", value: 15 },
  { name: "Referral", value: 10 },
  { name: "Email", value: 5 },
]

const conversionData = [
  { name: "Jan", rate: 2.5 },
  { name: "Feb", rate: 2.8 },
  { name: "Mar", rate: 3.2 },
  { name: "Apr", rate: 3.5 },
  { name: "May", rate: 3.1 },
  { name: "Jun", rate: 3.0 },
  { name: "Jul", rate: 2.9 },
  { name: "Aug", rate: 3.3 },
  { name: "Sep", rate: 3.6 },
  { name: "Oct", rate: 3.8 },
  { name: "Nov", rate: 4.0 },
  { name: "Dec", rate: 4.2 },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("yearly")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">View detailed insights about your store</p>
        </div>

        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Sales Overview</CardTitle>
                    <CardDescription>Monthly sales and orders</CardDescription>
                  </div>
                  <Tabs defaultValue="yearly" value={period} onValueChange={setPeriod}>
                    <TabsList>
                      <TabsTrigger value="monthly">Monthly</TabsTrigger>
                      <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                      <TabsTrigger value="yearly">Yearly</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData}
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
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="sales" name="Sales ($)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="orders" name="Orders" fill="#c4b5fd" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="orders" name="Orders" fill="#c4b5fd" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>Monthly conversion rate percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={conversionData}
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
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                        }}
                        formatter={(value) => [`${value}%`, "Conversion Rate"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Distribution of sales across product categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                          }}
                          formatter={(value) => [`${value}%`, "Percentage"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>Where your customers are coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={trafficData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {trafficData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                          }}
                          formatter={(value) => [`${value}%`, "Percentage"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>New customer acquisitions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData}
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
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        name="New Customers"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

