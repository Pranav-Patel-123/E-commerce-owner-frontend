"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Category {
  _id: string
  name: string
}

interface ProductFormProps {
  product?: {
    _id: string
    name: string
    price: number
    quantity: number
    description?: string
    category?: string
    brand?: string
    images?: string[]
  }
  onClose: () => void
  mode: "create" | "edit"
}

export function ProductForm({ product, onClose, mode }: ProductFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    quantity: product?.quantity || 0,
    description: product?.description || "",
    category: product?.category || "",
    brand: product?.brand || "",
  })

  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>(product?.images || [])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/category/categories`)
        setCategories(response.data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        })
      }
    }

    fetchCategories()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? Number.parseFloat(value) : value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))

      // Create preview URLs
      const newImageUrls = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setImageUrls((prev) => [...prev, ...newImageUrls])
    }
  }

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
    if (index < images.length) {
      setImages((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataObj = new FormData()
      formDataObj.append("name", formData.name)
      formDataObj.append("price", formData.price.toString())
      formDataObj.append("quantity", formData.quantity.toString())

      if (formData.description) {
        formDataObj.append("description", formData.description)
      }

      if (formData.category) {
        // Find the category name if we have the ID
        const selectedCategory = categories.find((cat) => cat._id === formData.category)
        formDataObj.append("category", selectedCategory ? selectedCategory.name : formData.category)
      }

      if (formData.brand) {
        formDataObj.append("brand", formData.brand)
      }

      // Append images
      images.forEach((image) => {
        formDataObj.append("images", image)
      })

      // For edit mode, we might need to handle existing images differently
      if (mode === "edit" && product?._id) {
        // In a real app, you might need to send existing image URLs
        // This depends on your API implementation
        await axios.put(`${API_URL}/products/products/${product._id}`, formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        })

        toast({
          title: "Success",
          description: "Product updated successfully",
          variant: "success",
        })
      } else {
        await axios.post(`${API_URL}/products/products`, formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        })

        toast({
          title: "Success",
          description: "Product created successfully",
          variant: "success",
        })
      }

      queryClient.invalidateQueries({ queryKey: ["products"] })
      onClose()
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" name="brand" value={formData.brand} onChange={handleInputChange} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="images">Product Images</Label>
          <Input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="cursor-pointer"
          />

          {imageUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative rounded-md border bg-muted">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Product ${index + 1}`}
                    className="aspect-square h-full w-full rounded-md object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "edit" ? "Updating..." : "Creating..."}
            </>
          ) : mode === "edit" ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </Button>
      </div>
    </form>
  )
}

