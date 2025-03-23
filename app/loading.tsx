import { PenToolIcon as Tool } from "lucide-react"

export default function Loading() {
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "Ponnam Hardware"

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto flex flex-col items-center justify-center space-y-6 text-center">
        <div className="flex items-center space-x-2 text-primary">
          <Tool className="h-10 w-10 animate-pulse" />
          <span className="text-2xl font-bold">{shopName}</span>
        </div>

        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>

        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

