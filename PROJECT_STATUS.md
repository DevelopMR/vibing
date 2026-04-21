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
- `src/app/PatientShell.tsx` with timer + navigation shell
- `src/app/DayView.tsx` with the current presentational content renderer
- `src/data/mockDays.ts` for local day-state data

---

## Implemented So Far

### 1. Basic React/Tailwind app scaffold
Done.

### 2. Local mock day data
Done.

### 3. Four conceptual states represented in data/design
- Yesterday / Past
- Today / Current
- Tomorrow / Future
- Overnight

### 4. Day-based navigation shell
Partially done.

### 5. TODAY button offset behavior
Implemented in prototype shell.

### 6. Auto-return to today after 5 seconds
Implemented conceptually and working in some cases, but tied to strip behavior quality.

### 7. Overnight dev toggle
Implemented as a testing control.

### 8. Calendar icon restored in the UI
Implemented in `DayView.tsx`.

---

## Current Known Problems

## 1. Day-strip sizing / landing issues
This is the biggest current prototype problem.

Symptoms seen during testing:
- frames appearing wider than intended
- bad landing positions
- blank/in-between location during rollback
- mismatch between strip width and translate math

This has already been identified as a frame-strip math problem, not a conceptual design issue.

## 2. No drag navigation yet
Current navigation is button-driven only.

## 3. Visual polish still incomplete
The prototype currently has structure and some styling, but it is not yet close enough to the approved mockups.

## 4. No wallpaper/background asset system yet
Still using gradients and frame shells rather than per-day backgrounds.

## 5. No real content-open state yet
Past-day attachments are indicated visually, but the open-image behavior is not fully implemented.

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

### Overnight
- Should be the likely first experience for early wakeups.
- Should not feel like a medication screen.
- Should focus on reassurance and readiness for the next day.

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

### 1. Fix day-strip width and translate math
This is the immediate blocker.

### 2. Add drag/pointer navigation
After landing positions are correct.

### 3. Improve shell polish toward approved mock
Focus on:
- typography
- panel softness
- meds/meals clarity
- bedtime simplification

### 4. Add local wallpaper system
Start with a local curated set.

### 5. Add content-open behavior
Needed especially for past-day images.

### 6. Add calendar overlay shell
With a caregiver unlock stub.

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
- today rollback is reliable
- current/past/future/overnight each feel distinct
- the UI looks close enough to the approved design direction to judge product viability

---

## Summary
This project is in a promising early prototype stage. The concept, rules, and design direction are well established. The main technical risk right now is not the overall architecture but the frame-navigation implementation and the gap between current prototype styling and the approved visual concepts.
