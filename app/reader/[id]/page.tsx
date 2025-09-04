"use client"

import { useMemo } from "react"
import useSWR from "swr"
import { UniversalViewer } from "@/components/pdf-viewer"

export default function ReaderPage({ params }: { params: { id: string } }) {
  const fileId = params.id
  
  const fetcher = (url: string) => fetch(url).then(r => r.json())
  const { data: meta } = useSWR<{ ok: boolean; file?: { name?: string; mimeType?: string } }>(
    `/api/file/meta?id=${encodeURIComponent(fileId)}`,
    fetcher,
  )
  const mime = meta?.file?.mimeType || ""
  const title = meta?.file?.name || "Document Viewer"

  const fileUrl = useMemo(() => {
    // Check if fileId looks like a Google Drive file ID
    const googleDrivePattern = /^[a-zA-Z0-9_-]{10,}$/
    
    // Only use Google Drive URLs for PDF files
    if (fileId && googleDrivePattern.test(fileId) && mime === 'application/pdf') {
      // Create Google Drive share URL for PDFs only
      return `https://drive.google.com/file/d/${fileId}/view`
    }
    
    // Use localhost API for all other file types (images, DOC, DOCX, etc.)
    return `/api/file/${encodeURIComponent(fileId)}`
  }, [fileId, mime])


  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header Section */}
      <div className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
              Professional Document Viewer • PDF, Images & Word Documents
            </p>
          </div>
        </div>
      </div>

      {/* Viewer Section */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-xl"></div>
          
          <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl shadow-slate-900/10 dark:shadow-slate-900/50 overflow-hidden">
            <div className="relative bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
              {/* Universal Document Viewer */}
              <UniversalViewer fileUrl={fileUrl} title={title} mimeType={mime} />
              
              {/* Subtle overlay borders for depth */}
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-slate-200/20 dark:ring-slate-700/20 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Powered by advanced document rendering technology
        </p>
      </div>
    </main>
  )
}
