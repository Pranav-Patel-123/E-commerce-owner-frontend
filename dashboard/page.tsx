"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation" // ✅ Correct import for App Router
import Navbar from "../components/Navbar" // ✅ Correct import for Navbar
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"

const OwnerDashboard = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("owner_token")
    if (!token) {
      router.push("/login")
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow p-6 text-black bg-gray-100">
          <h2 className="text-2xl font-bold">Welcome, Owner!</h2>
          <p className="mt-2">This is your dashboard where you can manage orders, customers, and settings.</p>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default OwnerDashboard

