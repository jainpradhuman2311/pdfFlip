"use client"

import useSWR from "swr"
import { useMemo, useState, useEffect, type MouseEvent, type KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type PdfItem = {
  id: string
  name: string
  path: string
  thumbnailLink?: string
  modifiedTime?: string
  size?: number
}

type ApiResponse = {
  ok: boolean
  total: number
  page: number
  pageSize: number
  items: PdfItem[]
  error?: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function PdfGrid() {
  const [query, setQuery] = useState("")
  const [debounced, setDebounced] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 12

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300)
    return () => clearTimeout(t)
  }, [query])

  const qs = useMemo(() => {
    const p = new URLSearchParams()
    if (debounced) p.set("q", debounced)
    p.set("page", String(page))
    p.set("pageSize", String(pageSize))
    return p.toString()
  }, [debounced, page])

  const { data, isLoading, error } = useSWR<ApiResponse>(`/api/list-pdfs?${qs}`, fetcher)

  useEffect(() => {
    setPage(1)
  }, [debounced])

  const total = data?.total || 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Search PDFs
          </label>
          <Input
            id="search"
            placeholder="Search PDFs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-xl"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setQuery("")
              setDebounced("")
            }}
          >
            Clear
          </Button>
          <Button
            variant="default"
            onClick={() => {
              window.location.reload()
            }}
            className="bg-primary text-primary-foreground hover:opacity-90"
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className={cn("grid gap-4", "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4")}>
        {(isLoading || !data) && !error ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-40 bg-muted" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : error || !data?.ok ? (
          <div className="col-span-full text-destructive">
            {(data as any)?.error || (error as any)?.message || "Failed to load"}
            <div className="text-sm text-muted-foreground mt-2">
              Ensure the GOOGLE_API_KEY is configured and the Drive folder is public.
            </div>
          </div>
        ) : data.items.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">No PDFs found.</div>
        ) : (
          data.items.map((item) => <PdfCard key={item.id} item={item} />)
        )}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        onGo={(n) => setPage(n)}
      />
    </div>
  )
}

function PdfCard({ item }: { item: PdfItem }) {
  const href = `/reader/${encodeURIComponent(item.id)}`

  const openInNewTab = (e?: MouseEvent | KeyboardEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    window.open(href, "_blank", "noopener,noreferrer")
  }

  return (
    <Card
      className="flex flex-col overflow-hidden cursor-pointer"
      onClick={openInNewTab}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") openInNewTab(e)
      }}
      role="link"
      tabIndex={0}
      aria-label={`Open ${item.name} in reader`}
    >
      <div className="relative h-48 bg-card">
        {item.thumbnailLink ? (
          <img
            src={item.thumbnailLink || "/placeholder.svg?height=480&width=360&query=pdf%20thumbnail"}
            alt={`Thumbnail for ${item.name}`}
            className="h-full w-full object-cover"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).src = "/pdf-thumbnail.png"
            }}
          />
        ) : (
          <img src="/pdf-thumbnail.png" alt="" className="h-full w-full object-cover" />
        )}
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="text-xs text-muted-foreground mb-1 truncate">{item.path || "Root"}</div>
        <div className="font-medium text-foreground text-pretty line-clamp-2 mb-3">{item.name}</div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {item.modifiedTime ? new Date(item.modifiedTime).toLocaleDateString() : ""}
          </span>
          <Button variant="link" className="px-0 text-primary" onClick={openInNewTab}>
            Open →
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
  onGo,
}: {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
  onGo: (n: number) => void
}) {
  if (totalPages <= 1) return null
  const pages = visiblePages(page, totalPages)
  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" onClick={onPrev} disabled={page === 1}>
        Prev
      </Button>
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            className={cn(p === page ? "bg-primary text-primary-foreground hover:opacity-90" : "")}
            onClick={() => onGo(p)}
          >
            {p}
          </Button>
        ),
      )}
      <Button variant="outline" onClick={onNext} disabled={page === totalPages}>
        Next
      </Button>
    </div>
  )
}

function visiblePages(current: number, total: number): (number | "...")[] {
  const delta = 1
  const range: number[] = []
  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    range.push(i)
  }
  const withEnds = new Set<number>([1, total, ...range])
  const arr = Array.from(withEnds).sort((a, b) => a - b)

  const result: (number | "...")[] = []
  let prev = 0
  for (const p of arr) {
    if (prev && p - prev > 1) result.push("...")
    result.push(p)
    prev = p
  }
  return result
}
