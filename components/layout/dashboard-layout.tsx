"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { SidebarProvider } from "@/components/ui/sidebar"
import { MainNav } from "@/components/layout/main-nav"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { Toaster } from "@/components/ui/toaster"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("owner_token")
    if (!token) {
      router.push("/login")
    } else {
      setAuthenticated(true)
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="flex flex-1">
          <SidebarNav />
          <main className="flex-1 md:ml-[4rem] lg:ml-[16rem] transition-all duration-300 ease-in-out">
            <div className="container mx-auto p-4 md:p-6 max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}

