import { type DayRecord } from '../data/mockDays'

function TaskRow({ completed, label }: { completed: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3 text-[1.15rem]">
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${
          completed
            ? 'border-emerald-300 bg-emerald-300/20 text-emerald-200'
            : 'border-white/30 text-transparent'
        }`}
      >
        •
      </span>
      <span className={completed ? 'text-white/80' : 'text-white/95'}>{label}</span>
    </div>
  )
}

function MealRow({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3 text-[1.1rem]">
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${
          done
            ? 'border-emerald-300 bg-emerald-300/20 text-emerald-200'
            : 'border-white/25 text-transparent'
        }`}
      >
        •
      </span>
      <span className={done ? 'text-white/90' : 'text-white/80'}>{label}</span>
    </div>
  )
}

export default function DayView({ day }: { day: DayRecord }) {
  const isOvernight = day.mode === 'overnight'
  const isPast = day.mode === 'past'
  const isFuture = day.mode === 'future'
  const weatherIcon = isPast ? '🌤️' : isFuture ? '⛅' : '☀️'

  return (
    <div className="relative h-full w-full px-16 pb-16 pt-14">
      <button
        className="absolute left-8 top-8 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white/90 backdrop-blur-md"
        aria-label="Open calendar"
      >
        <span className="text-xl">🗓️</span>
      </button>

      {isOvernight ? (
        <div className="flex h-full flex-col justify-between gap-12">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[4.5rem] leading-none font-semibold tracking-tight">
                {day.timeLabel}
              </div>
              <div className="mt-2 text-[1.95rem] text-white/75">{day.dateLabel}</div>
            </div>

            <div className="w-[280px] rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm uppercase tracking-[0.16em] text-white/45">
                Tomorrow
              </div>
              <div className="mt-4 space-y-4 text-[1.25rem] text-white/90">
                <div>Clean Shoes</div>
                <div>Buy Milk</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[1.8rem] text-white/80">
            <span className="text-5xl">🌙</span>
            <div>
              <div className="text-[2rem] text-white/90">{day.weather.temp}</div>
              <div className="text-white/60">{day.weather.condition}</div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-[430px] rounded-[2rem] border border-white/10 bg-white/8 px-8 py-8 text-right">
              <div className="text-[2.2rem] text-white/92">Good night, Dad.</div>
              <div className="mt-5 text-[1.55rem] leading-relaxed text-white/80">
                You did great today.
                <br />
                Sleep well.
                <br />I love you.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid h-full grid-cols-[minmax(0,1.22fr)_minmax(360px,0.82fr)] grid-rows-[auto_minmax(0,1fr)] gap-x-12 gap-y-8">
          <div className="row-span-2 flex flex-col gap-10">
            <div className="pt-1">
              <div className="text-[5.2rem] leading-none font-semibold tracking-tight">
                {day.timeLabel}
              </div>
              <div className="mt-3 text-[2rem] text-white/75">{day.dateLabel}</div>

              <div className="mt-10 flex items-start gap-11">
                <div className="min-w-[188px]">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{weatherIcon}</span>
                    <span className="text-[2.35rem] text-white/92">{day.weather.temp}</span>
                  </div>
                  <div className="mt-2 text-[1.1rem] text-white/58">{day.weather.condition}</div>
                </div>

                <div className="flex min-w-0 flex-col gap-4">
                  {day.weather.hourly.length > 0 && (
                    <div className="flex items-end gap-6 text-white/80">
                      {day.weather.hourly.map((hour) => (
                        <div key={hour.time} className="min-w-[54px] text-center">
                          <div className="text-2xl">{hour.icon}</div>
                          <div className="mt-1 text-sm">{hour.time}</div>
                          {hour.temp && <div className="text-sm">{hour.temp}</div>}
                        </div>
                      ))}
                    </div>
                  )}

                  {day.weather.warning && (
                    <div className="text-[1.15rem] text-amber-300">⚠ {day.weather.warning}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mr-2 rounded-[1.95rem] border border-white/10 bg-white/5 px-10 py-9">
              <div className="grid min-h-[308px] grid-cols-[minmax(286px,1fr)_minmax(230px,0.72fr)] gap-x-10 gap-y-6">
                <div className="text-[1rem] uppercase tracking-[0.14em] text-white/45">Meds</div>
                <div className="text-[1rem] uppercase tracking-[0.14em] text-white/45">Meals</div>

                <div className="flex min-h-[232px] flex-col justify-between rounded-[1.55rem] border border-white/10 bg-white/6 px-7 py-7 shadow-inner">
                  <div className="flex gap-4">
                    <div
                      className={`flex h-[92px] w-[120px] items-center justify-center rounded-2xl border border-white/10 text-[2rem] ${
                        day.meds.amDone
                          ? 'bg-sky-200/20 text-white/90'
                          : 'bg-white/5 text-white/75'
                      }`}
                    >
                      AM
                    </div>

                    <div
                      className={`flex h-[92px] w-[120px] items-center justify-center rounded-2xl border border-white/10 text-[2rem] ${
                        day.meds.pmDone
                          ? 'bg-emerald-300/20 text-white/90'
                          : 'bg-white/5 text-white/75'
                      }`}
                    >
                      PM
                    </div>
                  </div>

                  <div className="pt-4 text-[1.5rem] leading-none text-white/80">
                    {day.meds.amDone && day.meds.pmDone
                      ? 'Done'
                      : day.meds.amDone
                        ? 'Morning done'
                        : 'Take now'}
                  </div>
                </div>

                <div className="flex min-h-[232px] flex-col pt-1">
                  <div className="space-y-4">
                    <MealRow done={day.meals.breakfast} label="Breakfast" />
                    <MealRow done={day.meals.lunch} label="Lunch" />
                    <MealRow done={day.meals.dinner} label="Dinner" />
                  </div>

                  <div className="mt-auto pt-8 text-[1.15rem] text-white/65">
                    Calories: {day.meals.calories}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="self-start rounded-[1.95rem] border border-white/10 bg-white/5 px-9 py-8">
            <div className="min-h-[252px]">
              <div className="text-[1rem] uppercase tracking-[0.14em] text-white/45">
                {day.nextLabel}
              </div>
              <div className="mt-4 text-[2.2rem] font-medium text-white/95">{day.nextTask}</div>

              <div className="mt-8 space-y-4">
                {day.tasks.map((task) => (
                  <TaskRow key={task.id} completed={task.completed} label={task.label} />
                ))}
              </div>
            </div>
          </div>

          <div className="self-end">
            <div className="w-full rounded-[1.95rem] border border-white/10 bg-white/5 px-9 py-8">
              <div className="flex items-start gap-4">
                <span className="text-3xl text-white/55">💬</span>
                <div className="text-[1.65rem] leading-relaxed text-white/90">
                  {day.message}
                </div>
              </div>

              {(isPast || isFuture) && (
                <div className="mt-6 flex justify-end gap-3 text-2xl text-white/60">
                  <span>🖼️</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
