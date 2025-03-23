"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_URL}/owner-auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || "Login failed")

      localStorage.setItem("owner_token", data.token)
      router.push("/dashboard")
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex text-black items-center justify-center z-50">
      {/* Background Overlay - Lighten it */}
      <div className="absolute inset-0 bg-opacity-40 backdrop-blur-xs"></div>

      {/* Modal Container */}
      <div className="relative bg-white p-6 rounded-lg shadow-2xl border border-black w-96 z-10">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl">
          ✕
        </button>

        {/* Login Header */}
        <h2 className="text-2xl font-semibold text-center mb-4">Owner Login</h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}

