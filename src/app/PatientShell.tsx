import { useState } from 'react'
import DayView from './DayView'
import { mockDays } from '../data/mockDays'

export default function PatientShell() {
  const [index, setIndex] = useState(1)

  const currentDay = mockDays[index]

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center">
      <div className="w-[1200px] h-[700px] rounded-3xl bg-white/5 backdrop-blur-xl overflow-hidden flex flex-col">

        {/* Main Day Content */}
        <DayView day={currentDay} />

        {/* Navigation */}
        <div className="flex justify-between items-center px-8 pb-4 text-sm opacity-60">
          <button onClick={() => setIndex(Math.max(0, index - 1))}>
            ← Yesterday
          </button>

          <button
            onClick={() => setIndex(1)}
            className="px-6 py-2 bg-white/10 rounded-full"
          >
            TODAY
          </button>

          <button onClick={() => setIndex(Math.min(mockDays.length - 1, index + 1))}>
            Tomorrow →
          </button>
        </div>

      </div>
    </div>
  )
}