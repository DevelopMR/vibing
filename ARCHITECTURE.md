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
- day strip rendering for past/current/future
- overnight rendered as a separate mode
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

This is the right direction and should remain.

---

## 2. UI State vs Data State
Keep these separate.

### UI state
Should include:
- centered/active frame index
- overnight toggle/state
- rollback timer
- content-open state
- eventually drag state

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

---

## 3. Recommended Near-Term Architecture

### `PatientShell`
Responsibilities:
- root patient UI container
- frame strip layout
- transitions between day frames
- today rollback timer
- overnight test mode
- TODAY button behavior
- eventually gesture handling

### `DayFrame`
Responsibilities:
- background / per-frame presentation shell
- visual frame wrapper
- eventually wallpaper binding

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
- overnight should not break the strip math

### Recommended long-term approach
Use a fixed viewport strip model:
- each frame = 100% viewport width
- strip width = N * 100%
- transform based on frame index
- snap only to valid frame boundaries

The current project encountered bugs here already, so keep this area simple and explicit.

---

## 5. State Roadmap

### Current state support
- past
- current
- future
- overnight (test toggle)

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
- `getDayRecord(date): Promise[DayRecord]`
- `getWeather(date): Promise[WeatherRecord]`
- `getWallpaper(date): Promise[WallpaperRecord]`

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

1. Stabilize frame landing and strip math.
2. Add drag/pointer day navigation.
3. Keep rollback to today reliable.
4. Improve UI polish toward approved mock direction.
5. Add local wallpapers.
6. Add content-open behavior for attachments/messages.
7. Add calendar overlay shell and caregiver unlock stub.

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
