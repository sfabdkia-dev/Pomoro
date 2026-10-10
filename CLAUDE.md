# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

No build step required. Open `index.html` directly in a browser:

```powershell
# Open in default browser
Start-Process index.html

# Or serve locally to avoid any file:// restrictions
npx serve .
# then visit http://localhost:3000
```

There are no tests, no linting tools, and no package manager configured.

## Architecture

Single-page vanilla JS app — three files: `index.html`, `script.js`, `styles.css`. No frameworks, no build tools, no bundler.

### State

All state lives as module-level variables in `script.js`:

- **Timer state**: `workMinutes`, `breakMinutes`, `isWorkMode`, `remainingSeconds`, `isRunning`, `intervalId`
- **History/heatmap**: `focusedSecondsTotal`, `dailyFocus` (object keyed by `YYYY-MM-DD` → array of 15 slots for 7am–10pm in 30-min increments)
- **UI state**: `bgImageData`, `persistPanelsHidden`, `hoverPanelsHidden`

State persists in `localStorage` (`pomodoroState`, `pomodoroSettings`, plus a few standalone keys); `saveState()`/`saveSettings()` write it and `loadState()`/`loadSettings()` restore it.

### Timer Precision

The timer uses dual-clock sync (`Date.now()` for wall clock + `performance.now()` for monotonic). `syncRemainingFromClock()` corrects drift when the tab regains visibility. Avoid replacing this with simple `setInterval` countdowns — they drift when the tab is backgrounded.

### Layout

CSS Grid layout: left sidebars (task + summary, fixed, slide-in), center `.timer-panel`, right `.log-panel`. The grid template is `minmax(680px, 840px) 350px` with a 1200px breakpoint collapsing to single column. Glassmorphic styling via `backdrop-filter` and CSS variables (`--panel`, `--panel-alpha`, `--text`, `--primary`).

### Sound

Web Audio API only — no audio files. `playAlert()` synthesizes tones using oscillators and gain nodes. Four modes: Simple tone (660 Hz), Bell, Chime, Off.

### Notifications & Title

`notifySessionEnd()` (called from `onSessionFinished`) sends a desktop notification via Electron IPC (`show-notification` in `main.js`, silent, flashes the taskbar if unfocused), falling back to the web `Notification` API in a browser. `updateWindowTitle()` (called from `updateDisplay`) puts the countdown in `document.title` and drives the taskbar progress bar (`set-progress`). Toggle: `notificationsEnabled` setting.

### Recurring Tasks & Deadline Reminders

- Tasks have an optional `repeat: null | { type: 'daily'|'weekly'|'monthly', days?: [0-6] }` (weekly + `days` = custom weekdays) and, once a recurring task is completed, `spawnedId` (id of the generated next copy).
- **Always complete/uncomplete tasks via `setTaskCompleted(task, bool)`**, never by assigning `task.completed` directly. It spawns the next copy (`spawnNextRecurrence`, deadline from `computeNextDeadline`) exactly once and removes that copy again when the completion is undone (Return button, planner Ctrl+Z / drag out of Done).
- `checkDeadlineReminders()` runs at startup and every 60s (after startup, only once the clock is past `REMINDER_HOUR`). It batches per type (overdue/today/tomorrow) and records `{ taskId: "<date>:<type>" }` under localStorage `deadlineRemindersSent` so each fires once per day. Toggle: `deadlineRemindersEnabled`.

### Research Telemetry (Electron only)

- Optional anonymous `daily_summary` event (previous day's focus minutes rounded to 5, session count, feature/settings flags, bucketed task counts) sent to PostHog EU. Never task text or IP; events use `$ip: null` and `$process_person_profile: false`.
- Renderer (`script.js`, "Anonymous research telemetry" block): `buildDailySummary()`, `maybeSendTelemetry()` (startup + every 60s), consent modal `showTelemetryNotice()`, Settings > Privacy section. Main (`telemetry.js`): validates the payload, holds the PostHog key/host and `PRIVACY_URL`, decides the region policy; IPC `telemetry-get-info` / `telemetry-send`.
- Consent lives in localStorage `telemetryState` and the random UUID in `telemetryId`; both are deliberately outside `BACKUP_KEYS`. Opting out (or Clear all data) calls `clearTelemetryId()`; there is intentionally no separate "reset ID" button.
- Region policy: EU/EEA/UK/CH or unknown region -> opt-in; elsewhere on by default behind the first-run notice. `POMORO_TELEMETRY_REGION=DE npm start` forces a region for testing.
- Anything added to the payload must be coarse, free of user text, and listed in `docs/privacy.md` (published at https://sfabdkia-dev.github.io/Pomoro/privacy/).

### Background Images

Preloaded backgrounds live in `assets/backgrounds/` and are auto-discovered by `discoverBackgrounds()`, which probes `bg1.jpg`–`bg{MAX_BACKGROUNDS}.jpg` (gaps allowed; raise `MAX_BACKGROUNDS` for higher numbers). Users can only pick from these presets (custom uploads were removed). The chosen path is stored in `bgImageData` and applied via the `--custom-bg-image` CSS variable.

### Key Functions

| Function | What it does |
|---|---|
| `startAccurateTimer()` | Starts interval loop with wall-clock anchoring |
| `syncRemainingFromClock()` | Called on `visibilitychange` to correct timer drift |
| `onSessionFinished()` | Work↔break transition, triggers logging and alert |
| `addLogEntry(seconds)` | Appends to activity log and updates `dailyFocus` heatmap data |
| `renderHeatmap()` | Builds 7-day × 15-slot contribution grid from `dailyFocus` |
| `setSidebarState(sidebar, isOpen)` | Animates sidebar open/close, sets ARIA attributes |