const DRIVE_API_BASE = "https://www.googleapis.com/drive/v3"

type DriveFile = {
  id: string
  name: string
  mimeType: string
  parents?: string[]
  thumbnailLink?: string
  modifiedTime?: string
  size?: string
}

type DriveFolder = {
  id: string
  name: string
  parent?: string | null
}

export type PdfItem = {
  id: string
  name: string
  path: string
  thumbnailLink?: string
  modifiedTime?: string
  size?: number
}

const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes

let inMemoryCache: {
  folderId?: string
  items: PdfItem[]
  lastFetch: number
} = { items: [], lastFetch: 0 }

function assertEnv() {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("Missing GOOGLE_API_KEY. Add it in Project Settings > Environment Variables.")
  }
}

async function driveList(params: Record<string, string>) {
  assertEnv()
  const url = new URL(`${DRIVE_API_BASE}/files`)
  Object.entries({
    key: process.env.GOOGLE_API_KEY as string,
    pageSize: "1000",
    fields: "files(id,name,mimeType,parents,thumbnailLink,modifiedTime,size),nextPageToken",
    includeItemsFromAllDrives: "false",
    supportsAllDrives: "false",
    ...params,
  }).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Drive list error: ${res.status} ${text}`)
  }
  return res.json() as Promise<{ files: DriveFile[]; nextPageToken?: string }>
}

export async function listAllPdfsRecursively(rootFolderId: string): Promise<PdfItem[]> {
  // Return cached if valid and for same folderId
  const now = Date.now()
  if (
    inMemoryCache.items.length &&
    inMemoryCache.folderId === rootFolderId &&
    now - inMemoryCache.lastFetch < CACHE_TTL_MS
  ) {
    return inMemoryCache.items
  }

  // BFS through folders
  const folderQueue: string[] = [rootFolderId]
  const folderMap = new Map<string, DriveFolder>() // id -> {name,parent}
  folderMap.set(rootFolderId, { id: rootFolderId, name: "Root", parent: null })

  const collectedPdfs: PdfItem[] = []

  async function listFolderChildren(folderId: string) {
    const q = `'${folderId}' in parents and trashed=false and (mimeType='application/vnd.google-apps.folder' or mimeType='application/pdf')`
    let pageToken: string | undefined = undefined

    do {
      const data = await driveList({ q, pageToken: pageToken ?? "" })
      for (const f of data.files) {
        if (f.mimeType === "application/vnd.google-apps.folder") {
          folderMap.set(f.id, {
            id: f.id,
            name: f.name,
            parent: f.parents?.[0] ?? null,
          })
          folderQueue.push(f.id)
        } else if (f.mimeType === "application/pdf") {
          const parentId = f.parents?.[0]
          const path = buildPath(parentId, folderMap)
          collectedPdfs.push({
            id: f.id,
            name: f.name,
            path,
            thumbnailLink: f.thumbnailLink,
            modifiedTime: f.modifiedTime,
            size: f.size ? Number(f.size) : undefined,
          })
        }
      }
      pageToken = (data as any).nextPageToken
    } while (pageToken)
  }

  function buildPath(folderId: string | undefined, folders: Map<string, DriveFolder>) {
    if (!folderId) return ""
    const names: string[] = []
    let current: string | null | undefined = folderId
    while (current) {
      const node = folders.get(current)
      if (!node) break
      if (node.parent === null) break // stop at Root
      names.push(node.name)
      current = node.parent || null
    }
    return names.reverse().join("/")
  }

  while (folderQueue.length) {
    const fid = folderQueue.shift()!
    await listFolderChildren(fid)
  }

  inMemoryCache = {
    folderId: rootFolderId,
    items: collectedPdfs.sort((a, b) => a.name.localeCompare(b.name)),
    lastFetch: Date.now(),
  }

  return inMemoryCache.items
}

export function filterAndPaginate(items: PdfItem[], q: string | undefined, page: number, pageSize: number) {
  const query = (q || "").trim().toLowerCase()
  const filtered = query
    ? items.filter((i) => i.name.toLowerCase().includes(query) || (i.path && i.path.toLowerCase().includes(query)))
    : items
  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return {
    total,
    page,
    pageSize,
    items: filtered.slice(start, end),
  }
}
