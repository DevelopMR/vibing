# ARCHITECTURE.md

## Repository Goal
This repository is a **browser-first React prototype** for the Comfort Day interface.

The prototype is testing:
- visual clarity
- state behavior
- side-to-side day navigation
- whether the experience feels immediately understandable for dementia patients

It is **not yet** a production app and is **not yet** integrated with live APIs.

---

## Current Stack
From `package.json`, the current stack is Vite + React + TypeScript + Tailwind CSS with React 18 and Vite 5.

---

## Current Repository Shape
The current implementation centers around:
- `src/app/PatientShell.tsx`
- `src/app/DayView.tsx`
- `src/app/DayFrame.tsx`
- `src/data/mockDays.ts`

### What exists now
`PatientShell.tsx` currently owns:
- active day index
- overnight test toggle
- TODAY button offset logic
- auto-return timer
- day strip rendering for a temporary past/current/future demo slice
- overnight test rendering, which should be reworked into a visual state on today rather than a separate frame
- button-based navigation for yesterday / today / tomorrow

`DayView.tsx` currently renders:
- calendar icon
- current/past/future content layout
- overnight content layout
- time/date/weather
- meds/meals
- tasks
- message area
- attachment icon placeholder in past/future

---

## Core Architectural Model

## 1. Day-Based Frame Model
The app is organized as one day per frame.

There are four conceptual states:
- Past Day
- Current Day
- Future Day
- Overnight

### Current implementation
The current code treats:
- past/current/future as a sliding strip
- overnight as a separate rendered view

The sliding strip is the right direction.
The separate overnight frame is not.

### Corrected architectural rule
- each navigable frame represents a calendar day
- `overnight` is not a fourth navigable frame
- overnight is a visual/state variation of the current day during the proper overnight time window
- the selected day and the current time-of-day state must be modeled separately

This distinction is foundational for future navigation and rollback behavior.

---

## 2. UI State vs Data State
Keep these separate.

### UI state
Should include:
- selected date/frame identity
- overnight state for today
- rollback timer
- content-open state
- drag state
- settling state
- interaction hold state

### Data state
Should include:
- local day records
- weather data
- messages
- attachments
- meds
- meals
- wallpapers

Current `mockDays.ts` is already serving as the first local data layer.

### View-model state
Between UI state and raw data, the app should also have a shaping layer for:
- mode-specific labels
- read-only affordances
- preview language for future dates
- attachment visibility
- weather display treatment by day mode

This keeps `DayView` presentational rather than rule-heavy.

---

## 3. Recommended Near-Term Architecture

### `PatientShell`
Responsibilities:
- root patient UI container
- frame strip layout
- transitions between day frames in a rolling continuous sequence
- today rollback timer
- overnight application to the current day
- date-aware navigation button behavior
- eventually gesture handling

### `DayFrame`
Responsibilities:
- background / per-frame presentation shell
- visual frame wrapper
- eventually wallpaper binding
- visual awareness of current-day overnight treatment when applicable

### `DayView`
Responsibilities:
- render the content of a single day
- branch visuals by mode
- remain largely presentational

### `mockDays`
Responsibilities:
- local day data for prototype testing
- should later become replaceable by async services

---

## 4. Navigation Architecture
The biggest current architectural hotspot is the day-strip translation math.

### Desired behavior
- one viewport-width frame at a time
- stable snap/landing positions
- rollback to today after inactivity
- later: drag navigation
- overnight should not change the strip identity or break the strip math
- adjacent navigation labels should reflect the real neighboring dates
- the system should be able to preload past and future days beyond the initial visible set

### Recommended long-term approach
Use a fixed viewport strip model:
- each frame = 100% viewport width
- strip width = N * 100%
- transform based on selected frame position within the loaded day window
- snap only to valid frame boundaries
- maintain a rolling loaded range around today so movement feels continuous rather than capped at three demo frames
- treat `today` as the behavioral anchor for rollback, not as a permanent middle slot

The current project encountered bugs here already, so keep this area simple and explicit.

---

## 5. State Roadmap

### Current state support
- past
- current
- future
- overnight visual treatment for today only

### Planned additions
- content-open hold state
- pointer drag state
- rollback pause while interacting with content
- caregiver unlock state for calendar editing

---

## 6. Data Roadmap

## Current
Local mocked day data.

## Planned
Async-ready adapters for:
- weather
- wallpaper/image lookup
- day record storage
- calendar/provider integration

### Key rule
Even while using local mock data, design interfaces as async boundaries.

For example:
- `getDayRecord(date): Promise<DayRecord>`
- `getWeather(date): Promise<WeatherRecord>`
- `getWallpaper(date): Promise<WallpaperRecord>`

This project has multiple future data pinch points, so async structure matters early.

---

## 7. Styling System Guidance
The visual direction is intentionally not generic Tailwind-dashboard styling.

### Desired traits
- calm glass surface
- serious sans-serif typography
- cool neutral colors
- low clutter
- minimal inner borders
- strong readability
- no cartoonish or medical feel

### Known weak area
The lower-left meds/meals zone has been repeatedly identified as a clarity hotspot and should be treated carefully.

---

## 8. Prototype Build Priorities
In order:

1. Rebuild the navigation foundation around a rolling day-strip model.
2. Stabilize frame landing and strip math.
3. Add drag/pointer day navigation.
4. Keep rollback to today reliable.
5. Improve UI polish toward approved mock direction.
6. Add local wallpapers.
7. Add content-open behavior for attachments/messages.
8. Add calendar overlay shell and caregiver unlock stub.

### Phase 1 success criteria
The navigation foundation phase is successful when:
- the strip lands only on full-day boundaries
- the selected day is an explicit date identity rather than a hard-coded array slot
- navigation can move across a rolling range of days
- return-to-today behavior is reliable
- overnight can be applied to today without introducing a separate frame or breaking navigation

---

## 9. Prototype vs Future Accessibility Layer
The full Motion Module is intended to become a reusable disability-oriented interaction library later.

### Prototype
Only needs:
- reliable navigation
- basic clicks/toggles
- rollback timer
- stable rendering

### Future Motion Module
Will eventually handle:
- jitter rejection
- release-based commit
- multi-touch safe-area drag
- rejected touch trace feedback
- tolerant gesture interpretation

Do not overbuild this library inside the prototype too early.

---

## 10. Important Non-Technical Constraint
This project is highly sensitive to **feel**.
Technical correctness alone is not enough. The interface must feel:
- calm
- obvious
- safe
- non-demanding
- emotionally stable

Any future architecture work should preserve that.
