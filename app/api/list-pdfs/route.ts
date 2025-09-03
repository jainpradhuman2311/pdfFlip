import { type NextRequest, NextResponse } from "next/server"
import { filterAndPaginate, listAllPdfsRecursively } from "@/lib/drive"

const DEFAULT_FOLDER_ID = "1hycfYG1qXzo6tRyMmNDj1rW06jpT_W_t"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const folderId = searchParams.get("folderId") || DEFAULT_FOLDER_ID
    const q = searchParams.get("q") || undefined
    const page = Number(searchParams.get("page") || "1")
    const pageSize = Number(searchParams.get("pageSize") || "12")

    const all = await listAllPdfsRecursively(folderId)
    const { items, total } = filterAndPaginate(all, q, page, pageSize)
    return NextResponse.json({ ok: true, total, page, pageSize, items })
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "Unknown error",
        hint: "Ensure GOOGLE_API_KEY is set, and the Drive folder is publicly accessible.",
      },
      { status: 500 },
    )
  }
}
