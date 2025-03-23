"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import dynamic from "next/dynamic"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Lazy load the Add Category page as a modal
const AddCategoryPopup = dynamic(() => import("../categories/page"), { ssr: false })

type Product = {
  _id: string
  name: string
  price: number
  quantity: number
  images?: string[]
  category?: string
  brand?: string
}

export default function UpdateProductPopup({ product, onClose }: { product: Product; onClose: () => void }) {
  const queryClient = useQueryClient()
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([])
  const [showAddCategory, setShowAddCategory] = useState(false)

  const [updatedProduct, setUpdatedProduct] = useState<Product>({
    ...product,
    images: product.images || [], // Ensure images is always an array
  })

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/category/categories`)
        setCategories(response.data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const updateProduct = useMutation({
    mutationFn: (updatedData: Product) => axios.put(`${API_URL}/products/products/${updatedData._id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      onClose()
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setUpdatedProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedProduct((prev) => ({
      ...prev,
      images: e.target.value.split(",").map((img) => img.trim()), // Keep images updated in array format
    }))
  }

  const removeImage = (index: number) => {
    setUpdatedProduct((prev) => {
      const newImages = prev.images ? prev.images.filter((_, i) => i !== index) : []
      return { ...prev, images: newImages }
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Update Product</h2>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          className="p-2 border rounded w-full mb-2"
          value={updatedProduct.name}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          className="p-2 border rounded w-full mb-2"
          value={updatedProduct.price}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          className="p-2 border rounded w-full mb-2"
          value={updatedProduct.quantity}
          onChange={handleInputChange}
        />

        {/* Display existing images */}
        {updatedProduct.images && updatedProduct.images.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Existing Images:</p>
            <div className="flex flex-wrap gap-2">
              {updatedProduct.images.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} alt={`Product ${index + 1}`} className="w-16 h-16 object-cover rounded-md" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Display the image URLs in the input field */}
        <input
          type="text"
          name="images"
          placeholder="New Image URLs (comma-separated)"
          className="p-2 border rounded w-full mb-2"
          value={updatedProduct.images?.join(", ") || ""}
          onChange={handleImageChange}
        />

        {/* Category Dropdown */}
        <select
          name="category"
          className="p-2 border rounded w-full mb-2"
          value={updatedProduct.category || ""}
          onChange={handleInputChange}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
          <option value="add-new">Add New</option>
        </select>

        {/* Open Add Category Popup if "Add New" is selected */}
        {updatedProduct.category === "add-new" && <AddCategoryPopup onClose={() => setShowAddCategory(false)} />}

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          className="p-2 border rounded w-full mb-2"
          value={updatedProduct.brand || ""}
          onChange={handleInputChange}
        />

        <div className="flex justify-end">
          <button
            onClick={() => updateProduct.mutate(updatedProduct)}
            className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
          >
            Update
          </button>
          <button onClick={onClose} className="text-gray-500">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

