"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function DeleteProductPopup({
  product,
  onClose,
}: { product: { _id: string; name: string }; onClose: () => void }) {
  const queryClient = useQueryClient()

  const deleteProduct = useMutation({
    mutationFn: () => axios.delete(`${API_URL}/products/products/${product._id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p>Are you sure you want to delete {product.name}?</p>
        <button onClick={() => deleteProduct.mutate()} className="bg-red-500 text-white px-4 py-2 rounded">
          Delete
        </button>
        <button onClick={onClose} className="ml-2 text-gray-500">
          Cancel
        </button>
      </div>
    </div>
  )
}

