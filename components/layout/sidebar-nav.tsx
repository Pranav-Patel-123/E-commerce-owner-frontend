"use client"

import { usePathname } from "next/navigation"
import {
  BarChart3,
  Box,
  CircleDollarSign,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  PenToolIcon as Tool,
  Users,
} from "lucide-react"

import { Sidebar, SidebarHeader, SidebarItem, SidebarSection, SidebarFooter, useSidebar } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SidebarNav() {
  const pathname = usePathname()
  const { expanded } = useSidebar()
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "Ponnam Hardware"

  return (
    <Sidebar>
      <SidebarHeader>
        <div className={`flex items-center gap-2 ${expanded ? "" : "justify-center"}`}>
          <Tool className="h-6 w-6 text-primary" />
          {expanded && <span className="text-xl font-bold">{shopName}</span>}
        </div>
      </SidebarHeader>

      <div className="flex flex-col gap-2 px-2 py-4">
        <SidebarItem
          href="/dashboard"
          icon={<LayoutDashboard className="h-5 w-5" />}
          active={pathname === "/dashboard"}
        >
          Dashboard
        </SidebarItem>

        <SidebarSection>
          <div className={`mb-2 px-3 text-xs font-medium text-muted-foreground ${expanded ? "" : "sr-only"}`}>
            Catalog
          </div>
          <SidebarItem href="/products" icon={<Package className="h-5 w-5" />} active={pathname === "/products"}>
            Products
          </SidebarItem>
          <SidebarItem href="/categories" icon={<Tag className="h-5 w-5" />} active={pathname === "/categories"}>
            Categories
          </SidebarItem>
          <SidebarItem href="/inventory" icon={<Box className="h-5 w-5" />} active={pathname === "/inventory"}>
            Inventory
          </SidebarItem>
        </SidebarSection>

        <SidebarSection>
          <div className={`mb-2 px-3 text-xs font-medium text-muted-foreground ${expanded ? "" : "sr-only"}`}>
            Sales
          </div>
          <SidebarItem
            href="/orders"
            icon={<ShoppingCart className="h-5 w-5" />}
            active={pathname === "/orders"}
            badge={5}
          >
            Orders
          </SidebarItem>
          <SidebarItem href="/customers" icon={<Users className="h-5 w-5" />} active={pathname === "/customers"}>
            Customers
          </SidebarItem>
          <SidebarItem
            href="/transactions"
            icon={<CircleDollarSign className="h-5 w-5" />}
            active={pathname === "/transactions"}
          >
            Transactions
          </SidebarItem>
        </SidebarSection>

        <SidebarSection>
          <div className={`mb-2 px-3 text-xs font-medium text-muted-foreground ${expanded ? "" : "sr-only"}`}>
            Insights
          </div>
          <SidebarItem href="/analytics" icon={<BarChart3 className="h-5 w-5" />} active={pathname === "/analytics"}>
            Analytics
          </SidebarItem>
          <SidebarItem href="/reports" icon={<FileText className="h-5 w-5" />} active={pathname === "/reports"}>
            Reports
          </SidebarItem>
        </SidebarSection>

        <SidebarSection>
          <div className={`mb-2 px-3 text-xs font-medium text-muted-foreground ${expanded ? "" : "sr-only"}`}>
            Settings
          </div>
          <SidebarItem href="/settings" icon={<Settings className="h-5 w-5" />} active={pathname === "/settings"}>
            Settings
          </SidebarItem>
          <SidebarItem href="/users" icon={<Users className="h-5 w-5" />} active={pathname === "/users"}>
            Users
          </SidebarItem>
        </SidebarSection>
      </div>

      <SidebarFooter>
        {expanded ? (
          <div className="flex items-center gap-3 px-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
              <AvatarFallback>PH</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin User</span>
              <span className="text-xs text-muted-foreground">admin@ponnamhardware.com</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
              <AvatarFallback>PH</AvatarFallback>
            </Avatar>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

