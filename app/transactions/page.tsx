"use client"

import { useState } from "react"
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { format } from "date-fns"
import { Calendar, Download, Eye, MoreHorizontal, Search } from "lucide-react"

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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

// Mock data for transactions
const mockTransactions = [
  {
    id: "txn_001",
    orderId: "ORD-12345",
    customer: "John Doe",
    amount: 129.99,
    status: "Completed",
    paymentMethod: "Credit Card",
    date: "2023-03-15T10:30:00Z",
  },
  {
    id: "txn_002",
    orderId: "ORD-12346",
    customer: "Jane Smith",
    amount: 89.95,
    status: "Completed",
    paymentMethod: "PayPal",
    date: "2023-03-14T14:45:00Z",
  },
  {
    id: "txn_003",
    orderId: "ORD-12347",
    customer: "Robert Johnson",
    amount: 199.5,
    status: "Pending",
    paymentMethod: "Credit Card",
    date: "2023-03-14T09:15:00Z",
  },
  {
    id: "txn_004",
    orderId: "ORD-12348",
    customer: "Emily Davis",
    amount: 45.75,
    status: "Completed",
    paymentMethod: "Debit Card",
    date: "2023-03-13T12:00:00Z",
  },
  {
    id: "txn_005",
    orderId: "ORD-12349",
    customer: "Michael Wilson",
    amount: 299.99,
    status: "Failed",
    paymentMethod: "Credit Card",
    date: "2023-03-13T15:30:00Z",
  },
  {
    id: "txn_006",
    orderId: "ORD-12350",
    customer: "Sarah Brown",
    amount: 149.95,
    status: "Refunded",
    paymentMethod: "PayPal",
    date: "2023-03-12T11:45:00Z",
  },
  {
    id: "txn_007",
    orderId: "ORD-12351",
    customer: "David Miller",
    amount: 79.99,
    status: "Completed",
    paymentMethod: "Debit Card",
    date: "2023-03-12T10:15:00Z",
  },
  {
    id: "txn_008",
    orderId: "ORD-12352",
    customer: "Jennifer Taylor",
    amount: 159.95,
    status: "Completed",
    paymentMethod: "Credit Card",
    date: "2023-03-11T16:30:00Z",
  },
]

function TransactionsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)

  // In a real app, you'd fetch from an API
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return mockTransactions
    },
  })

  const filteredTransactions = transactions?.filter((transaction) => {
    const matchesSearch =
      transaction.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by date if selected
    if (date) {
      const transactionDate = new Date(transaction.date)
      const selectedDate = new Date(date)

      return (
        matchesSearch &&
        transactionDate.getDate() === selectedDate.getDate() &&
        transactionDate.getMonth() === selectedDate.getMonth() &&
        transactionDate.getFullYear() === selectedDate.getFullYear()
      )
    }

    return matchesSearch
  })

  const handleViewDetails = (transaction: any) => {
    setSelectedTransaction(transaction)
    setIsDetailsDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge variant="success">{status}</Badge>
      case "Pending":
        return <Badge variant="warning">{status}</Badge>
      case "Failed":
        return <Badge variant="destructive">{status}</Badge>
      case "Refunded":
        return <Badge variant="secondary">{status}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">View and manage payment transactions</p>
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Filter by date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>{filteredTransactions?.length || 0} total transactions</CardDescription>
            </div>
            <div className="flex w-full items-center sm:w-auto">
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
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
            ) : filteredTransactions?.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No transactions found</p>
                {date && (
                  <Button variant="link" onClick={() => setDate(undefined)} className="mt-2">
                    Clear date filter
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions?.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.orderId}</TableCell>
                        <TableCell>{transaction.customer}</TableCell>
                        <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>{transaction.paymentMethod}</TableCell>
                        <TableCell>{format(new Date(transaction.date), "MMM d, yyyy")}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleViewDetails(transaction)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download receipt
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

      {/* Transaction Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>View detailed transaction information</DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
                  <p className="font-medium">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                  <p className="font-medium">{selectedTransaction.orderId}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedTransaction.customer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p className="font-medium">${selectedTransaction.amount.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{selectedTransaction.paymentMethod}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                <p className="font-medium">{format(new Date(selectedTransaction.date), "PPP p")}</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Close
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

export default function TransactionsPage() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <TransactionsContent />
    </QueryClientProvider>
  )
}

