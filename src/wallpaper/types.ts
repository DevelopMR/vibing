export type WallpaperSource = 'generated' | 'stock' | 'fallback'

export type WallpaperRecord = {
  date: string
  dayUrl: string
  nightUrl: string
  source: WallpaperSource
  generatedAt: string
}

export type WallpaperContext = {
  date: string
  weather?: { condition: string; temp: string }
  tasks?: string[]
  holiday?: string
  season: 'spring' | 'summer' | 'autumn' | 'winter'
}

export type WallpaperManifest = Record<string, WallpaperRecord>

export type GenerateRequest = {
  date: string
  context: WallpaperContext
}
