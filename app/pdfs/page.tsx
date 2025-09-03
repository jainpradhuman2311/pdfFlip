"use client"

import dynamic from "next/dynamic"
const FolderBrowser = dynamic(() => import("@/components/folder-browser").then((m) => m.FolderBrowser), { ssr: false })

export default function PdfsPage() {
  const ROOT_FOLDER_ID = "1hycfYG1qXzo6tRyMmNDj1rW06jpT_W_t" // Google Drive folder ID from your link

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-balance">PDF Library</h1>
        <p className="text-muted-foreground mt-1">
          Browse the shared Google Drive folders and open PDFs in a flipbook (new tab).
        </p>
      </header>

      <FolderBrowser rootFolderId={ROOT_FOLDER_ID} pageSize={30} title="Root" />
    </main>
  )
}
