import type { WallpaperContext } from '../../src/wallpaper/types.js'

const BASE_STYLE =
  'soft cinematic photography, peaceful and serene, no people, no text, no watermarks, photorealistic'

// Nature/season elements only — no time-of-day lighting so day and night share the same scene
const SEASON_SCENE: Record<string, string> = {
  spring: 'spring blossoms, fresh green leaves',
  summer: 'lush greenery, vibrant foliage, open fields',
  autumn: 'rich amber and gold foliage, fallen leaves',
  winter: 'bare trees, quiet winter landscape, gentle frost',
}

const DAY_LIGHT: Record<string, string> = {
  spring: 'soft morning light',
  summer: 'warm golden sunlight, clear blue sky',
  autumn: 'warm afternoon light, long shadows',
  winter: 'cool crisp daylight, pale blue sky',
}

const NIGHT_ATMOSPHERE =
  'moonlight filtering through trees, stars visible above, quiet and still, cool gentle darkness'

const WEATHER_DETAIL: Record<string, string> = {
  'Partly cloudy': 'soft diffused light, gentle clouds',
  'Mostly clear': 'bright open sky, crisp clear air',
  'Light rain later': 'dewy leaves, soft misty air',
  'Soft sun': 'warm dappled sunlight through leaves',
  'Cloudy': 'overcast sky, calm and still',
  'Clear night': 'clear sky, bright stars',
  'Light snow': 'gentle snowfall, quiet winter air',
}

const HOLIDAY_SCENE: Record<string, string> = {
  'New Year': 'festive city lights reflecting on calm water',
  "New Year's Eve": 'glowing city skyline at dusk',
  "Valentine's Day": 'rose garden with soft pink blooms',
  "St. Patrick's Day": 'lush emerald Irish countryside, rolling green hills',
  'Easter': 'spring meadow with wildflowers, pastel colors',
  "Mother's Day": 'garden in full bloom, soft pinks and whites',
  'Memorial Day': 'quiet countryside, American flags in breeze',
  "Father's Day": 'peaceful lakeside dock, calm water reflections',
  'Independence Day': 'open summer fields, warm evening sky',
  'Labor Day': 'late summer golden fields',
  'Halloween': 'autumn forest path, orange and red leaves, carved pumpkins',
  'Thanksgiving': 'golden harvest fields, rustic countryside',
  'Day After Thanksgiving': 'quiet autumn morning, countryside',
  'Veterans Day': 'serene tree-lined path, autumn foliage',
  'Christmas Eve': 'snow-dusted pine forest, warm cabin lights glowing',
  'Christmas': 'snow-covered evergreen trees, peaceful village scene',
}

const TASK_HINT: Record<string, string> = {
  'Short Walk': 'stone garden path winding through trees',
  'Morning Stretch': 'calm outdoor patio at dawn, garden beyond',
  'Tea With Anna': 'cozy bay window view, garden beyond',
  'Porch Sit': 'welcoming front porch view overlooking a garden',
  'Doctor Appointment': 'serene park pathway, calming greenery',
  'Soup Lunch': 'farmhouse kitchen window with garden view',
  'Read Together': 'sun-filled reading nook with soft window light',
  'Puzzle Time': 'cozy room with soft afternoon light through curtains',
  'Haircut': 'quiet neighborhood street, charming storefronts',
  'Grocery Delivery': 'tree-lined neighborhood sidewalk',
  'Laundry Fold': 'airy room, sunlight through linen curtains',
  'Water Plants': 'sunlit conservatory filled with plants',
}

// The location anchor shared by both day and night prompts
function buildSceneSeed(ctx: WallpaperContext): string {
  if (ctx.holiday && HOLIDAY_SCENE[ctx.holiday]) {
    return HOLIDAY_SCENE[ctx.holiday]
  }
  for (const task of ctx.tasks ?? []) {
    if (TASK_HINT[task]) return TASK_HINT[task]
  }
  return ''
}

function weatherDetail(condition: string): string {
  return WEATHER_DETAIL[condition] ?? ''
}

// Derive a stable integer seed from a date string so both images share the same composition
export function dateSeed(dateId: string): number {
  let h = 0
  for (const c of dateId.replace(/-/g, '')) {
    h = (h * 31 + c.charCodeAt(0)) & 0x7fffffff
  }
  return h
}

export function buildDayPrompt(ctx: WallpaperContext): string {
  const parts: string[] = []
  const seed = buildSceneSeed(ctx)
  if (seed) parts.push(seed)
  parts.push(SEASON_SCENE[ctx.season])
  parts.push(DAY_LIGHT[ctx.season])
  if (ctx.weather) {
    const wd = weatherDetail(ctx.weather.condition)
    if (wd) parts.push(wd)
  }
  parts.push(BASE_STYLE)
  return parts.join(', ')
}

export function buildNightPrompt(ctx: WallpaperContext): string {
  const parts: string[] = []
  const seed = buildSceneSeed(ctx)
  if (seed) parts.push(seed)          // same location as day
  parts.push(SEASON_SCENE[ctx.season]) // same nature elements
  parts.push(NIGHT_ATMOSPHERE)
  parts.push(BASE_STYLE)
  return parts.join(', ')
}

export function buildStockKeywords(ctx: WallpaperContext, variant: 'day' | 'night'): string[] {
  const words: string[] = []
  if (ctx.holiday) {
    const scene = HOLIDAY_SCENE[ctx.holiday]
    if (scene) words.push(scene.split(',')[0])
  }
  words.push(ctx.season, 'landscape')
  if (variant === 'night') words.push('night', 'moonlight')
  else if (ctx.weather?.condition) words.push(ctx.weather.condition.split(' ')[0].toLowerCase())
  return words
}
