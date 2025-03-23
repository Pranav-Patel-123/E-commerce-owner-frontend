"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { format } from "date-fns"
import { Eye, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface OrderItem {
  product_id: string
  name: string
  price: number
  quantity: number
}

interface Order {
  _id: string
  order_id: string
  customer_id: string
  items: OrderItem[]
  total_price: number
  status: string
  created_at: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/orders`)
        if (response.status === 200) {
          // Sort by date (newest first) and take only the first 5
          const sortedOrders = response.data
            .sort((a: Order, b: Order) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5)
          setOrders(sortedOrders)
        }
      } catch (err) {
        console.error("Failed to fetch orders", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "warning"
      case "shipped":
        return "info"
      case "delivered":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const viewOrderDetails = (orderId: string) => {
    router.push(`/orders/${orderId}`)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push("/orders")}>
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : orders.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">No orders found</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">{order.order_id}</TableCell>
                  <TableCell>{order.customer_id}</TableCell>
                  <TableCell>{format(new Date(order.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>${order.total_price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => viewOrderDetails(order.order_id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

