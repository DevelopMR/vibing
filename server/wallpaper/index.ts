import type { WallpaperRecord, WallpaperContext } from '../../src/wallpaper/types.js'
import { getHoliday } from './holidays.js'
import { buildDayPrompt, buildNightPrompt, buildStockKeywords } from './prompt.js'
import { generateImage } from './providers/huggingface.js'
import { fetchStockImageUrl } from './providers/stock.js'
import {
  getRecord,
  saveGeneratedImage,
  saveRecord,
  deleteRecord,
  datesOlderThan,
  readManifest,
} from './storage.js'

// Days before which we use stock instead of AI generation
const STOCK_CUTOFF_DAYS = 31

function getSeason(dateId: string): WallpaperContext['season'] {
  const month = parseInt(dateId.slice(5, 7), 10)
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

function cutoffDate(): string {
  const d = new Date()
  d.setDate(d.getDate() - STOCK_CUTOFF_DAYS)
  return d.toISOString().slice(0, 10)
}

export function enrichContext(base: WallpaperContext): WallpaperContext {
  return {
    ...base,
    season: base.season ?? getSeason(base.date),
    holiday: base.holiday ?? getHoliday(base.date),
  }
}

interface Env {
  hfToken: string
  unsplashKey: string
  pexelsKey: string
}

export async function getWallpaper(date: string): Promise<WallpaperRecord | null> {
  // Future dates never have wallpapers
  const today = new Date().toISOString().slice(0, 10)
  if (date > today) return null

  return getRecord(date)
}

export async function generateWallpaper(
  ctx: WallpaperContext,
  env: Env,
): Promise<WallpaperRecord> {
  const enriched = enrichContext(ctx)
  const isOld = ctx.date < cutoffDate()

  let dayUrl: string
  let nightUrl: string
  let source: WallpaperRecord['source']

  if (isOld || !env.hfToken) {
    // Stock images for old dates or when no HF token
    const keywords = buildStockKeywords(enriched, 'day')
    const nightKeywords = buildStockKeywords(enriched, 'night')
    dayUrl = await fetchStockImageUrl(keywords, env.unsplashKey, env.pexelsKey)
    nightUrl = await fetchStockImageUrl(nightKeywords, env.unsplashKey, env.pexelsKey)
    source = 'stock'
  } else {
    // AI generation
    const dayPrompt = buildDayPrompt(enriched)
    const nightPrompt = buildNightPrompt(enriched)
    console.log(`[wallpaper] Generating day: ${dayPrompt}`)
    console.log(`[wallpaper] Generating night: ${nightPrompt}`)

    const [dayBuffer, nightBuffer] = await Promise.all([
      generateImage(dayPrompt, env.hfToken),
      generateImage(nightPrompt, env.hfToken),
    ])

    dayUrl = await saveGeneratedImage(ctx.date, 'day', dayBuffer)
    nightUrl = await saveGeneratedImage(ctx.date, 'night', nightBuffer)
    source = 'generated'
  }

  const record: WallpaperRecord = {
    date: ctx.date,
    dayUrl,
    nightUrl,
    source,
    generatedAt: new Date().toISOString(),
  }

  await saveRecord(record)
  return record
}

export async function deleteWallpaper(date: string): Promise<void> {
  await deleteRecord(date)
}

// Purge entries older than STOCK_CUTOFF_DAYS that are generated (not stock).
// Stock entries are cheap (URLs only), so we keep them. Generated images take disk space.
export async function purgeOldGeneratedImages(): Promise<void> {
  const cutoff = cutoffDate()
  const old = await datesOlderThan(cutoff)
  const manifest = await readManifest()

  for (const date of old) {
    if (manifest[date]?.source === 'generated') {
      console.log(`[wallpaper] Purging old generated images for ${date}`)
      await deleteRecord(date)
    }
  }
}
