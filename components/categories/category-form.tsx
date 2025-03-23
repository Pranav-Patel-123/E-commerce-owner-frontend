"use client"

import type React from "react"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface CategoryFormProps {
  category?: {
    _id?: string
    name: string
    description?: string
    image?: string
  }
  onClose: () => void
  mode: "create" | "edit"
}

export function CategoryForm({ category, onClose, mode }: CategoryFormProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
  })

  const [image, setImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(category?.image || null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    setPreviewImage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataObj = new FormData()
      formDataObj.append("name", formData.name)

      if (formData.description) {
        formDataObj.append("description", formData.description)
      }

      if (image) {
        formDataObj.append("image", image)
      }

      if (mode === "edit" && category?._id) {
        await axios.put(`${API_URL}/category/categories/${category._id}`, formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        })

        toast({
          title: "Success",
          description: "Category updated successfully",
          variant: "success",
        })
      } else {
        await axios.post(`${API_URL}/category/categories`, formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        })

        toast({
          title: "Success",
          description: "Category created successfully",
          variant: "success",
        })
      }

      queryClient.invalidateQueries({ queryKey: ["categories"] })
      onClose()
    } catch (error) {
      console.error("Error saving category:", error)
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
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
          <Label htmlFor="image">Category Image</Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="cursor-pointer"
          />

          {previewImage && (
            <div className="mt-4 relative inline-block">
              <img
                src={previewImage || "/placeholder.svg"}
                alt="Category preview"
                className="h-32 w-32 rounded-md object-cover border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                onClick={removeImage}
              >
                <X className="h-3 w-3" />
              </Button>
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
            "Update Category"
          ) : (
            "Create Category"
          )}
        </Button>
      </div>
    </form>
  )
}

