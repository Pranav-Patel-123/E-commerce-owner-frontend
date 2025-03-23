"use client"

import { useState } from "react"
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import axios from "axios"
import AddProductPopup from "./AddProductPopup"
import UpdateProductPopup from "./UpdateProductPopup"
import DeleteProductPopup from "./DeleteProductPopup"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

type Product = {
  _id: string
  name: string
  price: number
  quantity: number
  images: string[]
  category?: string
  brand?: string
}

const fetchProducts = async () => {
  const { data } = await axios.get<Product[]>(`${API_URL}/products/products`)
  return data
}

function ProductsListContent() {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  })

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false)
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false)
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6 bg-white shadow-md rounded-lg mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Manage Products</h1>

        {/* Add Product Button */}
        <button
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
          onClick={() => setIsAddPopupOpen(true)}
        >
          Add Product
        </button>

        {isLoading && <p className="text-center">Loading...</p>}
        {isError && <p className="text-center text-red-500">Error fetching products</p>}

        {/* Product List */}
        {!isLoading && !isError && (
          <ul className="space-y-4">
            {products?.map((product) => (
              <li
                key={product._id}
                className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center border border-gray-200"
              >
                <div>
                  <h2 className="font-bold text-lg">{product.name}</h2>
                  <p className="text-gray-600">${product.price}</p>
                  <p className="text-sm text-gray-500">Stock: {product.quantity}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    onClick={() => {
                      setSelectedProduct(product)
                      setIsUpdatePopupOpen(true)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    onClick={() => {
                      setSelectedProduct(product)
                      setIsDeletePopupOpen(true)
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Popups */}
        {isAddPopupOpen && <AddProductPopup onClose={() => setIsAddPopupOpen(false)} />}
        {isUpdatePopupOpen && selectedProduct && (
          <UpdateProductPopup product={selectedProduct} onClose={() => setIsUpdatePopupOpen(false)} />
        )}
        {isDeletePopupOpen && selectedProduct && (
          <DeleteProductPopup product={selectedProduct} onClose={() => setIsDeletePopupOpen(false)} />
        )}
      </div>
    </div>
  )
}

export default function ProductsList() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <ProductsListContent />
      <Footer />
    </QueryClientProvider>
  )
}

