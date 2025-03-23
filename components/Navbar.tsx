"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import LoginModal from "./LoginModal" // Import modal component
import { FiMenu, FiX } from "react-icons/fi" // Import icons for menu toggle

export default function Navbar() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Sidebar state

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("owner_token"))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("owner_token")
    setIsLoggedIn(false)
    router.push("/login")
  }

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white text-gray-800 p-4 shadow-md fixed w-full z-10 flex items-center">
        {/* Sidebar Toggle Button */}
        <button className="text-gray-800 text-2xl mr-4" onClick={() => setIsSidebarOpen(true)}>
          <FiMenu />
        </button>

        {/* Dashboard Title */}
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/owner")}>
          Owner Dashboard
        </h1>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6 ml-auto">
          <li>
            <a href="/" className="hover:text-blue-500">
              Home
            </a>
          </li>
          <li>
            <a href="/orders" className="hover:text-blue-500">
              Orders
            </a>
          </li>
          <li>
            <a href="/settings" className="hover:text-blue-500">
              Settings
            </a>
          </li>
        </ul>

        {/* Auth Button */}
        <div className="ml-auto md:ml-4">
          {isLoggedIn ? (
            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => setIsModalOpen(true)}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Collapsible Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white w-64 shadow-lg transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-20`}
      >
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setIsSidebarOpen(false)}>
          <FiX />
        </button>

        {/* Sidebar Content */}
        <ul className="mt-16 space-y-6 px-6">
          <li>
            <a href="/" className="block py-2 px-4 rounded-md hover:bg-gray-700">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/orders" className="block py-2 px-4 rounded-md hover:bg-gray-700">
              Orders
            </a>
          </li>
          <li>
            <a href="/products" className="block py-2 px-4 rounded-md hover:bg-gray-700">
              Products
            </a>
          </li>
          <li>
            <a href="/categories" className="block py-2 px-4 rounded-md hover:bg-gray-700">
              Categories
            </a>
          </li>
          <li>
            <a href="/settings" className="block py-2 px-4 rounded-md hover:bg-gray-700">
              Settings
            </a>
          </li>
        </ul>
      </aside>

      {/* Overlay (When Sidebar is Open) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Login Modal */}
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

