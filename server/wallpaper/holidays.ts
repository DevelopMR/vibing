// Returns the holiday name for a given YYYY-MM-DD date, or undefined.

const FIXED: Record<string, string> = {
  '01-01': 'New Year',
  '01-31': 'New Year Eve wind-down',
  '02-14': "Valentine's Day",
  '03-17': "St. Patrick's Day",
  '07-04': 'Independence Day',
  '10-31': 'Halloween',
  '11-11': "Veterans Day",
  '12-24': 'Christmas Eve',
  '12-25': 'Christmas',
  '12-31': "New Year's Eve",
}

function easterDate(year: number): { month: number; day: number } {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return { month, day }
}

function nthWeekday(year: number, month: number, weekday: number, n: number): number {
  const first = new Date(year, month - 1, 1)
  const offset = (weekday - first.getDay() + 7) % 7
  return 1 + offset + (n - 1) * 7
}

function lastWeekday(year: number, month: number, weekday: number): number {
  const last = new Date(year, month, 0) // last day of month
  const offset = (last.getDay() - weekday + 7) % 7
  return last.getDate() - offset
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function variableHolidays(year: number): Record<string, string> {
  const easter = easterDate(year)
  const easterKey = `${pad(easter.month)}-${pad(easter.day)}`

  // Mother's Day: 2nd Sunday of May (0 = Sunday)
  const motherDay = nthWeekday(year, 5, 0, 2)
  // Father's Day: 3rd Sunday of June
  const fatherDay = nthWeekday(year, 6, 0, 3)
  // Memorial Day: last Monday of May (1 = Monday)
  const memorialDay = lastWeekday(year, 5, 1)
  // Labor Day: 1st Monday of September
  const laborDay = nthWeekday(year, 9, 1, 1)
  // Thanksgiving: 4th Thursday of November (4 = Thursday)
  const thanksgiving = nthWeekday(year, 11, 4, 4)

  return {
    [easterKey]: 'Easter',
    [`05-${pad(motherDay)}`]: "Mother's Day",
    [`05-${pad(memorialDay)}`]: 'Memorial Day',
    [`06-${pad(fatherDay)}`]: "Father's Day",
    [`09-${pad(laborDay)}`]: 'Labor Day',
    [`11-${pad(thanksgiving)}`]: 'Thanksgiving',
    [`11-${pad(thanksgiving + 1)}`]: 'Day After Thanksgiving',
  }
}

const variableCache: Record<number, Record<string, string>> = {}

export function getHoliday(dateId: string): string | undefined {
  const [yearStr, monthStr, dayStr] = dateId.split('-')
  const year = parseInt(yearStr, 10)
  const key = `${monthStr}-${dayStr}`

  if (FIXED[key]) return FIXED[key]

  if (!variableCache[year]) variableCache[year] = variableHolidays(year)
  return variableCache[year][key]
}
