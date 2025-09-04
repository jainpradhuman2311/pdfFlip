"use client"

import { useMemo } from "react"
import dynamic from "next/dynamic"
import useSWR from "swr"
import { Button } from "@/components/ui/button"

const DocViewer = dynamic(() => import("@cyntler/react-doc-viewer").then(m => m.default), { ssr: false })

export default function ReaderPage({ params }: { params: { id: string } }) {
  const fileId = params.id
  const fileUrl = useMemo(() => `/api/file/${encodeURIComponent(fileId)}`, [fileId])

  const docs = useMemo(() => [{ uri: fileUrl }], [fileUrl])

  const fetcher = (url: string) => fetch(url).then(r => r.json())
  const { data: meta } = useSWR<{ ok: boolean; file?: { name?: string; mimeType?: string } }>(
    `/api/file/meta?id=${encodeURIComponent(fileId)}`,
    fetcher,
  )
  const mime = meta?.file?.mimeType || ""
  const isImage = mime.startsWith("image/")
  const title = meta?.file?.name || "Document Viewer"

  const enterFullscreen = () => {
    const el = document.documentElement as any
    ;(
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen
    )?.call(el)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">Supports PDF, images, and Word docs</p>
        </div>
        <Button onClick={enterFullscreen} className="bg-primary text-primary-foreground hover:opacity-90">Fullscreen</Button>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-8">
        <div className="rounded-xl border bg-card shadow-sm overflow-auto">
          {isImage ? (
            <div className="w-full flex items-center justify-center p-2 md:p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fileUrl} alt={title} className="max-h-[90vh] w-auto h-auto object-contain" />
            </div>
          ) : (
            <div className="h-[90vh] w-full overflow-auto">
              <DocViewer documents={docs as any} theme={{ primary: "#111827", secondary: "#ffffff" }} style={{ height: "100%", width: "100%" }} />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
