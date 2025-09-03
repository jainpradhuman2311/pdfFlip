"use client"

import useSWR from "swr"
import { useCallback, useMemo, useState, useEffect } from "react"
import { ChevronRight, Folder, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type DriveItem = {
  id: string
  name: string
  mimeType: string
  modifiedTime?: string
  size?: string
  isFolder: boolean
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {data.items.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden relative"
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
            <div className="aspect-[3/4] flex items-center justify-center">
              {item.isFolder ? (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 w-full h-full flex items-center justify-center">
                  <Folder className="h-16 w-16 text-blue-600" />
                </div>
              ) : (
                <div className="bg-gradient-to-br from-red-50 to-red-100 w-full h-full flex items-center justify-center">
                  <img
                    src="/images/pdf-placeholder.jpg"
                    alt="PDF file"
                    className="h-16 w-12 object-contain"
                    loading="lazy"
                  />
                </div>
              )}
            </div>

            {/* Item info */}
            <div className="p-3">
              <h3 className="font-medium text-sm text-gray-900 truncate mb-1" title={item.name}>
                {item.name}
              </h3>
              <p className="text-xs text-gray-500">
                {item.isFolder ? "Folder" : item.size ? formatFileSize(item.size) : "PDF"}
              </p>
              {item.modifiedTime && (
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(item.modifiedTime)}
                </p>
              )}
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button size="sm" className="bg-primary text-primary-foreground">
                {item.isFolder ? "Open Folder" : "Open PDF"}
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
