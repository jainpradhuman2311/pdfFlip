export type DriveItem = {
  id: string
  name: string
  mimeType: string
  modifiedTime?: string
  size?: string
}

export type DriveChildrenResponse = {
  items: (DriveItem & { isFolder: boolean })[]
  nextPageToken?: string
}

const DRIVE_API = "https://www.googleapis.com/drive/v3/files"

export async function listDriveChildren(params: {
  folderId: string
  pageSize?: number
  pageToken?: string
  query?: string
}) {
  const { folderId, pageSize = 30, pageToken, query } = params
  if (!folderId) throw new Error("folderId is required")

  const key = process.env.GOOGLE_API_KEY
  if (!key) throw new Error("Missing GOOGLE_API_KEY")

  const baseQ =
    `'${folderId}' in parents and trashed=false and ` +
    `(mimeType='application/pdf' or mimeType='application/vnd.google-apps.folder')`
  const searchQ = query ? ` and name contains '${escapeSingleQuotes(query)}'` : ""
  const q = `${baseQ}${searchQ}`

  const url = new URL(DRIVE_API)
  url.searchParams.set("q", q)
  url.searchParams.set("key", key)
  url.searchParams.set("pageSize", String(pageSize))
  url.searchParams.set("fields", "nextPageToken,files(id,name,mimeType,modifiedTime,size)")
  url.searchParams.set("supportsAllDrives", "true")
  url.searchParams.set("includeItemsFromAllDrives", "true")
  if (pageToken) url.searchParams.set("pageToken", pageToken)

  const res = await fetch(url.toString(), { method: "GET", next: { revalidate: 600 } })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Drive API error: ${res.status} ${res.statusText} - ${text}`)
  }
  const data = (await res.json()) as { files: DriveItem[]; nextPageToken?: string }

  const sorted = [...(data.files || [])].sort((a, b) => {
    const aIsFolder = a.mimeType === "application/vnd.google-apps.folder"
    const bIsFolder = b.mimeType === "application/vnd.google-apps.folder"
    if (aIsFolder !== bIsFolder) return aIsFolder ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  const items = sorted.map((f) => ({
    ...f,
    isFolder: f.mimeType === "application/vnd.google-apps.folder",
  }))

  return { items, nextPageToken: data.nextPageToken } as DriveChildrenResponse
}

function escapeSingleQuotes(s: string) {
  return s.replace(/'/g, "\\'")
}
