import { useEffect, useMemo, useRef, useState } from 'react'
import DayFrame from './DayFrame'
import {
  dayRecords,
  overnightDayRecord,
  todayDayRecord,
  type DayRecord,
} from '../data/mockDays'

const AUTO_RETURN_MS = 5000

function formatNavLabel(day: DayRecord | undefined, direction: 'prev' | 'next') {
  if (!day) {
    return direction === 'prev' ? '← Earlier' : 'Later →'
  }

  return direction === 'prev' ? `← ${day.dateLabel}` : `${day.dateLabel} →`
}

export default function PatientShell() {
  const [selectedDate, setSelectedDate] = useState(todayDayRecord.id)
  const [showOvernight, setShowOvernight] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const loadedDays = useMemo(() => dayRecords, [])
  const todayDate = todayDayRecord.id
  const todayIndex = loadedDays.findIndex((day) => day.id === todayDate)
  const selectedIndex = loadedDays.findIndex((day) => day.id === selectedDate)
  const safeSelectedIndex = selectedIndex >= 0 ? selectedIndex : todayIndex
  const selectedDay = loadedDays[safeSelectedIndex] ?? todayDayRecord

  const canGoPrev = safeSelectedIndex > 0
  const canGoNext = safeSelectedIndex < loadedDays.length - 1
  const dayOffset = safeSelectedIndex - todayIndex

  const todayButtonOffset = useMemo(() => {
    const distance = Math.abs(dayOffset)
    if (distance === 0) return 0

    const offsets = [0, 40, 65, 80, 90, 98]
    const clamped = Math.min(distance, offsets.length - 1)
    const baseOffset = offsets[clamped]

    return dayOffset < 0 ? baseOffset : -baseOffset
  }, [dayOffset])

  const clearReturnTimer = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const scheduleReturnToToday = () => {
    clearReturnTimer()

    if (selectedDate === todayDate) return

    timeoutRef.current = window.setTimeout(() => {
      setSelectedDate(todayDate)
    }, AUTO_RETURN_MS)
  }

  useEffect(() => {
    scheduleReturnToToday()
    return clearReturnTimer
  }, [selectedDate, todayDate])

  const goPrev = () => {
    if (!canGoPrev) return
    setSelectedDate(loadedDays[safeSelectedIndex - 1].id)
  }

  const goNext = () => {
    if (!canGoNext) return
    setSelectedDate(loadedDays[safeSelectedIndex + 1].id)
  }

  const goToday = () => {
    clearReturnTimer()
    setSelectedDate(todayDate)
  }

  const previousDay = loadedDays[safeSelectedIndex - 1]
  const nextDay = loadedDays[safeSelectedIndex + 1]
  const visibleDays = loadedDays

  const frameCount = visibleDays.length
  const frameWidthPercent = 100 / frameCount
  const translatePercent = -(safeSelectedIndex * frameWidthPercent)

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white flex items-center justify-center overflow-hidden">
      <div className="relative w-[1200px] h-[700px] rounded-[2rem] bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl border border-white/5">
        {/* Dev toggle */}
        <button
          onClick={() => setShowOvernight((prev) => !prev)}
          className="absolute top-5 right-5 z-30 rounded-full bg-white/10 px-4 py-2 text-xs tracking-wide text-white/80 hover:bg-white/15 transition"
        >
          {showOvernight ? 'Hide Overnight' : 'Test Overnight'}
        </button>

        <>
          {/* Sliding day strip */}
          <div
            className="absolute inset-0 flex transition-transform duration-700 ease-out"
            style={{
              width: `${frameCount * 100}%`,
              transform: `translateX(${translatePercent}%)`,
            }}
          >
            {visibleDays.map((day) => {
              const shouldShowOvernight = showOvernight && day.id === todayDate
              const frameDay = shouldShowOvernight ? overnightDayRecord : day

              return (
                <div
                  key={day.id}
                  className="h-full shrink-0"
                  style={{ width: `${frameWidthPercent}%` }}
                >
                  <DayFrame day={frameDay} />
                </div>
              )
            })}
          </div>

          {/* Side arrows */}
          <button
            onClick={goPrev}
            disabled={!canGoPrev}
            className="absolute left-5 top-1/2 -translate-y-1/2 z-20 text-5xl text-white/35 hover:text-white/60 disabled:opacity-20 transition"
            aria-label={previousDay ? `Go to ${previousDay.dateLabel}` : 'No previous day loaded'}
          >
            ‹
          </button>

          <button
            onClick={goNext}
            disabled={!canGoNext}
            className="absolute right-5 top-1/2 -translate-y-1/2 z-20 text-5xl text-white/35 hover:text-white/60 disabled:opacity-20 transition"
            aria-label={nextDay ? `Go to ${nextDay.dateLabel}` : 'No next day loaded'}
          >
            ›
          </button>
        </>

        {/* Bottom navigation */}
        <div className="absolute bottom-5 left-0 right-0 flex items-center justify-between px-10 z-30 text-white/70">
          <button
            onClick={goPrev}
            disabled={!canGoPrev}
            className="text-[1.05rem] hover:text-white disabled:opacity-25 transition"
          >
            {formatNavLabel(previousDay, 'prev')}
          </button>

          <button
            onClick={goToday}
            className="rounded-full bg-white/10 backdrop-blur-md px-8 py-3 text-[1.05rem] tracking-[0.14em] text-white/90 transition-transform duration-700 ease-out hover:bg-white/15"
            style={{ transform: `translateX(${todayButtonOffset}px)` }}
          >
            TODAY
          </button>

          <button
            onClick={goNext}
            disabled={!canGoNext}
            className="text-[1.05rem] hover:text-white disabled:opacity-25 transition"
          >
            {formatNavLabel(nextDay, 'next')}
          </button>
        </div>
      </div>
    </div>
  )
}
