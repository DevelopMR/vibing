import { type DayRecord } from '../data/mockDays'

function TaskRow({ completed, label }: { completed: boolean; label: string }) {
  return (
    <div className="day-list-row day-task-row">
      <span className={`day-list-bullet ${completed ? 'is-complete' : 'is-pending'}`}>
        •
      </span>
      <span className={completed ? 'day-task-label is-complete' : 'day-task-label is-pending'}>
        {label}
      </span>
    </div>
  )
}

function MealRow({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="day-list-row day-meal-row">
      <span className={`day-list-bullet ${done ? 'is-complete' : 'is-pending'}`}>
        •
      </span>
      <span className={done ? 'day-meal-label is-complete' : 'day-meal-label is-pending'}>
        {label}
      </span>
    </div>
  )
}

export default function DayView({ day }: { day: DayRecord }) {
  const isOvernight = day.mode === 'overnight'
  const isPast = day.mode === 'past'
  const isFuture = day.mode === 'future'
  const weatherIcon = isPast ? '🌤️' : isFuture ? '⛅' : '☀️'

  return (
    <div className="day-view">
      <button className="day-view__calendar" aria-label="Open calendar">
        <span className="day-view__calendar-icon">🗓️</span>
      </button>

      {isOvernight ? (
        <div className="day-view__overnight">
          <div className="day-view__overnight-top">
            <div className="day-view__overnight-headline">
              <div className="day-view__overnight-time">{day.timeLabel}</div>
              <div className="day-view__overnight-date">{day.dateLabel}</div>
            </div>

            <div className="day-card day-card--overnight-next">
              <div className="day-card__eyebrow">Tomorrow</div>
              <div className="day-card__stack">
                <div>Clean Shoes</div>
                <div>Buy Milk</div>
              </div>
            </div>
          </div>

          <div className="day-view__overnight-weather">
            <span className="day-view__overnight-weather-icon">🌙</span>
            <div>
              <div className="day-view__overnight-temp">{day.weather.temp}</div>
              <div className="day-view__overnight-condition">{day.weather.condition}</div>
            </div>
          </div>

          <div className="day-view__overnight-message-wrap">
            <div className="day-card day-card--overnight-message">
              <div className="day-view__overnight-message-title">Good night, Dad.</div>
              <div className="day-view__overnight-message-body">
                You did great today.
                <br />
                Sleep well.
                <br />I love you.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="day-view__body">
          <div className="day-view__primary">
            <div className="day-view__header">
              <div className="day-view__time">{day.timeLabel}</div>
              <div className="day-view__date">{day.dateLabel}</div>

              <div className="day-view__weather-row">
                <div className="day-view__weather-summary">
                  <div className="day-view__weather-summary-main">
                    <span className="day-view__weather-icon">{weatherIcon}</span>
                    <span className="day-view__weather-temp">{day.weather.temp}</span>
                  </div>
                  <div className="day-view__weather-condition">{day.weather.condition}</div>
                </div>

                <div className="day-view__weather-detail">
                  {day.weather.hourly.length > 0 && (
                    <div className="day-view__hourly-list">
                      {day.weather.hourly.map((hour) => (
                        <div key={hour.time} className="day-view__hourly-item">
                          <div className="day-view__hourly-icon">{hour.icon}</div>
                          <div className="day-view__hourly-time">{hour.time}</div>
                          {hour.temp && <div className="day-view__hourly-temp">{hour.temp}</div>}
                        </div>
                      ))}
                    </div>
                  )}

                  {day.weather.warning && (
                    <div className="day-view__weather-warning">⚠ {day.weather.warning}</div>
                  )}
                </div>
              </div>
            </div>

            <div id="day-meds-meals" className="day-card day-card--meds-meals">
              <div className="day-view__meds-meals">
                <div className="day-view__meds-column">
                  <div className="day-section-title">Meds</div>

                  <div id="day-meds-card" className="day-card day-card--meds-inner">
                    <div className="day-view__med-toggle-row">
                      <div
                        className={`day-view__med-toggle ${day.meds.amDone ? 'is-am-done' : 'is-pending'}`}
                      >
                        AM
                      </div>

                      <div
                        className={`day-view__med-toggle ${day.meds.pmDone ? 'is-pm-done' : 'is-pending'}`}
                      >
                        PM
                      </div>
                    </div>

                    <div className="day-view__med-status">
                      {day.meds.amDone && day.meds.pmDone
                        ? 'Done'
                        : day.meds.amDone
                          ? 'Morning done'
                          : 'Take now'}
                    </div>
                  </div>
                </div>

                <div className="day-view__meals-column">
                  <div className="day-section-title">Meals</div>

                  <div className="day-view__meals-content">
                    <div className="day-view__meal-list">
                      <MealRow done={day.meals.breakfast} label="Breakfast" />
                      <MealRow done={day.meals.lunch} label="Lunch" />
                      <MealRow done={day.meals.dinner} label="Dinner" />
                    </div>

                    <div className="day-view__calories">
                      Calories: {day.meals.calories}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="day-view__secondary">
            <div className="day-card day-card--next">
              <div className="day-card__body day-card__body--tall">
                <div className="day-card__eyebrow">{day.nextLabel}</div>
                <div className="day-card__headline">{day.nextTask}</div>

                <div className="day-card__list">
                  {day.tasks.map((task) => (
                    <TaskRow key={task.id} completed={task.completed} label={task.label} />
                  ))}
                </div>
              </div>
            </div>

            <div className="day-card day-card--message">
              <div className="day-view__message-row">
                <span className="day-view__message-icon">💬</span>
                <div className="day-view__message-text">
                  {day.message}
                </div>
              </div>

              {(isPast || isFuture) && (
                <div className="day-view__message-attachments">
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
