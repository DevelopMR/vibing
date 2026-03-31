import { useEffect, useMemo, useRef, useState } from 'react'
import DayFrame from './DayFrame'
import { mockDays, type DayRecord } from '../data/mockDays'

const TODAY_INDEX = 1
const AUTO_RETURN_MS = 5000

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export default function PatientShell() {
  const [index, setIndex] = useState(TODAY_INDEX)
  const [showOvernight, setShowOvernight] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const currentIndex = showOvernight ? 3 : index
  const currentDay = mockDays[currentIndex]

  const canGoPrev = !showOvernight && index > 0
  const canGoNext = !showOvernight && index < 2

  const dayOffset = showOvernight ? 0 : index - TODAY_INDEX

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

    if (showOvernight) return
    if (index === TODAY_INDEX) return

    timeoutRef.current = window.setTimeout(() => {
      setIndex(TODAY_INDEX)
    }, AUTO_RETURN_MS)
  }

  useEffect(() => {
    scheduleReturnToToday()
    return clearReturnTimer
  }, [index, showOvernight])

  const goPrev = () => {
    if (!canGoPrev) return
    setIndex((prev) => clamp(prev - 1, 0, 2))
  }

  const goNext = () => {
    if (!canGoNext) return
    setIndex((prev) => clamp(prev + 1, 0, 2))
  }

  const goToday = () => {
    clearReturnTimer()
    setShowOvernight(false)
    setIndex(TODAY_INDEX)
  }

  const visibleDays: DayRecord[] = useMemo(() => {
    if (showOvernight) return [mockDays[3]]

    return [mockDays[0], mockDays[1], mockDays[2]]
  }, [showOvernight])

  const translateX = useMemo(() => {
    if (showOvernight) return 0
    return -index * 100
  }, [index, showOvernight])

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white flex items-center justify-center overflow-hidden">
      <div className="relative w-[1200px] h-[700px] rounded-[2rem] bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl border border-white/5">
        {/* Dev toggle */}
        <button
          onClick={() => setShowOvernight((prev) => !prev)}
          className="absolute top-5 right-5 z-20 rounded-full bg-white/10 px-4 py-2 text-xs tracking-wide text-white/80 hover:bg-white/15 transition"
        >
          {showOvernight ? 'Exit Overnight' : 'Test Overnight'}
        </button>

        {/* Sliding day strip */}
        <div
          className="absolute inset-0 flex transition-transform duration-700 ease-out"
          style={{
            width: `${visibleDays.length * 100}%`,
            transform: `translateX(${translateX}%)`,
          }}
        >
          {visibleDays.map((day) => (
            <div
              key={day.id}
              className="h-full shrink-0"
              style={{ width: `${100 / visibleDays.length}%` }}
            >
              <DayFrame day={day} />
            </div>
          ))}
        </div>

        {/* Navigation controls */}
        {!showOvernight && (
          <>
            <button
              onClick={goPrev}
              disabled={!canGoPrev}
              className="absolute left-5 top-1/2 -translate-y-1/2 z-10 text-5xl text-white/35 hover:text-white/60 disabled:opacity-20 transition"
              aria-label="Go to previous day"
            >
              ‹
            </button>

            <button
              onClick={goNext}
              disabled={!canGoNext}
              className="absolute right-5 top-1/2 -translate-y-1/2 z-10 text-5xl text-white/35 hover:text-white/60 disabled:opacity-20 transition"
              aria-label="Go to next day"
            >
              ›
            </button>
          </>
        )}

        {/* Bottom navigation */}
        <div className="absolute bottom-5 left-0 right-0 flex items-center justify-between px-10 z-10 text-white/70">
          <button
            onClick={goPrev}
            disabled={!canGoPrev || showOvernight}
            className="text-[1.05rem] hover:text-white disabled:opacity-25 transition"
          >
            ← Yesterday
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
            disabled={!canGoNext || showOvernight}
            className="text-[1.05rem] hover:text-white disabled:opacity-25 transition"
          >
            Tomorrow →
          </button>
        </div>
      </div>
    </div>
  )
}