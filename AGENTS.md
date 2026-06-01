# AGENTS.md

## Project
Comfort Day prototype inside `DevelopMR/vibing`

## Purpose
This repository is building a browser-first React prototype for a dementia-support interface called **Comfort Day**. The product is a calm, day-based interface for dementia patients and caregivers. The current prototype is meant to test whether the experience feels instinctively understandable, calm, and navigable before connecting real APIs.

## Core Product Idea
This is not a generic dashboard. It is a **cognitive scaffold for a single day of life**.

The patient should be able to understand:
- what day it is
- what time it is
- what comes next
- what has already been done
- whether a caregiver is present through a message

## Primary Rules
1. One calendar day per frame.
2. Dragging or navigating right goes **back in time**.
3. Dragging or navigating left goes **into the future**.
4. The interface must always eventually return to **today**.
5. Current day is the only frame with active patient controls.
6. Past day is memory/review mode.
7. Future day is preview mode only.
8. Overnight mode is a distinct simplified state.
9. Patient communication is one-way only: caregiver to patient.
10. The interface must avoid political, religious, or news-triggering content.
11. Overnight is a visual state that applies only to the **today** frame during the proper overnight timeframe. It is not a separate navigable frame.

## Current Tech Stack
- React
- TypeScript
- Vite
- Tailwind CSS
- Local mock data
- Browser-first prototype

## Design Direction
Use the established design direction from the project conversations:

**Calm Structured Glass Surface**
- cool neutral tones
- serious, highly legible sans-serif typography
- clean outline icons
- low-clutter, soft glass look
- strong hierarchy
- no playful fonts
- no busy layered cards
- no medical/sterile feel

## State Definitions
### Current Day
- full interface active
- tasks, meds, meals visible
- message area visible
- weather active/current
- may render in overnight visual mode when the current time is in the overnight window

### Past Day
- read-only
- images attached to messages may still be opened by patient
- time less emphasized
- memory emphasis
- task states shown visually only, no judgment text

### Future Day
- read-only
- no future task completion
- next zone becomes preview language such as:
  - For tomorrow
  - In 6 days
  - In 2 weeks
- weather forecast limited to 14 days

### Overnight
- simplified
- no large medication centerpiece
- focused on calm reassurance
- should support early waking behavior
- transitions into day mode at wake time
- applies visually to the current day only
- must not be modeled as a separate day in the navigation strip

## Motion / Interaction Guidance
The full Motion Module is a future reusable accessibility library. For this prototype:
- prioritize basic navigation and correct day landing
- do not overbuild gesture complexity yet
- current priorities:
  - reliable frame landing
  - rollback to today after inactivity
  - later: drag navigation
- eventual Motion Module ideas include:
  - release-based activation
  - jitter rejection
  - multi-touch safe-area drag inference
  - fading touch traces for rejected touches

## Navigation Model
Navigation should be understood as a rolling continuous strip of calendar days rather than a fixed three-frame system.

- the patient may move left and right across an ongoing sequence of days
- the currently visible buttons should update to reflect the actual adjacent dates, not permanent `Yesterday` / `Tomorrow` labels tied to three mock frames
- past-day data and future weather should be preloaded to keep navigation feeling smooth and weighted
- `today` is a date identity and behavioral anchor, not simply "the middle card" in a static array
- valid resting positions are full-day landings only; the strip should never settle between dates

## Wallpaper System
Implemented. Architecture:
- Vite plugin (`server/wallpaper-plugin.ts`) provides `/api/wallpaper/*` API routes
- AI generation via HuggingFace FLUX.1-schnell (text-to-image for day; img2img for night to match scene)
- Sequential day→night: day generated first, night derived from day pixels via img2img (FLUX attempted first, SDXL as fallback)
- Stock image fallback (Unsplash → Pexels) for dates older than 31 days
- Local fallback image pool at `public/wallpapers/fallback/` when all generation fails
- Images stored as JPEG (compressed via sharp) in `public/wallpapers/{date}/{day|night}.jpg`
- Manifest at `public/wallpapers/manifest.json` tracks all records
- Wallpaper context: season, weather, tasks, holiday all feed the image prompt
- Dev controls available in PatientShell for single-day and full-set generation

## Weather Guidance
Prototype uses mocked local weather but must remain async-ready.
Planned behavior:
- current day weather refresh concept: every 30 minutes
- future weather refresh concept: every few hours
- preload weather with day data for fast navigation
- future forecast only up to 14 days
- beyond 14 days use a placeholder graphic/state

## Calendar / Caregiver Guidance
The small calendar icon in the upper left is important.
Prototype direction:
- both patient and caregiver can open the calendar
- caregiver unlock should be password-gated
- caregiver mode can later enable editing of:
  - tasks
  - messages
  - photos/attachments
  - schedules
- calendar should later reflect historical trends by color

## Important Current Development Priorities
1. ✅ Day-strip navigation and landing behavior — complete.
2. ✅ Finger drag / pointer drag navigation — complete.
3. ✅ Today rollback — complete.
4. ✅ Rolling day-strip model — complete.
5. ✅ Wallpaper system — complete.
6. Visual polish toward approved mock — **active** (typography, glass depth, meds/meals hierarchy).
7. Content-open behavior for past-day attachments — next.
8. Calendar overlay shell with caregiver unlock stub — follows.
9. Keep architecture async-ready for future API integration.
10. Preserve calmness and glanceability at all times.

## Working Style Expectations for Future Agents
- Do not redesign the product casually.
- Preserve the current layout model unless there is a strong reason to change it.
- Avoid generic dashboard patterns.
- Respect dementia-focused usability over flashy UI.
- Make the prototype visually serious and close to the approved mock direction.
- Prefer small, working improvements over large speculative rewrites.
- Treat the navigation foundation as a targeted refactor inside the current repo, not a full product restart.
