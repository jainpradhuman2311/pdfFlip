import { NextResponse, type NextRequest } from "next/server"

const DRIVE_API = "https://www.googleapis.com/drive/v3/files"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  const key = process.env.GOOGLE_API_KEY
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  if (!key) return NextResponse.json({ error: "Missing GOOGLE_API_KEY" }, { status: 500 })

  const url = new URL(`${DRIVE_API}/${encodeURIComponent(id)}`)
  url.searchParams.set("key", key)
  url.searchParams.set("fields", "id,name,mimeType,thumbnailLink,modifiedTime,size,webViewLink,iconLink")

  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: `Drive error ${res.status}: ${text}` }, { status: 502 })
  }
  const data = await res.json()
  return NextResponse.json({ ok: true, file: data })
}


