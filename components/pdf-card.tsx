"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type PdfCardProps = {
  id: string
  name: string
  thumbnailLink?: string
}

export function PdfCard({ id, name, thumbnailLink }: PdfCardProps) {
  const handleOpen = () => {
    // Open in a new tab consistently
    window.open(`/reader/${id}`, "_blank", "noopener,noreferrer")
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-[3/4] bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailLink || "/placeholder.svg?height=640&width=480&query=pdf%20thumbnail"}
            alt={name}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div title={name} className="text-sm font-medium leading-5 line-clamp-2 text-pretty">
          {name}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button className="w-full" onClick={handleOpen}>
          Open
        </Button>
      </CardFooter>
    </Card>
  )
}
