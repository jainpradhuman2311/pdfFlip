"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowLeft, FileText, Home, Sparkles } from "lucide-react"

const FolderBrowser = dynamic(() => import("@/components/folder-browser").then((m) => m.FolderBrowser), { ssr: false })

export default function PdfsPage() {
  const ROOT_FOLDER_ID = "1hycfYG1qXzo6tRyMmNDj1rW06jpT_W_t" // Google Drive folder ID from your link

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800/80 dark:to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/20 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  DocuVault
                </span>
              </Link>
              
              <div className="hidden md:flex items-center gap-2 ml-4">
                <Link 
                  href="/"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span className="text-sm font-medium">Home</span>
                </Link>
                <span className="text-slate-400">/</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">Library</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Smart Library</span>
              </div>
              
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Back</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative">
        {/* Header Section */}
        <section className="px-6 py-12 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm border-b border-white/20 dark:border-slate-700/20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Document Library
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Browse your Google Drive documents with our beautiful, modern interface. View PDFs, images, and Office documents seamlessly.
              </p>
            </div>
          </div>
        </section>

        {/* Library Content */}
        <section className="px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-2xl p-6 md:p-8 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20">
              <FolderBrowser rootFolderId={ROOT_FOLDER_ID} pageSize={30} title="Root" />
            </div>
          </div>
        </section>

        {/* Floating Elements */}
        <div className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse pointer-events-none"></div>
        <div className="fixed top-1/3 left-8 w-12 h-12 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse delay-1000 pointer-events-none"></div>
      </main>
    </div>
  )
}
