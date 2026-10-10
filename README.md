# Pomoro

A single-page focus timer built with vanilla JavaScript, HTML, and CSS — no frameworks, no build tools.

## Features

- **Pomodoro timer** with preset sessions (50/10, 25/5, 90/20, 15/3) and custom durations
- **Task planner** with sub-tasks, deadlines, and urgent flags — double-click any task or sub-task to edit it inline
- **Activity log** tracking completed focus sessions with total focused time
- **Focus heatmaps**: hourly (last 24 h), daily (last N weeks), and GitHub-style yearly view
- **Alert sounds**: Simple tone, Bell, Chime, or Off — with a mute toggle and preview button
- **Background images**: four preloaded backgrounds or upload your own, with adjustable opacity
- **Panel transparency** control to see through panels to the background
- **Dark mode** toggle
- **Persistent state** via `localStorage` — tasks, focus history, and timer data survive page reloads

## Privacy and research data

The desktop app can share anonymous usage data to support research on what helps people focus. It is opt-in in the EU/EEA/UK/Switzerland (and where the region is unknown) and on by default elsewhere, behind a first-run notice. It can be turned off any time in Settings > Privacy, which also deletes the random ID. See [PRIVACY.md](PRIVACY.md) for exactly what is collected. The browser build never sends anything.

## Running

No installation needed. Open `index.html` directly in a browser, or serve locally:

```powershell
npx serve .
# then visit http://localhost:3000
```

## Usage Tips

- **Select a task** by clicking it — it appears in the focus card above the timer
- **Edit a task or sub-task** by double-clicking its text
- **Mute/unmute** with the speaker button above the timer display
- **Hide all panels** with the eye button in the bottom-right corner, revealing just the timer and background
- **Focus History** (left sidebar on wide screens) shows today's hourly activity and a weekly contribution grid

## Files

| File | Purpose |
|---|---|
| `index.html` | App markup and modal definitions |
| `script.js` | All state, timer logic, heatmap rendering, task management |
| `styles.css` | Layout (CSS Grid), glassmorphic panel styles, responsive breakpoints |
| `assets/backgrounds/` | Preloaded background images (bg1–bg4) |
