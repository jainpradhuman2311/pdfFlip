import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const version = searchParams.get("version") || "5.4.149"

  const upstream = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${encodeURIComponent(version)}/build/pdf.worker.min.js`

  try {
    const res = await fetch(upstream, { cache: "no-store" })
    if (!res.ok) {
      return new Response(`// Failed to load worker: ${res.status}`, {
        status: 502,
        headers: { "content-type": "application/javascript; charset=utf-8" },
      })
    }
    const code = await res.text()
    return new Response(code, {
      status: 200,
      headers: {
        "content-type": "application/javascript; charset=utf-8",
        // Cache at the edge for a day
        "cache-control": "public, s-maxage=86400, max-age=86400, immutable",
        "x-pdfjs-worker-version": version,
      },
    })
  } catch (err) {
    return new Response(`// Error fetching worker`, {
      status: 502,
      headers: { "content-type": "application/javascript; charset=utf-8" },
    })
  }
}
