"use client"

import type React from "react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import axios from "axios"
import { Trash, Pencil, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

type Category = {
  _id?: string
  name: string
  description?: string
  image?: string
}

function CategoriesComponent() {
  const queryClient = useQueryClient()
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Fetch Categories
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/category/categories`)
      return res.data
    },
  })

  // Create / Update Mutation
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (editCategory) {
        return axios.put(`${API_URL}/category/categories/${editCategory._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } else {
        return axios.post(`${API_URL}/category/categories`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      reset()
      setEditCategory(null)
      setPreviewImage(null)
    },
  })

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (categoryId: string) => axios.delete(`${API_URL}/category/categories/${categoryId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  })

  // Form Handling
  const { register, handleSubmit, reset, setValue, watch } = useForm<Category>()

  const onSubmit = async (data: Category) => {
    const formData = new FormData()
    formData.append("name", data.name)
    if (data.description) formData.append("description", data.description)

    // Append image if selected
    const imageFile = watch("image") as unknown as FileList
    if (imageFile && imageFile.length > 0) {
      formData.append("image", imageFile[0])
    }

    mutation.mutate(formData)
  }

  const handleEdit = (category: Category) => {
    setEditCategory(category)
    setValue("name", category.name)
    setValue("description", category.description || "")
    setPreviewImage(category.image || null)
  }

  // Handle Image Preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Category Management</h2>

      {/* Category Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-lg mb-6 flex flex-col space-y-4"
        encType="multipart/form-data"
      >
        <input
          type="text"
          {...register("name", { required: true })}
          placeholder="Category Name"
          className="p-2 border rounded w-full"
        />
        <textarea
          {...register("description")}
          placeholder="Description (optional)"
          className="p-2 border rounded w-full"
        />

        {/* Image Upload */}
        <label className="block">
          <span className="text-gray-700">Upload Image</span>
          <input
            type="file"
            {...register("image")}
            className="mt-2 p-2 border rounded w-full"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>

        {/* Image Preview */}
        {previewImage && (
          <div className="flex justify-center">
            <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded-lg shadow" />
          </div>
        )}

        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${
            mutation.isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? (
            <Loader2 className="animate-spin inline-block" />
          ) : editCategory ? (
            "Update Category"
          ) : (
            "Add Category"
          )}
        </button>
        {editCategory && (
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={() => {
              reset()
              setEditCategory(null)
              setPreviewImage(null)
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* Categories List */}
      {isLoading ? (
        <p className="text-center text-gray-600">Loading categories...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Failed to fetch categories.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Existing Categories</h3>
          <ul className="space-y-3">
            {categories.map((category: Category) => (
              <li key={category._id} className="flex justify-between items-center p-3 border rounded shadow-sm">
                <div>
                  <p className="font-semibold">{category.name}</p>
                  <p className="text-sm text-gray-500">{category.description}</p>
                  {category.image && (
                    <img src={category.image} alt={category.name} className="w-20 h-20 mt-2 object-cover rounded" />
                  )}
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(category)} className="text-blue-600">
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(category._id!)}
                    className="text-red-600"
                    disabled={deleteMutation.isLoading}
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ✅ Wrap `CategoriesComponent` inside `QueryClientProvider`
export default function CategoriesPage() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <CategoriesComponent />
      <Footer />
    </QueryClientProvider>
  )
}

