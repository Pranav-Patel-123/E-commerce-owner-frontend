"use client"

import { useState } from "react"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

export default function OwnerLanding() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Full height wrapper */}
      <div className="min-h-screen flex flex-col">
        <main
          className={`flex-grow transition-all duration-300 p-10 bg-gray-50 text-gray-800 ${isSidebarOpen ? "ml-64" : "ml-0"}`}
        >
          <h1 className="text-4xl font-bold">Welcome to Owner Dashboard</h1>
          <p className="text-lg text-gray-600 mt-4">Manage your products, orders, and settings from one place.</p>

          {/* Example Dashboard Widgets */}
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-2xl font-semibold">Orders</h2>
              <p className="text-gray-600 mt-2">Manage all customer orders.</p>
            </div>

            <div className="p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-2xl font-semibold">Products</h2>
              <p className="text-gray-600 mt-2">Update and manage your products.</p>
            </div>

            <div className="p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-2xl font-semibold">Settings</h2>
              <p className="text-gray-600 mt-2">Modify account and store settings.</p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

