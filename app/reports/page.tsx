"use client"

import { useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Download, FileText, Filter, Printer } from "lucide-react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data for reports
const monthlySalesData = [
  { name: "Jan", sales: 65000 },
  { name: "Feb", sales: 59000 },
  { name: "Mar", sales: 80000 },
  { name: "Apr", sales: 81000 },
  { name: "May", sales: 56000 },
  { name: "Jun", sales: 55000 },
  { name: "Jul", sales: 40000 },
  { name: "Aug", sales: 60000 },
  { name: "Sep", sales: 70000 },
  { name: "Oct", sales: 90000 },
  { name: "Nov", sales: 85000 },
  { name: "Dec", sales: 110000 },
]

const categoryData = [
  { name: "Power Tools", value: 35 },
  { name: "Hand Tools", value: 25 },
  { name: "Hardware", value: 20 },
  { name: "Plumbing", value: 10 },
  { name: "Electrical", value: 10 },
]

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316"]

const topSellingProducts = [
  { id: 1, name: "Power Drill - 18V", category: "Power Tools", sales: 156, revenue: 12480 },
  { id: 2, name: "Hammer - 16oz", category: "Hand Tools", sales: 142, revenue: 2840 },
  { id: 3, name: "Screwdriver Set - 12pc", category: "Hand Tools", sales: 137, revenue: 4110 },
  { id: 4, name: 'Circular Saw - 7.25"', category: "Power Tools", sales: 98, revenue: 14700 },
  { id: 5, name: "Measuring Tape - 25ft", category: "Hand Tools", sales: 95, revenue: 1425 },
  { id: 6, name: "Wrench Set - 10pc", category: "Hand Tools", sales: 87, revenue: 3480 },
  { id: 7, name: "Drill Bit Set - 29pc", category: "Power Tools", sales: 82, revenue: 2460 },
  { id: 8, name: 'Pliers - 8"', category: "Hand Tools", sales: 76, revenue: 1140 },
  { id: 9, name: "Nail Gun - Pneumatic", category: "Power Tools", sales: 68, revenue: 8160 },
  { id: 10, name: 'Level - 48"', category: "Hand Tools", sales: 65, revenue: 1950 },
]

export default function ReportsPage() {
  const [period, setPeriod] = useState("yearly")
  const [reportType, setReportType] = useState("sales")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Generate and view detailed reports for your business</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales Report</SelectItem>
              <SelectItem value="inventory">Inventory Report</SelectItem>
              <SelectItem value="customers">Customer Report</SelectItem>
            </SelectContent>
          </Select>

          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Monthly sales for the current year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlySalesData}
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
                        formatter={(value) => [`$${value}`, "Sales"]}
                      />
                      <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

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
                  <CardTitle>Monthly Growth</CardTitle>
                  <CardDescription>Sales growth trend over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlySalesData}
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
                          formatter={(value) => [`$${value}`, "Sales"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="sales"
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
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Products with the highest sales volume</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Units Sold</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topSellingProducts.map((product, index) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.sales}</TableCell>
                        <TableCell className="text-right">${product.revenue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Sales performance by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryData}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 100,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis type="category" dataKey="name" className="text-xs" width={80} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                        }}
                        formatter={(value) => [`${value}%`, "Percentage"]}
                      />
                      <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]}>
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Reports</CardTitle>
                <CardDescription>Access comprehensive reports for your business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { title: "Sales Summary", icon: FileText, description: "Complete sales breakdown by period" },
                    {
                      title: "Inventory Valuation",
                      icon: FileText,
                      description: "Current value of all inventory items",
                    },
                    { title: "Customer Acquisition", icon: FileText, description: "New customer growth and retention" },
                    { title: "Product Performance", icon: FileText, description: "Detailed analysis of product sales" },
                    { title: "Profit & Loss", icon: FileText, description: "Financial performance overview" },
                    { title: "Tax Report", icon: FileText, description: "Sales tax collected by jurisdiction" },
                  ].map((report, index) => (
                    <Card key={index} className="cursor-pointer hover:bg-muted/50">
                      <CardHeader className="flex flex-row items-center justify-between p-4">
                        <CardTitle className="text-base">{report.title}</CardTitle>
                        <report.icon className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                        <Button variant="link" className="mt-2 h-auto p-0 text-sm">
                          Generate Report
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

