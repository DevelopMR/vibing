import type { WallpaperContext } from '../../src/wallpaper/types.js'

const BASE_STYLE =
  'soft cinematic photography, peaceful and serene, no people, no text, no watermarks, photorealistic'

const SEASON_DETAIL: Record<string, string> = {
  spring: 'spring blossoms, fresh green leaves, soft morning light',
  summer: 'warm golden sunlight, lush greenery, blue skies',
  autumn: 'rich amber and gold foliage, warm afternoon light',
  winter: 'quiet winter landscape, bare trees or gentle snow, cool blue light',
}

const WEATHER_DETAIL: Record<string, string> = {
  'Partly cloudy': 'soft diffused light, gentle clouds moving',
  'Mostly clear': 'bright open sky, crisp clear air',
  'Light rain later': 'dewy morning, soft misty air, rain on leaves',
  'Soft sun': 'warm dappled golden sunlight through leaves',
  'Cloudy': 'overcast sky, soft even light, calm and still',
  'Clear night': 'clear night sky, bright stars',
  'Light snow': 'gentle snowfall, quiet winter air',
}

const HOLIDAY_SCENE: Record<string, string> = {
  'New Year': 'festive city lights reflecting on water, midnight atmosphere, sparkle and shimmer',
  "New Year's Eve": 'glowing city skyline at dusk, anticipation of celebration',
  "Valentine's Day": 'soft pink and rose tones, blooming flowers, warm candlelight glow',
  "St. Patrick's Day": 'lush emerald Irish countryside, rolling green hills, morning mist',
  'Easter': 'spring meadow with wildflowers, pastel colors, gentle morning light',
  "Mother's Day": 'garden in full bloom, soft pinks and whites, peaceful and warm',
  'Memorial Day': 'quiet countryside, American flags, gentle summer breeze',
  "Father's Day": 'peaceful lakeside morning, fishing dock, warm summer sunrise',
  'Independence Day': 'summer evening sky, warm golden light, open fields',
  'Labor Day': 'late summer afternoon, golden fields, end-of-season warmth',
  'Halloween': 'autumn forest path, orange and red leaves, carved pumpkins glowing softly',
  'Thanksgiving': 'golden autumn harvest fields, warm amber light, rustic countryside',
  'Day After Thanksgiving': 'quiet autumn morning after gathering, peaceful countryside',
  'Veterans Day': 'serene national cemetery, American flags, autumn trees, respectful quiet',
  'Christmas Eve': 'snow-dusted pine forest, warm cabin lights glowing through windows at dusk',
  'Christmas': 'snow-covered evergreen trees, soft winter light, peaceful village scene',
}

const TASK_HINT: Record<string, string> = {
  'Short Walk': 'peaceful garden path or park walkway',
  'Morning Stretch': 'calm outdoor patio or garden at dawn',
  'Tea With Anna': 'cozy bay window with warm light, garden beyond',
  'Porch Sit': 'welcoming front porch view, garden in full color',
  'Doctor Appointment': 'serene park pathway, calming greenery',
  'Soup Lunch': 'warm farmhouse kitchen window, garden view',
  'Read Together': 'sun-filled reading nook, bookshelves, soft window light',
  'Puzzle Time': 'cozy interior, soft afternoon light through curtains',
  'Haircut': 'quiet neighborhood street, charming storefronts',
  'Grocery Delivery': 'neighborhood scene, tree-lined sidewalk',
  'Laundry Fold': 'warm airy room, sunlight streaming through linen curtains',
  'Water Plants': 'sunlit conservatory or garden full of plants',
}

function taskScene(tasks: string[]): string {
  for (const task of tasks) {
    if (TASK_HINT[task]) return TASK_HINT[task]
  }
  return ''
}

function weatherDetail(condition: string): string {
  return WEATHER_DETAIL[condition] ?? ''
}

export function buildDayPrompt(ctx: WallpaperContext): string {
  const parts: string[] = []

  if (ctx.holiday && HOLIDAY_SCENE[ctx.holiday]) {
    parts.push(HOLIDAY_SCENE[ctx.holiday])
  } else {
    const scene = taskScene(ctx.tasks ?? [])
    if (scene) parts.push(scene)
    parts.push(SEASON_DETAIL[ctx.season])
  }

  if (ctx.weather) {
    const wd = weatherDetail(ctx.weather.condition)
    if (wd) parts.push(wd)
  }

  parts.push(BASE_STYLE)
  return parts.join(', ')
}

export function buildNightPrompt(ctx: WallpaperContext): string {
  const parts: string[] = []

  if (ctx.holiday && HOLIDAY_SCENE[ctx.holiday]) {
    parts.push(`nighttime version: ${HOLIDAY_SCENE[ctx.holiday]}`)
  } else {
    parts.push(`nighttime version: ${SEASON_DETAIL[ctx.season]}`)
  }

  parts.push('moonlight, stars visible, quiet and still, gentle darkness')
  parts.push(BASE_STYLE)
  return parts.join(', ')
}

export function buildStockKeywords(ctx: WallpaperContext, variant: 'day' | 'night'): string[] {
  const words: string[] = []

  if (ctx.holiday) {
    const scene = HOLIDAY_SCENE[ctx.holiday]
    if (scene) words.push(scene.split(',')[0])
  }

  words.push(ctx.season)
  words.push('landscape')
  if (variant === 'night') words.push('night', 'moonlight')
  else if (ctx.weather?.condition) words.push(ctx.weather.condition.split(' ')[0].toLowerCase())

  return words
}
