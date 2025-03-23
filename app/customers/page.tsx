"use client"

import { useState } from "react"
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { format } from "date-fns"
import { Eye, MoreHorizontal, Search, User } from "lucide-react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data for customers (since we don't have a real endpoint)
const mockCustomers = [
  {
    id: "cust_001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    orders: 5,
    totalSpent: 349.95,
    lastOrder: "2023-03-15T10:30:00Z",
    createdAt: "2022-11-05T08:15:00Z",
  },
  {
    id: "cust_002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    orders: 12,
    totalSpent: 1249.5,
    lastOrder: "2023-03-20T14:45:00Z",
    createdAt: "2022-08-12T11:30:00Z",
  },
  {
    id: "cust_003",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "+1 (555) 456-7890",
    orders: 3,
    totalSpent: 189.97,
    lastOrder: "2023-02-28T09:15:00Z",
    createdAt: "2023-01-20T16:45:00Z",
  },
  {
    id: "cust_004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 234-5678",
    orders: 8,
    totalSpent: 729.85,
    lastOrder: "2023-03-18T12:00:00Z",
    createdAt: "2022-09-30T10:20:00Z",
  },
  {
    id: "cust_005",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    phone: "+1 (555) 876-5432",
    orders: 1,
    totalSpent: 59.99,
    lastOrder: "2023-03-10T15:30:00Z",
    createdAt: "2023-02-15T09:10:00Z",
  },
  {
    id: "cust_006",
    name: "Sarah Brown",
    email: "sarah.brown@example.com",
    phone: "+1 (555) 345-6789",
    orders: 15,
    totalSpent: 1875.25,
    lastOrder: "2023-03-22T11:45:00Z",
    createdAt: "2022-07-05T14:30:00Z",
  },
  {
    id: "cust_007",
    name: "David Miller",
    email: "david.miller@example.com",
    phone: "+1 (555) 765-4321",
    orders: 6,
    totalSpent: 459.94,
    lastOrder: "2023-03-05T10:15:00Z",
    createdAt: "2022-12-10T08:45:00Z",
  },
  {
    id: "cust_008",
    name: "Jennifer Taylor",
    email: "jennifer.taylor@example.com",
    phone: "+1 (555) 432-1098",
    orders: 9,
    totalSpent: 879.92,
    lastOrder: "2023-03-19T16:30:00Z",
    createdAt: "2022-10-25T13:20:00Z",
  },
]

function CustomersContent() {
  const [searchQuery, setSearchQuery] = useState("")

  // In a real app, you'd fetch from an API
  // Here we're simulating an API call with mock data
  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return mockCustomers
    },
  })

  const filteredCustomers = customers?.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery),
  )

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage and view customer information</p>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>{filteredCustomers?.length || 0} total customers</CardDescription>
            </div>
            <div className="flex w-full items-center sm:w-auto">
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search customers..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : filteredCustomers?.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No customers found</p>
              </div>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Last Order</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers?.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-sm text-muted-foreground">{customer.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{customer.email}</p>
                            <p className="text-sm text-muted-foreground">{customer.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{customer.orders}</TableCell>
                        <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                        <TableCell>{format(new Date(customer.lastOrder), "MMM d, yyyy")}</TableCell>
                        <TableCell>{format(new Date(customer.createdAt), "MMM d, yyyy")}</TableCell>
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
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                View orders
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function CustomersPage() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <CustomersContent />
    </QueryClientProvider>
  )
}

