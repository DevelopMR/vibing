import { useEffect, useMemo, useRef, useState } from 'react'
import DayFrame from './DayFrame'
import {
  dayRecords,
  overnightDayRecord,
  todayDayRecord,
  type DayRecord,
} from '../data/mockDays'

const AUTO_RETURN_MS = 5000
const DRAG_COMMIT_THRESHOLD = 70
const GUIDED_RETURN_STEP_MS = 650

function formatNavLabel(day: DayRecord | undefined, direction: 'prev' | 'next') {
  if (!day) {
    return direction === 'prev' ? '← Earlier' : 'Later →'
  }

  return direction === 'prev' ? `← ${day.dateLabel}` : `${day.dateLabel} →`
}

export default function PatientShell() {
  const [selectedDate, setSelectedDate] = useState(todayDayRecord.id)
  const [showOvernight, setShowOvernight] = useState(false)
  const [dragOffsetPx, setDragOffsetPx] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isGuidedReturning, setIsGuidedReturning] = useState(false)
  const inactivityTimeoutRef = useRef<number | null>(null)
  const guidedReturnTimeoutRef = useRef<number | null>(null)
  const dragPointerIdRef = useRef<number | null>(null)
  const dragStartXRef = useRef(0)
  const dragDeltaRef = useRef(0)
  const frameViewportRef = useRef<HTMLDivElement | null>(null)

  const loadedDays = useMemo(() => dayRecords, [])
  const todayDate = todayDayRecord.id
  const todayIndex = loadedDays.findIndex((day) => day.id === todayDate)
  const selectedIndex = loadedDays.findIndex((day) => day.id === selectedDate)
  const safeSelectedIndex = selectedIndex >= 0 ? selectedIndex : todayIndex

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

  const clearInactivityTimer = () => {
    if (inactivityTimeoutRef.current !== null) {
      window.clearTimeout(inactivityTimeoutRef.current)
      inactivityTimeoutRef.current = null
    }
  }

  const clearGuidedReturnTimer = () => {
    if (guidedReturnTimeoutRef.current !== null) {
      window.clearTimeout(guidedReturnTimeoutRef.current)
      guidedReturnTimeoutRef.current = null
    }
  }

  const stopGuidedReturn = () => {
    clearGuidedReturnTimer()
    setIsGuidedReturning(false)
  }

  const cancelReturnBehavior = () => {
    clearInactivityTimer()
    stopGuidedReturn()
  }

  const scheduleReturnToToday = () => {
    clearInactivityTimer()

    if (selectedDate === todayDate) return

    inactivityTimeoutRef.current = window.setTimeout(() => {
      setIsGuidedReturning(true)
    }, AUTO_RETURN_MS)
  }

  useEffect(() => {
    if (selectedDate === todayDate) {
      cancelReturnBehavior()
      return
    }

    if (isGuidedReturning) {
      clearInactivityTimer()
      clearGuidedReturnTimer()

      guidedReturnTimeoutRef.current = window.setTimeout(() => {
        setSelectedDate((currentDate) => {
          const currentIndex = loadedDays.findIndex((day) => day.id === currentDate)

          if (currentIndex === -1 || currentIndex === todayIndex) {
            return todayDate
          }

          const nextIndex = currentIndex > todayIndex ? currentIndex - 1 : currentIndex + 1
          return loadedDays[nextIndex]?.id ?? todayDate
        })
      }, GUIDED_RETURN_STEP_MS)

      return clearGuidedReturnTimer
    }

    scheduleReturnToToday()
    return clearInactivityTimer
  }, [isGuidedReturning, loadedDays, selectedDate, todayDate, todayIndex])

  const goPrev = () => {
    if (!canGoPrev) return
    cancelReturnBehavior()
    setSelectedDate(loadedDays[safeSelectedIndex - 1].id)
  }

  const goNext = () => {
    if (!canGoNext) return
    cancelReturnBehavior()
    setSelectedDate(loadedDays[safeSelectedIndex + 1].id)
  }

  const goToday = () => {
    cancelReturnBehavior()
    setSelectedDate(todayDate)
  }

  const previousDay = loadedDays[safeSelectedIndex - 1]
  const nextDay = loadedDays[safeSelectedIndex + 1]
  const visibleDays = loadedDays

  const frameCount = visibleDays.length
  const frameWidthPercent = 100 / frameCount
  const translatePercent = -(safeSelectedIndex * frameWidthPercent)
  const dragTranslatePercent = frameViewportRef.current
    ? (dragOffsetPx / frameViewportRef.current.clientWidth) * frameWidthPercent
    : 0

  const resetDragState = () => {
    dragPointerIdRef.current = null
    dragStartXRef.current = 0
    dragDeltaRef.current = 0
    setDragOffsetPx(0)
    setIsDragging(false)
  }

  const commitDrag = () => {
    const delta = dragDeltaRef.current

    if (Math.abs(delta) < DRAG_COMMIT_THRESHOLD) {
      resetDragState()
      scheduleReturnToToday()
      return
    }

    if (delta > 0 && canGoPrev) {
      setSelectedDate(loadedDays[safeSelectedIndex - 1].id)
    } else if (delta < 0 && canGoNext) {
      setSelectedDate(loadedDays[safeSelectedIndex + 1].id)
    }

    resetDragState()
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-6 text-white">
      <div className="flex w-[1280px] flex-col gap-6">
        <div className="relative h-[708px] overflow-hidden rounded-[2.2rem] border border-white/5 bg-white/5 shadow-2xl backdrop-blur-xl">
          {/* Dev toggle */}
          <button
            onClick={() => setShowOvernight((prev) => !prev)}
            className="absolute right-6 top-6 z-30 rounded-full bg-white/10 px-4 py-2 text-xs tracking-wide text-white/80 transition hover:bg-white/15"
          >
            {showOvernight ? 'Hide Overnight' : 'Test Overnight'}
          </button>

          <>
            {/* Sliding day strip */}
            <div
              ref={frameViewportRef}
              className="absolute inset-0 touch-pan-y overflow-hidden"
              onPointerDown={(event) => {
                if (event.pointerType === 'mouse' && event.button !== 0) return
                if ((event.target as HTMLElement).closest('button')) return

                cancelReturnBehavior()
                dragPointerIdRef.current = event.pointerId
                dragStartXRef.current = event.clientX
                dragDeltaRef.current = 0
                setDragOffsetPx(0)
                setIsDragging(true)
                event.currentTarget.setPointerCapture(event.pointerId)
              }}
              onPointerMove={(event) => {
                if (dragPointerIdRef.current !== event.pointerId) return

                const nextDelta = event.clientX - dragStartXRef.current
                const resistedDelta =
                  (nextDelta > 0 && !canGoPrev) || (nextDelta < 0 && !canGoNext)
                    ? nextDelta * 0.35
                    : nextDelta

                dragDeltaRef.current = nextDelta
                setDragOffsetPx(resistedDelta)
              }}
              onPointerUp={(event) => {
                if (dragPointerIdRef.current !== event.pointerId) return
                event.currentTarget.releasePointerCapture(event.pointerId)
                commitDrag()
              }}
              onPointerCancel={(event) => {
                if (dragPointerIdRef.current !== event.pointerId) return
                event.currentTarget.releasePointerCapture(event.pointerId)
                resetDragState()
                scheduleReturnToToday()
              }}
            >
              <div
                className={`absolute inset-0 flex ${
                  isDragging ? '' : 'transition-transform duration-700 ease-out'
                }`}
                style={{
                  width: `${frameCount * 100}%`,
                  transform: `translateX(${translatePercent + dragTranslatePercent}%)`,
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
            </div>

            {/* Side arrows */}
            <button
              onClick={goPrev}
              disabled={!canGoPrev}
              className="absolute left-4 top-[52%] z-20 -translate-y-1/2 text-5xl text-white/35 transition hover:text-white/60 disabled:opacity-20"
              aria-label={previousDay ? `Go to ${previousDay.dateLabel}` : 'No previous day loaded'}
            >
              ‹
            </button>

            <button
              onClick={goNext}
              disabled={!canGoNext}
              className="absolute right-4 top-[52%] z-20 -translate-y-1/2 text-5xl text-white/35 transition hover:text-white/60 disabled:opacity-20"
              aria-label={nextDay ? `Go to ${nextDay.dateLabel}` : 'No next day loaded'}
            >
              ›
            </button>
          </>
        </div>

        <div className="flex items-center justify-between px-10 text-white/72">
          <button
            onClick={goPrev}
            disabled={!canGoPrev}
            className="min-w-[250px] text-left text-[1rem] transition hover:text-white disabled:opacity-25"
          >
            {formatNavLabel(previousDay, 'prev')}
          </button>

          <button
            onClick={goToday}
            className="rounded-full bg-white/10 px-9 py-3 text-[1rem] tracking-[0.14em] text-white/90 backdrop-blur-md transition-transform duration-700 ease-out hover:bg-white/15"
            style={{ transform: `translateX(${todayButtonOffset}px)` }}
          >
            TODAY
          </button>

          <button
            onClick={goNext}
            disabled={!canGoNext}
            className="min-w-[250px] text-right text-[1rem] transition hover:text-white disabled:opacity-25"
          >
            {formatNavLabel(nextDay, 'next')}
          </button>
        </div>
      </div>
    </div>
  )
}
