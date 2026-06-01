import DayView from './DayView'
import WallpaperLayer from './WallpaperLayer'
import { type DayRecord } from '../data/mockDays'

export default function DayFrame({ day }: { day: DayRecord }) {
  const isOvernight = day.mode === 'overnight'

  return (
    <div className="relative w-full h-full">
      {/* Wallpaper — renders only when a record exists for this date */}
      <WallpaperLayer date={day.id} isOvernight={isOvernight} />

      {/* Gradient scrim — semi-transparent so the wallpaper shows through */}
      <div
        className={`absolute inset-0 ${
          isOvernight
            ? 'bg-gradient-to-br from-slate-950/85 via-slate-900/80 to-slate-950/90'
            : 'bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-700/65'
        }`}
      />

      {/* Radial highlight */}
      <div
        className={`absolute inset-0 ${
          isOvernight
            ? 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_40%)]'
            : 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_45%)]'
        }`}
      />

      <DayView day={day} />
    </div>
  )
}
