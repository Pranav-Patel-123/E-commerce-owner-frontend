"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const API_URL = "https://merccyclone-ph.hf.space"

interface OrderItem {
  product_id: string
  name: string
  price: number
  quantity: number
}

interface Order {
  _id: string
  order_id: string
  customer_id: string
  items: OrderItem[]
  total_price: number
  status: string
  created_at: string
}

const statusOptions = ["pending", "shipped", "delivered", "cancelled"]

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Popup state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState("")

  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/orders`)
        if (response.status === 200) {
          const sortedOrders = response.data.sort(
            (a: Order, b: Order) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
          )
          setOrders(sortedOrders)
        }
      } catch (err) {
        setError("Failed to fetch orders. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
  }

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return

    try {
      const response = await axios.patch(`${API_URL}/orders/${selectedOrder.order_id}?status=${newStatus}`)
      alert(response.data.message)
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o.order_id === selectedOrder.order_id ? { ...o, status: newStatus } : o)),
      )
      setSelectedOrder(null) // Close modal
    } catch (error) {
      console.error("Failed to update order status", error)
      alert("Error updating order status. Try again.")
    }
  }

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-gray-50 pt-20 pb-10 flex justify-center">
        <div className="w-full max-w-6xl px-6 py-12 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Customer Orders</h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading orders...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-black border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-3 text-left">Order ID</th>
                    <th className="border p-3 text-left">Customer ID</th>
                    <th className="border p-3 text-left">Items</th>
                    <th className="border p-3 text-left">Quantity</th>
                    <th className="border p-3 text-left">Total Price</th>
                    <th className="border p-3 text-left">Status</th>
                    <th className="border p-3 text-left">Placed On</th>
                    <th className="border p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-100">
                      <td className="border p-3">{order.order_id}</td>
                      <td className="border p-3 text-gray-700">{order.customer_id}</td>
                      <td className="border p-3">
                        {order.items.map((item) => (
                          <p key={item.product_id} className="text-gray-700">
                            {item.name}
                          </p>
                        ))}
                      </td>
                      <td className="border p-3 text-center">
                        {order.items.map((item) => (
                          <p key={item.product_id} className="text-gray-700">
                            {item.quantity}
                          </p>
                        ))}
                      </td>
                      <td className="border p-3 font-semibold text-blue-600">${order.total_price.toFixed(2)}</td>
                      <td className="border p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "shipped"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "delivered"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="border p-3 text-gray-700">{new Date(order.created_at).toLocaleString()}</td>
                      <td className="border p-3 text-center">
                        <button
                          onClick={() => handleOpenModal(order)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Popup Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Update Order Status</h3>
            <p className="mb-2 text-gray-700">
              Order ID: <strong>{selectedOrder.order_id}</strong>
            </p>

            <select
              className="w-full p-2 border rounded mb-4"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <div className="flex justify-end">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-gray-300 rounded mr-2">
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

export default OrdersPage

