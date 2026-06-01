import type { WallpaperRecord, WallpaperContext } from './types'

const BASE = '/api/wallpaper'

export async function getWallpaper(date: string): Promise<WallpaperRecord | null> {
  try {
    const res = await fetch(`${BASE}/${date}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`wallpaper fetch failed: ${res.status}`)
    return res.json()
  } catch {
    return null
  }
}

export async function generateWallpaper(
  date: string,
  context: WallpaperContext,
): Promise<WallpaperRecord> {
  const res = await fetch(`${BASE}/${date}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, context }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string; cause?: string }
    throw new Error(`generation failed: ${res.status} — ${body.error ?? ''} | cause: ${body.cause ?? 'none'}`)
  }
  return res.json()
}

export async function deleteWallpaper(date: string): Promise<void> {
  const res = await fetch(`${BASE}/${date}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`delete failed: ${res.status}`)
}

export async function generateSet(
  entries: Array<{ date: string; context: WallpaperContext }>,
): Promise<void> {
  const res = await fetch(`${BASE}/generate-set`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entries }),
  })
  if (!res.ok) throw new Error(`set generation failed: ${res.status}`)
}
