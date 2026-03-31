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

export const mockDays: DayRecord[] = [
  {
    id: '2026-03-23',
    dateLabel: 'Sunday, March 23',
    timeLabel: '7:45 PM',
    weather: {
      temp: '62°F',
      condition: 'Mostly clear',
      hourly: [
        { time: '6pm', icon: '☀️' },
        { time: '8pm', icon: '⛅' },
        { time: '10pm', icon: '☁️' },
      ],
    },
    nextLabel: 'Summary',
    nextTask: 'You did great today.',
    tasks: [
      { id: 't1', label: 'Morning Walk', completed: true },
      { id: 't2', label: 'Read Mail', completed: true },
      { id: 't3', label: 'Call Mike', completed: false },
    ],
    message: 'Great talk today, Dad. You always make me smile.',
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
    mode: 'past',
  },
  {
    id: '2026-03-24',
    dateLabel: 'Monday, March 24',
    timeLabel: '9:23 AM',
    weather: {
      temp: '68°F',
      condition: 'Partly cloudy',
      hourly: [
        { time: '10am', icon: '☀️' },
        { time: '12pm', icon: '🌤️' },
        { time: '2pm', icon: '🌧️', temp: '63°' },
      ],
      warning: 'Rain this afternoon',
    },
    nextLabel: 'Next',
    nextTask: 'Clean Shoes',
    tasks: [
      { id: 't1', label: 'Clean Shoes', completed: true },
      { id: 't2', label: 'Buy Milk', completed: false },
      { id: 't3', label: 'Short Walk', completed: false },
    ],
    message: "Hi Dad, you're doing great today. Call me if you need anything.",
    meals: {
      breakfast: true,
      lunch: false,
      dinner: false,
      calories: '~1500',
    },
    meds: {
      amDone: true,
      pmDone: false,
    },
    mode: 'current',
  },
  {
    id: '2026-03-25',
    dateLabel: 'Tuesday, March 25',
    timeLabel: '10:00 AM',
    weather: {
      temp: '66°F',
      condition: 'Partly cloudy',
      hourly: [
        { time: '10am', icon: '⛅' },
        { time: '12pm', icon: '⛅' },
        { time: '2pm', icon: '☁️' },
      ],
    },
    nextLabel: 'For tomorrow',
    nextTask: 'Doctor Appointment',
    tasks: [
      { id: 't1', label: 'Doctor Appointment', completed: false },
      { id: 't2', label: 'Grocery Delivery', completed: false },
      { id: 't3', label: 'Haircut', completed: false },
    ],
    message: "Looking ahead to a quiet Tuesday. We'll get through the week together.",
    meals: {
      breakfast: false,
      lunch: false,
      dinner: false,
      calories: '~1500',
    },
    meds: {
      amDone: false,
      pmDone: false,
    },
    mode: 'future',
  },
  {
    id: '2026-03-24-overnight',
    dateLabel: 'Monday, March 24',
    timeLabel: '10:12 PM',
    weather: {
      temp: '58°F',
      condition: 'Clear night',
      hourly: [],
    },
    nextLabel: 'Tomorrow',
    nextTask: 'Clean Shoes',
    tasks: [
      { id: 't1', label: 'Clean Shoes', completed: false },
      { id: 't2', label: 'Buy Milk', completed: false },
      { id: 't3', label: 'Short Walk', completed: false },
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
  },
]