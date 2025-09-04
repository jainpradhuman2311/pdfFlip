"use client"

import { useMemo } from "react"
import useSWR from "swr"
import Link from "next/link"
import { ArrowLeft, Home, Image, FileDown, Sparkles, Scroll } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-red-100/50 dark:from-slate-900 dark:via-amber-900/10 dark:to-slate-900">
      {/* Enhanced Navigation */}
      <nav className="border-b border-white/20 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/pdfs" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                  <Scroll className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  जैन ग्रंथ संग्रह
                </span>
              </Link>
              
              <div className="hidden md:flex items-center gap-2 ml-4">
                <Link 
                  href="/"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span className="text-sm font-medium">मुख्य पृष्ठ</span>
                </Link>
                <span className="text-slate-400">/</span>
                <Link 
                  href="/pdfs"
                  className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors text-sm font-medium"
                >
                  ग्रंथ संग्रह
                </Link>
                <span className="text-slate-400">/</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">पाठक</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">ग्रंथ पाठक</span>
              </div>
              
              <Link
                href="/pdfs"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-200 dark:border-amber-700 text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-amber-900/20 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">ग्रंथ संग्रह में वापस</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Document Header */}
      <section className="px-6 py-8 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm border-b border-white/20 dark:border-slate-700/20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              {title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              उच्च गुणवत्ता में धार्मिक ग्रंथों का अध्ययन करें। आधुनिक तकनीक के साथ प्राचीन ज्ञान का संयोजन।
            </p>
            
            {/* File type indicator */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20">
                {mime === 'application/pdf' && (
                  <>
                    <Scroll className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">जैन ग्रंथ (PDF)</span>
                  </>
                )}
                {mime?.startsWith('image/') && (
                  <>
                    <Image className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">चित्र फ़ाइल</span>
                  </>
                )}
                {(mime?.includes('word') || mime?.includes('document')) && (
                  <>
                    <FileDown className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">प्रकाशित ग्रंथ</span>
                  </>
                )}
                {mime?.includes('presentation') && (
                  <>
                    <FileDown className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">प्रस्तुति</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Viewer Section */}
      <main className="relative px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative">
            {/* Ambient decorative elements */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-r from-orange-400/10 to-amber-400/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-r from-red-400/10 to-orange-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-r from-amber-400/10 to-yellow-400/10 rounded-full blur-xl animate-pulse delay-500"></div>
            
            <div className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl rounded-3xl border border-white/30 dark:border-slate-700/30 shadow-2xl shadow-slate-900/5 dark:shadow-slate-900/25 overflow-hidden">
              <div className="relative bg-gradient-to-b from-white/50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-900/50">
                {/* Universal Document Viewer */}
                <UniversalViewer fileUrl={fileUrl} title={title} mimeType={mime} />
                
                {/* Enhanced overlay borders for depth */}
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/30 dark:ring-slate-700/30 pointer-events-none"></div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="text-center pb-12 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/20 p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              उन्नत तकनीक द्वारा संचालित जैन ग्रंथ अध्ययन मंच
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span>तीव्र गति</span>
              <span>•</span>
              <span>सुरक्षित अध्ययन</span>
              <span>•</span>
              <span>आधुनिक इंटरफेस</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
