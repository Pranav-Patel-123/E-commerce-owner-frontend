"use client"

import { useRouter } from "next/navigation"

export default function Sidebar() {
  const router = useRouter()

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed top-0 left-0 pt-20">
      <ul className="space-y-6 px-6">
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
          <a href="/settings" className="block py-2 px-4 rounded-md hover:bg-gray-700">
            Settings
          </a>
        </li>
      </ul>
    </aside>
  )
}

