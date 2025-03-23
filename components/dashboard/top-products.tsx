"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { ArrowRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Product {
  _id: string
  name: string
  price: number
  quantity: number
  sales?: number
  percentage?: number
}

export function TopProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/products`)
        if (response.status === 200) {
          // In a real app, you'd have actual sales data
          // Here we're simulating it based on available data
          const productsWithSales = response.data.map((product: Product) => ({
            ...product,
            sales: Math.floor(Math.random() * 100) + 1, // Random sales between 1-100
          }))

          // Sort by sales and take top 5
          const sortedProducts = productsWithSales
            .sort((a: Product, b: Product) => (b.sales || 0) - (a.sales || 0))
            .slice(0, 5)

          // Calculate percentage for progress bar
          const maxSales = Math.max(...sortedProducts.map((p) => p.sales || 0))
          const productsWithPercentage = sortedProducts.map((product) => ({
            ...product,
            percentage: Math.round(((product.sales || 0) / maxSales) * 100),
          }))

          setProducts(productsWithPercentage)
        }
      } catch (err) {
        console.error("Failed to fetch products", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Your best-selling products this month</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          View all
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">No products found</p>
        ) : (
          <div className="space-y-6">
            {products.map((product) => (
              <div key={product._id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${product.price.toFixed(2)} • {product.sales} sold
                    </p>
                  </div>
                  <p className="font-medium">${(product.price * (product.sales || 0)).toFixed(2)}</p>
                </div>
                <Progress value={product.percentage} className="h-2" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

