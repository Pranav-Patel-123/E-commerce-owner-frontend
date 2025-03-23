import Link from "next/link"
import { PenToolIcon as Tool } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "Ponnam Hardware"

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center space-y-6 text-center">
        <div className="flex items-center space-x-2 text-primary">
          <Tool className="h-10 w-10" />
          <span className="text-2xl font-bold">{shopName}</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        </div>

        <div className="flex gap-4">
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

