"use client"

import { useState } from "react"
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import axios from "axios"
import { AlertCircle, ArrowUpDown, Edit, MoreHorizontal, Package, Search, Truck } from "lucide-react"

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
import { useToast } from "@/components/ui/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Since we don't have a real inventory endpoint, we'll create mock data based on products
function InventoryContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0)
  const [adjustmentReason, setAdjustmentReason] = useState("")

  const { toast } = useToast()

  // Fetch products and transform them into inventory items
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products/products`)

        // Transform products into inventory items with additional inventory-specific fields
        return data.map((product: any) => ({
          ...product,
          stockStatus: product.quantity > 10 ? "In Stock" : product.quantity > 0 ? "Low Stock" : "Out of Stock",
          reorderPoint: Math.floor(Math.random() * 5) + 5, // Random reorder point between 5-10
          lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 30 days
        }))
      } catch (error) {
        console.error("Error fetching products for inventory:", error)
        return []
      }
    },
  })

  const filteredInventory = products?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.stockStatus.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAdjustInventory = (product: any) => {
    setSelectedProduct(product)
    setAdjustmentQuantity(0)
    setAdjustmentReason("")
    setIsAdjustDialogOpen(true)
  }

  const submitAdjustment = () => {
    // In a real app, you'd call an API to adjust inventory
    toast({
      title: "Inventory Updated",
      description: `Adjusted ${selectedProduct.name} by ${adjustmentQuantity > 0 ? "+" : ""}${adjustmentQuantity} units`,
      variant: "success",
    })

    setIsAdjustDialogOpen(false)
    // Refetch products to simulate the update
    setTimeout(() => refetch(), 500)
  }

  const getStockStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Badge variant="success">{status}</Badge>
      case "Low Stock":
        return <Badge variant="warning">{status}</Badge>
      case "Out of Stock":
        return <Badge variant="destructive">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">Track and manage your product inventory</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sync Inventory
            </Button>
            <Button>
              <Truck className="mr-2 h-4 w-4" />
              Create Purchase Order
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Across all categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">
                {products?.filter((p) => p.quantity > 0 && p.quantity <= 10).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Items that need reordering soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {products?.filter((p) => p.quantity <= 0).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Items that need immediate attention</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>Monitor stock levels and manage inventory</CardDescription>
            </div>
            <div className="flex w-full items-center sm:w-auto">
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search inventory..."
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
            ) : isError ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Failed to load inventory data</p>
                <Button variant="outline" className="mt-4" onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            ) : filteredInventory?.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No inventory items found</p>
              </div>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reorder Point</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory?.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          {item.images && item.images.length > 0 ? (
                            <img
                              src={item.images[0] || "/placeholder.svg"}
                              alt={item.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          {item.category ? (
                            <Badge variant="outline">{item.category}</Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{getStockStatusBadge(item.stockStatus)}</TableCell>
                        <TableCell>{item.reorderPoint}</TableCell>
                        <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleAdjustInventory(item)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Adjust Stock
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <AlertCircle className="mr-2 h-4 w-4" />
                                Set Reorder Point
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Truck className="mr-2 h-4 w-4" />
                                Create Purchase Order
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

      {/* Adjust Inventory Dialog */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Inventory</DialogTitle>
            <DialogDescription>Update the stock quantity for {selectedProduct?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <div className="font-medium">Current Stock:</div>
              <div>{selectedProduct?.quantity}</div>
            </div>

            <div className="space-y-2">
              <label htmlFor="adjustment" className="text-sm font-medium">
                Adjustment Amount
              </label>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setAdjustmentQuantity((prev) => prev - 1)}>
                  -
                </Button>
                <Input
                  id="adjustment"
                  type="number"
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(Number.parseInt(e.target.value) || 0)}
                  className="text-center"
                />
                <Button variant="outline" size="icon" onClick={() => setAdjustmentQuantity((prev) => prev + 1)}>
                  +
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                New stock level will be: {(selectedProduct?.quantity || 0) + adjustmentQuantity}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason for Adjustment
              </label>
              <Input
                id="reason"
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                placeholder="e.g., New shipment, Damaged goods, etc."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAdjustDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitAdjustment}>Save Adjustment</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

export default function InventoryPage() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <InventoryContent />
    </QueryClientProvider>
  )
}

