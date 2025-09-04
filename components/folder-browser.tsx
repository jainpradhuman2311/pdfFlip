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
    <div className="mx-auto w-full">
      {/* Header with breadcrumbs and search */}
      <div className="mb-8 space-y-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToBreadcrumb(0)}
            className="p-2.5 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-white/50 dark:hover:bg-slate-800/50"
          >
            <Home className="h-4 w-4" />
          </Button>
          {breadcrumbs.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={goBack}
              className="p-2.5 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-white/50 dark:hover:bg-slate-800/50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <nav className="flex items-center space-x-2 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20 dark:border-slate-700/20">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.id} className="flex items-center">
                {index > 0 && <ChevronRight className="h-4 w-4 text-slate-400 mx-2" />}
                <button
                  onClick={() => navigateToBreadcrumb(index)}
                  className={cn(
                    "px-2 py-1 rounded-lg transition-all text-sm font-medium",
                    index === breadcrumbs.length - 1 
                      ? "text-slate-900 dark:text-white bg-white/60 dark:bg-slate-700/60" 
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-700/40"
                  )}
                >
                  {crumb.name}
                </button>
              </div>
            ))}
          </nav>
        </div>

        {/* Search and Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {breadcrumbs[breadcrumbs.length - 1].name}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">Browse and manage your documents</p>
          </div>
          <div className="relative">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              aria-label="Search"
              className="w-full sm:w-80 pl-4 pr-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 transition-all"
            />
          </div>
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
    <div className="space-y-8">
      {/* Grid of folders and PDFs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {data.items.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl hover:shadow-slate-900/10 dark:hover:shadow-slate-900/30 transition-all duration-300 cursor-pointer overflow-hidden relative hover:scale-105 hover:bg-white/60 dark:hover:bg-slate-800/60"
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
            <div className="aspect-[3/4] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50">
              {item.isFolder ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500/10 via-red-500/5 to-amber-500/10">
                  <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-4 shadow-lg">
                    <Folder className="h-12 w-12 text-white" />
                  </div>
                </div>
              ) : (
                <FilePreview mimeType={item.mimeType} thumbnailLink={item.thumbnailLink} name={item.name} />
              )}
            </div>

            {/* Item info */}
            <div className="p-4">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate mb-2" title={item.name}>
                {item.name}
              </h3>
              <div className="space-y-2">
                {!item.isFolder && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/60 dark:bg-slate-700/60 border border-white/20 dark:border-slate-600/20">
                    <BadgeIcon mimeType={item.mimeType} />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {labelForMime(item.mimeType)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{item.isFolder ? "फ़ोल्डर" : formatFileSize(item.size || "0")}</span>
                  {item.modifiedTime && (
                    <span>{formatDate(item.modifiedTime)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-orange-200/50 dark:border-amber-700/20">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {item.isFolder ? "फ़ोल्डर खोलें" : "ग्रंथ देखें"}
                </span>
              </div>
            </div>

            {/* Subtle gradient border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 via-red-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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
            className="border-orange-200 dark:border-amber-700 text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-amber-900/20"
          >
            पिछला
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            disabled={!data?.nextPageToken} 
            onClick={onNext}
            className="border-orange-200 dark:border-amber-700 text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-amber-900/20"
          >
            अगला
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
        <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-green-600/80 text-white px-2 py-0.5 text-[10px] font-medium">
          <img src="/icons/image.svg" alt="image" className="h-3 w-3 opacity-90" /> चित्र
        </div>
      </div>
    )
  }
  if (
    mimeType === "application/msword" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 w-full h-full flex items-center justify-center relative">
        <img src="/icons/doc.svg" alt="DOC file" className="h-12 w-12 object-contain" loading="lazy" />
        <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-blue-600/80 text-white px-2 py-0.5 text-[10px] font-medium">
          प्रकाशित ग्रंथ
        </div>
      </div>
    )
  }
  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-100 w-full h-full flex items-center justify-center relative">
      <img src="/icons/pdf.svg" alt="PDF file" className="h-12 w-12 object-contain" loading="lazy" />
      <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-red-600/80 text-white px-2 py-0.5 text-[10px] font-medium">
        जैन ग्रंथ
      </div>
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
  if (mimeType.startsWith("image/")) return "चित्र"
  if (
    mimeType === "application/msword" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "प्रकाशित ग्रंथ"
  if (mimeType === "application/pdf") return "जैन ग्रंथ"
  return "फ़ाइल"
}
