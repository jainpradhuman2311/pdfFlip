import { type NextRequest, NextResponse } from "next/server"
import { listDriveChildren } from "@/lib/drive-browser"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const folderId = searchParams.get("folderId") || ""
  const pageSize = Number(searchParams.get("pageSize") || "30")
  const pageToken = searchParams.get("pageToken") || undefined
  const q = searchParams.get("q") || undefined

  try {
    const data = await listDriveChildren({ folderId, pageSize, pageToken, query: q || undefined })
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60",
      },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to list folder children" }, { status: 500 })
  }
}
