import { type DayRecord } from '../data/mockDays'

function TaskRow({ completed, label }: { completed: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3 text-[1.15rem]">
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${completed
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
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${done
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

  return (
    <div className="relative w-full h-full px-14 pt-14 pb-24">
      {/* Calendar icon */}
      <button
        className="absolute left-8 top-8 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white/90 backdrop-blur-md border border-white/10"
        aria-label="Open calendar"
      >
        <span className="text-xl">🗓️</span>
      </button>

      {/* OVERNIGHT MODE */}
      {isOvernight ? (
        <div className="h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[4.5rem] leading-none font-semibold tracking-tight">
                {day.timeLabel}
              </div>
              <div className="mt-2 text-[1.95rem] text-white/75">{day.dateLabel}</div>
            </div>

            <div className="w-[280px] rounded-3xl bg-white/5 border border-white/10 p-6">
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
            <div className="w-[430px] rounded-[2rem] bg-white/8 border border-white/10 px-8 py-8 text-right">
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
        <div className="h-full grid grid-cols-[1.2fr_0.8fr] gap-10">
          {/* LEFT SIDE */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="text-[5.2rem] leading-none font-semibold tracking-tight">
                {day.timeLabel}
              </div>
              <div className="mt-3 text-[2rem] text-white/75">{day.dateLabel}</div>

              <div className="mt-10 flex items-start gap-8">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-5xl">
                      {isPast ? '🌤️' : isFuture ? '⛅' : '☀️'}
                    </span>
                    <span className="text-[2.35rem] text-white/92">{day.weather.temp}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {day.weather.hourly.length > 0 && (
                    <div className="flex items-end gap-5 text-white/80">
                      {day.weather.hourly.map((hour) => (
                        <div key={hour.time} className="text-center">
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

            {/* Lower left */}
            <div className="rounded-[1.75rem] bg-white/5 border border-white/10 px-8 py-7">
              <div className="text-[1rem] uppercase tracking-[0.14em] text-white/45">Meds</div>

              <div className="mt-4 flex items-start gap-8">
                {/* Pillbox visual centerpiece */}
                <div className="rounded-[1.5rem] bg-white/8 border border-white/10 p-4 shadow-inner">
                  <div className="flex gap-3">
                    <div
                      className={`w-[120px] h-[92px] rounded-2xl border border-white/10 flex items-center justify-center text-[2rem] ${day.meds.amDone
                          ? 'bg-sky-200/20 text-white/90'
                          : 'bg-white/5 text-white/75'
                        }`}
                    >
                      AM
                    </div>

                    <div
                      className={`w-[120px] h-[92px] rounded-2xl border border-white/10 flex items-center justify-center text-[2rem] ${day.meds.pmDone
                          ? 'bg-emerald-300/20 text-white/90'
                          : 'bg-white/5 text-white/75'
                        }`}
                    >
                      PM
                    </div>
                  </div>

                  <div className="mt-4 text-[1.55rem] text-white/80">
                    {day.meds.amDone && day.meds.pmDone
                      ? 'Done'
                      : day.meds.amDone
                        ? 'Morning done'
                        : 'Take now'}
                  </div>
                </div>

                {/* Meals simple text */}
                <div className="pt-2">
                  <div className="text-[1rem] uppercase tracking-[0.14em] text-white/45">Meals</div>

                  <div className="mt-4 space-y-3">
                    <MealRow done={day.meals.breakfast} label="Breakfast" />
                    <MealRow done={day.meals.lunch} label="Lunch" />
                    <MealRow done={day.meals.dinner} label="Dinner" />
                  </div>

                  <div className="mt-6 text-[1.15rem] text-white/65">
                    Calories: {day.meals.calories}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col justify-between">
            <div className="rounded-[1.75rem] bg-white/5 border border-white/10 px-8 py-7">
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

            <div className="rounded-[1.75rem] bg-white/5 border border-white/10 px-8 py-7">
              <div className="flex items-start gap-4">
                <span className="text-3xl text-white/55">💬</span>
                <div className="text-[1.65rem] leading-relaxed text-white/90">
                  {day.message}
                </div>
              </div>

              {(isPast || isFuture) && (
                <div className="mt-6 flex gap-3 justify-end text-2xl text-white/60">
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