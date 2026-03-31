import DayView from './DayView'
import { type DayRecord } from '../data/mockDays'

export default function DayFrame({ day }: { day: DayRecord }) {
  return (
    <div className="relative w-full h-full">
      <div
        className={`absolute inset-0 ${
          day.mode === 'overnight'
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950'
            : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700'
        }`}
      />

      <div
        className={`absolute inset-0 ${
          day.mode === 'overnight'
            ? 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]'
            : 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%)]'
        }`}
      />

      <DayView day={day} />
    </div>
  )
}