"use client"

import { CircleDollarSign, Package, ShoppingCart, Users } from "lucide-react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatCard } from "@/components/dashboard/stat-card"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { TopProducts } from "@/components/dashboard/top-products"

export default function DashboardPage() {
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "Ponnam Hardware"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your {shopName} dashboard</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value="$45,231.89"
            icon={CircleDollarSign}
            description="Total revenue this month"
            trend={{ value: 12.5, isPositive: true }}
            variant="primary"
          />
          <StatCard
            title="Orders"
            value="356"
            icon={ShoppingCart}
            description="Total orders this month"
            trend={{ value: 8.2, isPositive: true }}
            variant="info"
          />
          <StatCard
            title="Products"
            value="124"
            icon={Package}
            description="Active products"
            trend={{ value: 2.1, isPositive: true }}
            variant="success"
          />
          <StatCard
            title="Customers"
            value="832"
            icon={Users}
            description="Total customers"
            trend={{ value: 5.4, isPositive: true }}
            variant="warning"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SalesChart />
          <TopProducts />
        </div>

        <RecentOrders />
      </div>
    </DashboardLayout>
  )
}

