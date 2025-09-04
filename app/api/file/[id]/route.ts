import type { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const key = process.env.GOOGLE_API_KEY
  if (!key) {
    return new Response("Missing GOOGLE_API_KEY. Add it in Project Settings > Environment Variables.", { status: 500 })
  }

  const url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?alt=media&key=${encodeURIComponent(
    key,
  )}`

  const range = req.headers.get("range") || req.headers.get("Range") || undefined
  const upstream = await fetch(url, {
    cache: "no-store",
    headers: range ? { Range: range } : {},
  })

  if (!upstream.ok && upstream.status !== 206) {
    const text = await upstream.text()
    return new Response(`Failed to fetch file: ${upstream.status} ${text}`, { status: 502 })
  }

  const headers = new Headers()
  const contentType = upstream.headers.get("Content-Type") || "application/octet-stream"
  headers.set("Content-Type", contentType)
  const contentLength = upstream.headers.get("Content-Length")
  if (contentLength) headers.set("Content-Length", contentLength)
  const contentRange = upstream.headers.get("Content-Range")
  if (contentRange) headers.set("Content-Range", contentRange)
  headers.set("Accept-Ranges", upstream.headers.get("Accept-Ranges") || "bytes")
  headers.set("Cache-Control", "public, max-age=3600, immutable")
  headers.set("Content-Disposition", "inline")

  return new Response(upstream.body, {
    headers,
    status: upstream.status,
  })
}


