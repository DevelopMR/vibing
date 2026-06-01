import { readFile, writeFile, mkdir, rm, access } from 'node:fs/promises'
import { join } from 'node:path'
import type { WallpaperManifest, WallpaperRecord } from '../../src/wallpaper/types.js'

const WALLPAPER_DIR = join(process.cwd(), 'public', 'wallpapers')
const MANIFEST_PATH = join(WALLPAPER_DIR, 'manifest.json')

// In-memory manifest cache
let manifestCache: WallpaperManifest | null = null

export async function readManifest(): Promise<WallpaperManifest> {
  if (manifestCache) return manifestCache

  try {
    const raw = await readFile(MANIFEST_PATH, 'utf-8')
    manifestCache = JSON.parse(raw)
    return manifestCache!
  } catch {
    manifestCache = {}
    return manifestCache
  }
}

async function writeManifest(manifest: WallpaperManifest): Promise<void> {
  await mkdir(WALLPAPER_DIR, { recursive: true })
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
  manifestCache = manifest
}

export async function getRecord(date: string): Promise<WallpaperRecord | null> {
  const manifest = await readManifest()
  return manifest[date] ?? null
}

export async function saveGeneratedImage(
  date: string,
  variant: 'day' | 'night',
  buffer: Buffer,
): Promise<string> {
  const dir = join(WALLPAPER_DIR, date)
  await mkdir(dir, { recursive: true })
  const filename = `${variant}.png`
  await writeFile(join(dir, filename), buffer)
  return `/wallpapers/${date}/${filename}`
}

export async function saveRecord(record: WallpaperRecord): Promise<void> {
  const manifest = await readManifest()
  manifest[record.date] = record
  await writeManifest(manifest)
}

export async function deleteRecord(date: string): Promise<void> {
  const dir = join(WALLPAPER_DIR, date)
  try {
    await rm(dir, { recursive: true, force: true })
  } catch {}

  const manifest = await readManifest()
  delete manifest[date]
  await writeManifest(manifest)
}

export async function dayExists(date: string): Promise<boolean> {
  const dir = join(WALLPAPER_DIR, date)
  try {
    await access(dir)
    return true
  } catch {
    return false
  }
}

// Returns dates present in the manifest that are older than cutoffDate
export async function datesOlderThan(cutoffDate: string): Promise<string[]> {
  const manifest = await readManifest()
  return Object.keys(manifest).filter((d) => d < cutoffDate)
}
