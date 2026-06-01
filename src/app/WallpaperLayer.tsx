import { useEffect, useState } from 'react'
import { getWallpaper } from '../wallpaper/service'
import type { WallpaperRecord } from '../wallpaper/types'

type Props = {
  date: string
  isOvernight: boolean
}

export default function WallpaperLayer({ date, isOvernight }: Props) {
  const [record, setRecord] = useState<WallpaperRecord | null>(null)

  useEffect(() => {
    let cancelled = false
    getWallpaper(date).then((r) => {
      if (!cancelled) setRecord(r)
    })
    return () => { cancelled = true }
  }, [date])

  const url = record ? (isOvernight ? record.nightUrl : record.dayUrl) : null
  if (!url) return null

  return (
    <img
      src={url}
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
      style={{ opacity: 0.55 }}
      draggable={false}
    />
  )
}
