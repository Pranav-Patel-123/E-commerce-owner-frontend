"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle, PenToolIcon as Tool } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "Ponnam Hardware"

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center space-y-6 text-center">
        <div className="flex items-center space-x-2 text-primary">
          <Tool className="h-10 w-10" />
          <span className="text-2xl font-bold">{shopName}</span>
        </div>

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-10 w-10 text-red-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Something went wrong!</h1>
          <p className="text-muted-foreground">An error occurred while processing your request.</p>
        </div>

        <div className="flex gap-4">
          <Button onClick={reset}>Try Again</Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

