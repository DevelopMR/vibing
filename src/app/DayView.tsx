import { DayRecord } from '../data/mockDays'

export default function DayView({ day }: { day: DayRecord }) {
  return (
    <div className="w-full h-full p-8 flex flex-col justify-between">
      {/* Top Section */}
      <div className="flex justify-between">
        <div>
          <div className="text-6xl font-semibold">{day.timeLabel}</div>
          <div className="text-xl opacity-70 mt-1">{day.dateLabel}</div>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-2xl">☀️</span>
            <span className="text-xl">{day.weather.temp}</span>
          </div>

          {day.weather.warning && (
            <div className="mt-2 text-sm text-amber-400">
              ⚠ {day.weather.warning}
            </div>
          )}
        </div>

        {/* Tasks */}
        <div className="w-[40%]">
          <div className="text-sm opacity-50">{day.nextLabel}</div>
          <div className="text-lg font-medium mb-4">{day.nextTask}</div>

          <div className="space-y-2">
            {day.tasks.map((t) => (
              <div key={t.id} className="flex items-center gap-2">
                <span>{t.completed ? '✅' : '⭕'}</span>
                <span className={t.completed ? 'opacity-70' : ''}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-end">
        {/* Health */}
        <div>
          <div className="text-sm opacity-50 mb-2">Medication</div>
          <div className="text-lg">
            AM {day.meds.amDone ? '✔' : '○'} | PM {day.meds.pmDone ? '✔' : '○'}
          </div>

          <div className="text-sm opacity-50 mt-4">Meals</div>
          <div className="text-lg">
            Breakfast {day.meals.breakfast ? '✔' : '○'}
          </div>
          <div className="text-lg">
            Lunch {day.meals.lunch ? '✔' : '○'}
          </div>
          <div className="text-lg">
            Dinner {day.meals.dinner ? '✔' : '○'}
          </div>
        </div>

        {/* Message */}
        <div className="w-[40%] text-lg">
          {day.message}
        </div>
      </div>
    </div>
  )
}
