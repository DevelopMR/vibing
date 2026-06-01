import { readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import type { WallpaperManifest, WallpaperRecord } from '../../src/wallpaper/types.js'

const WALLPAPER_DIR = join(process.cwd(), 'public', 'wallpapers')
const MANIFEST_PATH = join(WALLPAPER_DIR, 'manifest.json')
const FALLBACK_DIR = join(WALLPAPER_DIR, 'fallback')

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
  const filename = `${variant}.jpg`
  const compressed = await sharp(buffer)
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()
  await writeFile(join(dir, filename), compressed)
  return `/wallpapers/${date}/${filename}`
}

export async function saveRecord(record: WallpaperRecord): Promise<void> {
  const manifest = await readManifest()
  manifest[record.date] = record
  await writeManifest(manifest)
}

export async function deleteRecord(date: string): Promise<void> {
  const dir = join(WALLPAPER_DIR, date)
  try { await rm(dir, { recursive: true, force: true }) } catch {}
  const manifest = await readManifest()
  delete manifest[date]
  await writeManifest(manifest)
}

export async function datesOlderThan(cutoffDate: string): Promise<string[]> {
  const manifest = await readManifest()
  return Object.keys(manifest).filter((d) => d < cutoffDate)
}

// Returns a random fallback URL for the given variant, or null if none exist
export async function getRandomFallback(variant: 'day' | 'night'): Promise<string | null> {
  try {
    const files = await readdir(FALLBACK_DIR)
    const matches = files.filter((f) => f.includes(`-${variant}.`))
    if (!matches.length) return null
    const pick = matches[Math.floor(Math.random() * matches.length)]
    return `/wallpapers/fallback/${pick}`
  } catch {
    return null
  }
}
