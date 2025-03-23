"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, LogOut, Search, Settings, PenToolIcon as Tool, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger, SidebarToggle } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import LoginModal from "@/components/auth/login-modal"

export function MainNav() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "Ponnam Hardware"

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
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <SidebarToggle />
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Tool className="h-6 w-6 text-primary" />
            <span className="text-primary text-xl">{shopName}</span>
          </Link>
        </div>

        <div className="flex-1 md:flex md:justify-center">
          <form className="hidden md:block w-full max-w-sm">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-auto">
                <div className="flex items-start gap-4 p-3 hover:bg-muted/50 cursor-pointer">
                  <div className="flex-1">
                    <p className="text-sm font-medium">New order received</p>
                    <p className="text-xs text-muted-foreground">Order #1234 from John Doe</p>
                    <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 hover:bg-muted/50 cursor-pointer">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Low stock alert</p>
                    <p className="text-xs text-muted-foreground">Product "Power Drill" is running low</p>
                    <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 hover:bg-muted/50 cursor-pointer">
                  <div className="flex-1">
                    <p className="text-sm font-medium">New customer registered</p>
                    <p className="text-xs text-muted-foreground">Jane Smith created an account</p>
                    <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button variant="ghost" size="sm" className="w-full justify-center">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>PH</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setIsLoginModalOpen(true)}>Login</Button>
          )}
        </div>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  )
}

