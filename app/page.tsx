import Link from "next/link"

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-indigo-600/10 via-background to-purple-500/10 p-8 md:p-12">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-semibold mb-3">Modern Library</h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6">
            Browse and view PDFs, images, and Word documents directly from your Google Drive.
          </p>
          <Link
            href="/pdfs"
            className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-5 py-2.5 hover:opacity-90"
          >
            Open Library
          </Link>
        </div>
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl" />
      </div>
    </main>
  )
}
