"use client"

import useSWR from "swr"
import { useCallback, useMemo, useState, useEffect } from "react"
import { ChevronRight, Folder, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Image from "next/image"

type DriveItem = {
  id: string
  name: string
  mimeType: string
  modifiedTime?: string
  size?: string
  isFolder: boolean
  thumbnailLink?: string
}

type DriveChildrenResponse = {
  items: DriveItem[]
  nextPageToken?: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// Helper functions
function formatFileSize(bytes: string): string {
  const size = parseInt(bytes, 10)
  if (size === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(size) / Math.log(k))
  return parseFloat((size / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

type BreadcrumbItem = {
  id: string
  name: string
}

export function FolderBrowser({
  rootFolderId,
  pageSize = 30,
  title = "Root",
}: {
  rootFolderId: string
  pageSize?: number
  title?: string
}) {
  const [search, setSearch] = useState("")
  const [currentFolderId, setCurrentFolderId] = useState(rootFolderId)
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: rootFolderId, name: title }
  ])

  const navigateToFolder = useCallback((folderId: string, folderName: string) => {
    setCurrentFolderId(folderId)
    setBreadcrumbs(prev => [...prev, { id: folderId, name: folderName }])
  }, [])

  const navigateToBreadcrumb = useCallback((index: number) => {
    const targetBreadcrumb = breadcrumbs[index]
    setCurrentFolderId(targetBreadcrumb.id)
    setBreadcrumbs(prev => prev.slice(0, index + 1))
  }, [breadcrumbs])

  const goBack = useCallback(() => {
    if (breadcrumbs.length > 1) {
      setBreadcrumbs(prev => prev.slice(0, -1))
      setCurrentFolderId(breadcrumbs[breadcrumbs.length - 2].id)
    }
  }, [breadcrumbs])

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header with breadcrumbs and search */}
      <div className="mb-6 space-y-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateToBreadcrumb(0)}
            className="p-2"
          >
            <Home className="h-4 w-4" />
          </Button>
          {breadcrumbs.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <nav className="flex items-center space-x-1">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.id} className="flex items-center">
                {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />}
                <button
                  onClick={() => navigateToBreadcrumb(index)}
                  className={cn(
                    "hover:text-primary transition-colors",
                    index === breadcrumbs.length - 1 
                      ? "text-foreground font-medium" 
                      : "text-muted-foreground"
                  )}
                >
                  {crumb.name}
                </button>
              </div>
            ))}
          </nav>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">
            {breadcrumbs[breadcrumbs.length - 1].name}
          </h2>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search in current folder..."
            aria-label="Search"
            className="max-w-sm"
          />
        </div>
      </div>

      {/* Grid content */}
      <GridView 
        folderId={currentFolderId} 
        pageSize={pageSize} 
        search={search}
        onFolderClick={navigateToFolder}
      />
    </div>
  )
}

function GridView({
  folderId,
  pageSize,
  search,
  onFolderClick,
}: {
  folderId: string
  pageSize: number
  search: string
  onFolderClick: (folderId: string, folderName: string) => void
}) {
  const [pageTokenStack, setPageTokenStack] = useState<string[]>([])
  const currentToken = pageTokenStack[pageTokenStack.length - 1]

  const key = useMemo(() => {
    const params = new URLSearchParams()
    params.set("folderId", folderId)
    params.set("pageSize", String(pageSize))
    if (currentToken) params.set("pageToken", currentToken)
    if (search) params.set("q", search)
    return `/api/drive/children?${params.toString()}`
  }, [folderId, pageSize, currentToken, search])

  const isClient = typeof window !== "undefined"
  const { data, error, isLoading, mutate } = useSWR<DriveChildrenResponse>(isClient ? key : null, fetcher)

  const onNext = useCallback(
    () => data?.nextPageToken && setPageTokenStack((s) => [...s, data.nextPageToken!]),
    [data?.nextPageToken],
  )
  const onPrev = useCallback(() => setPageTokenStack((s) => s.slice(0, -1)), [])

  // Reset pagination when folder changes
  useEffect(() => {
    setPageTokenStack([])
  }, [folderId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="text-destructive">Failed to load folder</div>
        <Button variant="outline" onClick={() => mutate()}>
          Retry
        </Button>
      </div>
    )
  }

  if (!data?.items?.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">No items found</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Grid of folders and PDFs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {data.items.map((item) => (
          <div
            key={item.id}
            className="group rounded-xl border bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden relative"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (item.isFolder) {
                onFolderClick(item.id, item.name)
              } else {
                window.open(`/reader/${item.id}`, "_blank", "noopener,noreferrer")
              }
            }}
          >
            {/* Content area */}
            <div className="aspect-[3/4] flex items-center justify-center overflow-hidden">
              {item.isFolder ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-blue-500/10 to-blue-500/5">
                  <div className="rounded-lg bg-white/70 p-4 shadow-sm">
                    <Folder className="h-10 w-10 text-blue-600" />
                  </div>
                </div>
              ) : (
                <FilePreview mimeType={item.mimeType} thumbnailLink={item.thumbnailLink} name={item.name} />
              )}
            </div>

            {/* Item info */}
            <div className="p-3">
              <h3 className="font-medium text-sm text-foreground truncate mb-1" title={item.name}>
                {item.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {!item.isFolder && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                    <BadgeIcon mimeType={item.mimeType} />
                    {labelForMime(item.mimeType)}
                  </span>
                )}
                <span>{item.isFolder ? "Folder" : formatFileSize(item.size || "0")}</span>
              </div>
              {item.modifiedTime && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(item.modifiedTime)}
                </p>
              )}
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button size="sm" variant="secondary" className="rounded-full">
                {item.isFolder ? "Open" : "View"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {(pageTokenStack.length > 0 || data?.nextPageToken) && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button 
            size="sm" 
            variant="outline" 
            disabled={pageTokenStack.length === 0} 
            onClick={onPrev}
          >
            Previous
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            disabled={!data?.nextPageToken} 
            onClick={onNext}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

function FilePreview({ mimeType, thumbnailLink, name }: { mimeType: string; thumbnailLink?: string; name: string }) {
  if (mimeType.startsWith("image/")) {
    const src = "/placeholder.jpg"
    return (
      <div className="relative w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={name} className="w-full h-full object-cover" />
        <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/50 text-white px-2 py-0.5 text-[10px]">
          <img src="/icons/image.svg" alt="image" className="h-3 w-3 opacity-90" /> Image
        </div>
      </div>
    )
  }
  if (
    mimeType === "application/msword" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return (
      <div className="bg-gradient-to-br from-sky-50 to-sky-100 w-full h-full flex items-center justify-center">
        <img src="/icons/doc.svg" alt="DOC file" className="h-12 w-12 object-contain" loading="lazy" />
      </div>
    )
  }
  return (
    <div className="bg-gradient-to-br from-red-50 to-red-100 w-full h-full flex items-center justify-center">
      <img src="/icons/pdf.svg" alt="PDF file" className="h-12 w-12 object-contain" loading="lazy" />
    </div>
  )
}

function BadgeIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("image/")) return <img src="/icons/image.svg" alt="image" className="h-3 w-3" />
  if (
    mimeType === "application/msword" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return <img src="/icons/doc.svg" alt="doc" className="h-3 w-3" />
  return <img src="/icons/pdf.svg" alt="pdf" className="h-3 w-3" />
}

function labelForMime(mimeType: string) {
  if (mimeType.startsWith("image/")) return "Image"
  if (
    mimeType === "application/msword" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "Word Document"
  if (mimeType === "application/pdf") return "PDF"
  return "File"
}
