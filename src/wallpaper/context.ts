import type { WallpaperContext } from './types'
import type { DayRecord } from '../data/mockDays'

function getSeason(dateId: string): WallpaperContext['season'] {
  const month = parseInt(dateId.slice(5, 7), 10)
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

// Builds a WallpaperContext from a DayRecord.
// Holiday detection is intentionally left to the server (enrichContext).
export function buildContext(day: DayRecord): WallpaperContext {
  return {
    date: day.id,
    season: getSeason(day.id),
    weather: {
      condition: day.weather.condition,
      temp: day.weather.temp,
    },
    tasks: day.tasks.map((t) => t.label),
  }
}
