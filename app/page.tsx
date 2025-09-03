import Link from "next/link"

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold mb-2">Welcome</h1>
      <p className="text-muted-foreground mb-6">
        Explore the PDF library sourced from your public Google Drive folder.
      </p>
      <Link
        href="/pdfs"
        className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 hover:opacity-90"
      >
        Open PDF Library
      </Link>
    </main>
  )
}
