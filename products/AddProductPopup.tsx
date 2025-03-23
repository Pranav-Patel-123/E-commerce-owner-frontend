"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import dynamic from "next/dynamic"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Lazy load the Add Category page as a modal
const AddCategoryPopup = dynamic(() => import("../categories/page"), { ssr: false })

export default function AddProductPopup({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([])
  const [showAddCategory, setShowAddCategory] = useState(false)

  const [product, setProduct] = useState({
    name: "",
    price: 0,
    quantity: 0,
    category: "",
    brand: "",
    images: [] as File[], // Updated to store multiple images
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

  const createProduct = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post(`${API_URL}/products/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      onClose()
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProduct((prev) => ({
        ...prev,
        images: Array.from(e.target.files), // Store multiple images
      }))
    }
  }

  const handleSubmit = () => {
    if (product.images.length === 0) {
      alert("Please select at least one image!")
      return
    }

    const formData = new FormData()
    formData.append("name", product.name)
    formData.append("price", String(product.price))
    formData.append("quantity", String(product.quantity))

    // Send category name instead of ID
    const selectedCategory = categories.find((cat) => cat._id === product.category)
    formData.append("category", selectedCategory ? selectedCategory.name : product.category)

    formData.append("brand", product.brand)

    // Append multiple images
    product.images.forEach((image) => {
      formData.append("images", image)
    })

    createProduct.mutate(formData)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Product</h2>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          className="p-2 border rounded w-full mb-2"
          value={product.name}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          className="p-2 border rounded w-full mb-2"
          value={product.price}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          className="p-2 border rounded w-full mb-2"
          value={product.quantity}
          onChange={handleInputChange}
        />

        {/* Category Dropdown */}
        <select
          name="category"
          className="p-2 border rounded w-full mb-2"
          value={product.category}
          onChange={handleInputChange}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
          <option value="add-new">Add New</option>
        </select>

        {/* Open Add Category Popup if "Add New" is selected */}
        {product.category === "add-new" && <AddCategoryPopup onClose={() => setShowAddCategory(false)} />}

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          className="p-2 border rounded w-full mb-2"
          value={product.brand}
          onChange={handleInputChange}
        />

        {/* Multiple Image Upload */}
        <input
          type="file"
          accept="image/*"
          multiple
          className="p-2 border rounded w-full mb-2"
          onChange={handleImageChange}
        />

        {/* Show selected images preview */}
        {product.images.length > 0 && (
          <div className="mb-2 flex gap-2 flex-wrap">
            {product.images.map((img, index) => (
              <div key={index} className="w-16 h-16 border rounded overflow-hidden">
                <img src={URL.createObjectURL(img)} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Add
          </button>
          <button onClick={onClose} className="text-gray-500">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

