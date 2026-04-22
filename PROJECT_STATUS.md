# PROJECT_STATUS.md

## Project
Comfort Day prototype in `DevelopMR/vibing`

## Current Goal
Build a testable React prototype that is visually close to the approved design direction while using local mocked data and local assets. The prototype is intended to test whether the interface feels instinctively understandable to dementia patients before live data integration.

---

## Confirmed Design Direction
The current accepted visual direction is:

**Calm Structured Glass Surface**
- cool neutral tone
- serious, highly legible sans-serif
- clean outline icons
- softened glass effect
- reduced inner boxes
- strong hierarchy
- bedtime state should be cleaner and more focused on reassurance

This direction was chosen through multiple style rounds during the design phase.

---

## Current Repo State
The repo is initialized and uses:
- Vite
- React
- TypeScript
- Tailwind

The current working files include:
- `package.json` with the active stack
- `src/app/PatientShell.tsx` with rolling strip + drag + guided return shell
- `src/app/DayView.tsx` with the current presentational content renderer
- `src/data/mockDays.ts` for local day-state data

The project is entering a targeted navigation-foundation refactor inside the current repo rather than a full restart.

---

## Implemented So Far

### 1. Basic React/Tailwind app scaffold
Done.

### 2. Local mock day data
Done.

### 3. Four conceptual states represented in product thinking
- Past day
- Current day
- Future day
- Overnight visual mode on the current day

### 4. Day-based navigation shell
Implemented as a rolling date strip.

### 5. TODAY button offset behavior
Implemented in prototype shell.

### 6. Auto-return to today after 5 seconds
Implemented with guided rollback after inactivity.

### 7. Overnight dev toggle
Implemented as a testing control.

### 8. Calendar icon restored in the UI
Implemented in `DayView.tsx`.

### 9. Expanded mock day range
Implemented with a local rolling window around today.

### 10. Pointer / finger drag navigation
Implemented and confirmed working.

### 11. Guided return-to-today animation
Implemented and confirmed stepping day by day with interruption support.

---

## Current Known Problems

## 1. Visual polish still incomplete
The prototype currently has structure and some styling, but it is not yet close enough to the approved mockups.

Current rough areas seen in the latest review:
- lower-left meds/meals alignment still needs tuning
- inner vs outer sizing in the meds area is not fully resolved
- bottom navigation motion is acceptable but may still need later fine-tuning

## 2. No wallpaper/background asset system yet
Still using gradients and frame shells rather than per-day backgrounds.

## 3. No real content-open state yet
Past-day attachments are indicated visually, but the open-image behavior is not fully implemented.

## 4. No calendar overlay / caregiver unlock shell yet
The calendar icon is present, but the overlay flow is still a placeholder.

---

## Important Product Rules Already Settled

### Patient interaction
- Current day is the only active day for tasks/meds/meals.
- Past day should still allow opening message-attached images.
- Future day is preview-only.

### Navigation
- Rightward navigation = back in time.
- Leftward navigation = into the future.
- The display should eventually return to today after inactivity.
- Navigation is modeled as a rolling sequence of dates, not a permanent three-frame structure.
- Guided rollback should pause immediately when the user interacts.

### Overnight
- Should be the likely first experience for early wakeups.
- Should not feel like a medication screen.
- Should focus on reassurance and readiness for the next day.
- Applies visually to the current day only.
- Is not its own separate navigable frame.

### Communication
- One-way caregiver → patient only.
- No patient reply capability.

### Weather
- Mocked now, async-ready later.
- Forecast limited to 14 days in future.

### Backgrounds
- Usually automatically chosen.
- Day-specific.
- Serve as chronological anchors.

---

## Branch / Git Status Notes
A `phase2-dayview` branch has been used for ongoing prototype work. There was some local confusion between `main` and `phase2-dayview`, so future work should verify branch context before syncing or pushing.

Recommended branch pattern going forward:
- `main` for stable base
- `phase2-dayview` for current UI shell work
- future feature branches for:
  - motion
  - calendar
  - data layer
  - visual polish

---

## Highest Priority Next Tasks

### 1. Improve shell polish toward approved mock
Focus on:
- typography
- panel softness
- meds/meals clarity
- bedtime simplification
- lower-left spacing cleanup

### 2. Add local wallpaper system
Start with a local curated set.

### 3. Add content-open behavior
Needed especially for past-day images.

### 4. Add calendar overlay shell
With a caregiver unlock stub.

### 5. Tune guided return motion
The step-by-step rollback is working, but the motion rhythm and nav-rail feel may still want refinement later.

### 6. Begin planning async-ready wallpaper / weather boundaries
No live API work yet, but future interfaces should stay easy to swap in.

---

## What Not To Do Next
- Do not jump to live APIs yet.
- Do not overbuild caregiver editing yet.
- Do not redesign the product structure.
- Do not build the full Motion Module library yet.

The prototype is still testing:
- feel
- navigation
- glanceability
- viability

---

## Success Condition for Current Prototype Phase
The prototype phase is successful when:
- the frame strip lands correctly
- navigation feels understandable
- navigation can later move across a rolling date range without feeling capped at three fixed frames
- today rollback is reliable
- current/past/future/overnight each feel distinct
- overnight behaves as a visual state on today rather than a separate navigable view
- the UI looks close enough to the approved design direction to judge product viability

## Current Phase Breakdown

### Phase 1: Navigation Foundation
- canonical date-based shell state
- rolling day-window model
- stable frame landing
- overnight remains a visual state on today only
- simple, reliable return-to-today behavior is acceptable as a temporary implementation
Status: functionally complete.

### Phase 2: Range Expansion And Drag
- expand local mock data to roughly 14 days before and after today
- validate weighted rolling feel across a realistic date span
- add pointer/drag navigation
Status: implemented and confirmed working.

### Phase 3: Guided Return-To-Today
- replace snapback with animated rollback through intervening days
- use pleasant motion curves to preserve orientation
- keep bottom navigation controls synchronized during rollback
Status: implemented and confirmed working, with room for later motion polish.

### Phase 4: Visual Refinement And Local Atmosphere
- clean up lower-left meds/meals pacing and hierarchy
- continue aligning shell spacing to the approved mock direction
- add local wallpaper/background support
- preserve the working navigation foundation while improving feel

---

## Summary
This project is in a promising early prototype stage. The navigation foundation is now materially stronger than before: rolling dates, drag navigation, guided rollback, interruption behavior, and overnight persistence are all working. The main near-term risk has shifted away from navigation math and toward visual refinement, especially the lower-left meds/meals composition and the absence of local wallpaper atmosphere.
