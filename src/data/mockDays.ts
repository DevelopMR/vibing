export type TaskItem = {
  id: string
  label: string
  completed: boolean
}

export type DayMode = 'current' | 'past' | 'future' | 'overnight'

export type DayRecord = {
  id: string
  dateLabel: string
  timeLabel: string
  weather: {
    temp: string
    condition: string
    hourly: { time: string; icon: string; temp?: string }[]
    warning?: string
  }
  nextLabel: string
  nextTask: string
  tasks: TaskItem[]
  message: string
  meals: {
    breakfast: boolean
    lunch: boolean
    dinner: boolean
    calories: string
  }
  meds: {
    amDone: boolean
    pmDone: boolean
  }
  mode: DayMode
}

const DAY_MS = 24 * 60 * 60 * 1000
const RANGE_DAYS = 14
const TODAY_ID = new Date().toISOString().slice(0, 10)

const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

const taskPool = [
  'Clean Shoes',
  'Buy Milk',
  'Short Walk',
  'Doctor Appointment',
  'Grocery Delivery',
  'Haircut',
  'Morning Stretch',
  'Water Plants',
  'Tea With Anna',
  'Call Mike',
  'Read Together',
  'Laundry Fold',
  'Check Mail',
  'Puzzle Time',
  'Porch Sit',
  'Soup Lunch',
  'Dinner Prep',
  'Pick Up Prescription',
]

const weatherConditions = [
  { condition: 'Partly cloudy', icon: '⛅', tempBase: 64 },
  { condition: 'Mostly clear', icon: '🌤️', tempBase: 62 },
  { condition: 'Light rain later', icon: '🌧️', tempBase: 59 },
  { condition: 'Soft sun', icon: '☀️', tempBase: 68 },
  { condition: 'Cloudy', icon: '☁️', tempBase: 60 },
]

const messagePast = [
  'You had a lovely day today. We are all proud of you.',
  'Great talk today, Dad. You always make me smile.',
  'You did a lot today. Rest and enjoy the evening.',
]

const messageCurrent = [
  "Hi Dad, you're doing great today. Call me if you need anything.",
  'Good morning. I will see you this afternoon.',
  'Everything is set for today. One step at a time.',
]

const messageFuture = [
  "Looking ahead to a quiet day. We'll get through it together.",
  'Tomorrow is planned and steady. You are not alone.',
  'A calm day is ahead. We already have the main things covered.',
]

function parseDateId(dateId: string) {
  return new Date(`${dateId}T12:00:00`)
}

function formatDateId(date: Date) {
  return date.toISOString().slice(0, 10)
}

function shiftDate(date: Date, offset: number) {
  return new Date(date.getTime() + offset * DAY_MS)
}

function formatDateLabel(date: Date) {
  return weekdayFormatter.format(date)
}

function formatTimeLabel(offset: number) {
  if (offset < 0) {
    const hour = 7 + ((Math.abs(offset) * 3) % 5)
    const minute = (45 - ((Math.abs(offset) * 7) % 4) * 15 + 60) % 60
    const suffix = hour >= 12 ? 'PM' : 'AM'
    const normalizedHour = ((hour - 1) % 12) + 1
    return `${normalizedHour}:${String(minute).padStart(2, '0')} ${suffix}`
  }

  if (offset > 0) {
    const hour = 9 + ((offset * 2) % 4)
    const minute = (offset * 15) % 60
    const suffix = hour >= 12 ? 'PM' : 'AM'
    const normalizedHour = ((hour - 1) % 12) + 1
    return `${normalizedHour}:${String(minute).padStart(2, '0')} ${suffix}`
  }

  return '9:23 AM'
}

function buildHourly(offset: number) {
  const weather = weatherConditions[Math.abs(offset) % weatherConditions.length]
  const startHour = offset < 0 ? 6 : 10

  return Array.from({ length: 3 }, (_, index) => {
    const hourValue = startHour + index * 2
    const ampm = hourValue >= 12 ? 'pm' : 'am'
    const displayHour = ((hourValue - 1) % 12) + 1
    const temp = weather.tempBase + index * (offset < 0 ? -1 : 1)

    return {
      time: `${displayHour}${ampm}`,
      icon: weather.icon,
      temp: `${temp}°`,
    }
  })
}

function pickTask(offset: number, index: number) {
  return taskPool[(Math.abs(offset) * 3 + index) % taskPool.length]
}

function buildTasks(offset: number, mode: Exclude<DayMode, 'overnight'>): TaskItem[] {
  return Array.from({ length: 3 }, (_, index) => ({
    id: `task-${offset}-${index}`,
    label: pickTask(offset, index),
    completed: mode === 'past' ? index < 2 || Math.abs(offset) % 2 === 0 : mode === 'current' ? index === 0 : false,
  }))
}

function buildMeals(offset: number, mode: Exclude<DayMode, 'overnight'>) {
  if (mode === 'past') {
    return {
      breakfast: true,
      lunch: true,
      dinner: true,
      calories: `~${1450 + ((Math.abs(offset) % 4) * 80)}`,
    }
  }

  if (mode === 'future') {
    return {
      breakfast: false,
      lunch: false,
      dinner: false,
      calories: '~1500',
    }
  }

  return {
    breakfast: true,
    lunch: false,
    dinner: false,
    calories: '~1500',
  }
}

function buildMeds(offset: number, mode: Exclude<DayMode, 'overnight'>) {
  if (mode === 'past') {
    return { amDone: true, pmDone: true }
  }

  if (mode === 'future') {
    return { amDone: false, pmDone: false }
  }

  return { amDone: true, pmDone: false }
}

function buildMessage(offset: number, mode: Exclude<DayMode, 'overnight'>) {
  if (mode === 'past') {
    return messagePast[Math.abs(offset) % messagePast.length]
  }

  if (mode === 'future') {
    return messageFuture[Math.abs(offset) % messageFuture.length]
  }

  return messageCurrent[Math.abs(offset) % messageCurrent.length]
}

function buildNextLabel(offset: number, mode: Exclude<DayMode, 'overnight'>) {
  if (mode === 'past') return 'Summary'
  if (offset === 1) return 'For tomorrow'
  if (offset > 1 && offset <= 6) return `In ${offset} days`
  if (offset > 6) return `In ${Math.ceil(offset / 7)} weeks`
  return 'Next'
}

function buildNextTask(offset: number, mode: Exclude<DayMode, 'overnight'>, tasks: TaskItem[]) {
  if (mode === 'past') return 'You did great today.'
  if (mode === 'future') return tasks[0]?.label ?? 'No plans yet'
  return tasks.find((task) => !task.completed)?.label ?? tasks[0]?.label ?? 'Take a calm moment'
}

function buildWeather(offset: number, mode: Exclude<DayMode, 'overnight'>) {
  const weather = weatherConditions[Math.abs(offset) % weatherConditions.length]
  const temp = weather.tempBase + ((offset % 3) * 2)

  return {
    temp: `${temp}°F`,
    condition: weather.condition,
    hourly: buildHourly(offset),
    warning: mode === 'current' && offset === 0 ? 'Rain this afternoon' : undefined,
  }
}

function buildDayRecord(offset: number): DayRecord {
  const baseDate = parseDateId(TODAY_ID)
  const date = shiftDate(baseDate, offset)
  const mode: Exclude<DayMode, 'overnight'> = offset < 0 ? 'past' : offset > 0 ? 'future' : 'current'
  const tasks = buildTasks(offset, mode)

  return {
    id: formatDateId(date),
    dateLabel: formatDateLabel(date),
    timeLabel: formatTimeLabel(offset),
    weather: buildWeather(offset, mode),
    nextLabel: buildNextLabel(offset, mode),
    nextTask: buildNextTask(offset, mode, tasks),
    tasks,
    message: buildMessage(offset, mode),
    meals: buildMeals(offset, mode),
    meds: buildMeds(offset, mode),
    mode,
  }
}

export const dayRecords: DayRecord[] = Array.from(
  { length: RANGE_DAYS * 2 + 1 },
  (_, index) => buildDayRecord(index - RANGE_DAYS),
)

export const todayDayRecord =
  dayRecords.find((day) => day.id === TODAY_ID) ??
  dayRecords.find((day) => day.mode === 'current') ??
  dayRecords[0]

export const overnightDayRecord: DayRecord = {
  ...todayDayRecord,
  id: `${todayDayRecord.id}-overnight`,
  timeLabel: '10:12 PM',
  weather: {
    temp: '58°F',
    condition: 'Clear night',
    hourly: [],
  },
  nextLabel: 'Tomorrow',
  nextTask: 'Clean Shoes',
  tasks: [
    { id: 'overnight-1', label: 'Clean Shoes', completed: false },
    { id: 'overnight-2', label: 'Buy Milk', completed: false },
    { id: 'overnight-3', label: 'Short Walk', completed: false },
  ],
  message: 'Good night, Dad. You did great today. Sleep well. I love you.',
  meals: {
    breakfast: true,
    lunch: true,
    dinner: true,
    calories: '~1500',
  },
  meds: {
    amDone: true,
    pmDone: true,
  },
  mode: 'overnight',
}

export const mockDays: DayRecord[] = [...dayRecords, { ...overnightDayRecord }]
