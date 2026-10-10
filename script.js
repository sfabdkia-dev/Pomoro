const timerDisplay = document.getElementById('timerDisplay');
const modeLabel = document.getElementById('modeLabel');
const statusMessage = document.getElementById('statusMessage');
const startPauseBtn = document.getElementById('startPauseBtn');
const startPauseBtnText = startPauseBtn.querySelector('.btn-text');
const startPauseBtnIcon = startPauseBtn.querySelector('.btn-icon');
const stopBtn = document.getElementById('stopBtn');
const stopBtnText = stopBtn.querySelector('.btn-text');
const stopBtnIcon = stopBtn.querySelector('.btn-icon');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeToggleImg = themeToggleBtn.querySelector('.btn-img-icon');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const muteSoundBtnImg = document.getElementById('muteSoundBtn').querySelector('.btn-img-icon');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const importOptionsModal     = document.getElementById('importOptionsModal');
const confirmImportBtn       = document.getElementById('confirmImportBtn');
const cancelImportBtn        = document.getElementById('cancelImportBtn');
const closeImportOptionsBtn  = document.getElementById('closeImportOptionsBtn');
const bgOpacity = document.getElementById('bgOpacity');
const opacityLabel = document.getElementById('opacityLabel');
const columnOpacity = document.getElementById('columnOpacity');
const columnOpacityLabel = document.getElementById('columnOpacityLabel');
const doneSettingsBtn = document.getElementById('doneSettingsBtn');
const exportDataBtn = document.getElementById('exportDataBtn');
const importDataBtn = document.getElementById('importDataBtn');
const importDataInput = document.getElementById('importDataInput');
const importErrorMsg = document.getElementById('importErrorMsg');
const clearAllDataBtn = document.getElementById('clearAllDataBtn');
const clearDataModal = document.getElementById('clearDataModal');
const closeClearDataBtn = document.getElementById('closeClearDataBtn');
const cancelClearDataBtn = document.getElementById('cancelClearDataBtn');
const confirmClearDataBtn = document.getElementById('confirmClearDataBtn');
const preloadedThumbs = document.getElementById('preloadedThumbs');
const summaryRailBtn = document.getElementById('summaryRailBtn');
const logRailBtn = document.getElementById('logRailBtn');
const sideRail = document.querySelector('.side-rail');
const rightRail = document.querySelector('.right-rail');
const summarySidebar = document.getElementById('summarySidebar');
const logPanel = document.querySelector('.log-panel');
const ghTooltip = document.getElementById('ghTooltip');
const customPresetChip = document.getElementById('customPresetChip');
const customTimeModal = document.getElementById('customTimeModal');
const closeCustomTimeBtn = document.getElementById('closeCustomTimeBtn');
const applyCustomBtn = document.getElementById('applyCustomBtn');
const customWorkInput = document.getElementById('customWork');
const customBreakInput = document.getElementById('customBreak');
const MAX_CUSTOM_MINUTES = 24 * 60 - 1; // 24 hours minus one minute
const soundSelect = document.getElementById('soundSelect');
const previewSoundBtn = document.getElementById('previewSoundBtn');
const muteSoundBtn = document.getElementById('muteSoundBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const alwaysOnTopToggle = document.getElementById('alwaysOnTopToggle');
const alwaysOnTopRow = document.getElementById('alwaysOnTopRow');
const windowSettingsHeading = document.getElementById('windowSettingsHeading');
const totalFocusedTime = document.getElementById('totalFocusedTime');
const presets = document.querySelectorAll('.preset');
const activityLog = document.getElementById('activityLog');
const emptyState = document.getElementById('emptyState');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const focusCard = document.getElementById('focusCard');
const completedTasksBtn = document.getElementById('completedTasksBtn');
const plannerOverlay = document.getElementById('plannerOverlay');
const plannerBoard = document.getElementById('plannerBoard');
const closePlannerBtn = document.getElementById('closePlannerBtn');

const plannerUndoStack = [];
const plannerRedoStack = [];
const snapshotPlannerState = () => tasks.map(t => ({ id: t.id, plannedSection: t.plannedSection, completed: t.completed }));
const pushPlannerHistory = () => { plannerUndoStack.push(snapshotPlannerState()); plannerRedoStack.length = 0; };
const applyPlannerSnapshot = (snap) => {
  snap.forEach(({ id, plannedSection, completed }) => {
    const t = tasks.find(x => x.id === id);
    if (t) { t.plannedSection = plannedSection; setTaskCompleted(t, completed); }
  });
  renderTasks({ updateCalendar: true });
  renderPlanner();
};
const addLogEntryBtn = document.getElementById('addLogEntryBtn');
const manualEntryForm = document.getElementById('manualEntryForm');
const manualDateInput = document.getElementById('manualDate');
const manualTimeInput = document.getElementById('manualTime');
const manualDurationInput = document.getElementById('manualDuration');
const manualAddBtn = document.getElementById('manualAddBtn');
const manualCancelBtn = document.getElementById('manualCancelBtn');
const palettePicker = document.getElementById('palettePicker');
const timerArea = document.getElementById('timerArea');
const analogClock = document.getElementById('analogClock');
const calGrid = document.getElementById('calGrid');
const calMonthLabel = document.getElementById('calMonthLabel');
const calDeadlineList = document.getElementById('calDeadlineList');

const compactModeBtn = document.getElementById('compactModeBtn');
const compactTaskDisplay = document.getElementById('compactTaskDisplay');
const titleBar = document.getElementById('titleBar');
const minimizeBtn = document.getElementById('minimizeBtn');
const maximizeBtn = document.getElementById('maximizeBtn');
const closeBtn = document.getElementById('closeBtn');
const panelVisibilityToggle = document.getElementById('panelVisibilityToggle');
const progressRingFill = document.getElementById('progressRingFill');
const RING_CIRCUMFERENCE = 2 * Math.PI * 113;
const panelToggleTargets = [
  ...document.querySelectorAll('.summary-sidebar, .log-panel'),
  ...document.querySelectorAll('.top-actions, .timer-title, .session-picker, .sound-settings, .controls'),
];
panelToggleTargets.forEach((el) => el.classList.add('panel-toggle-target'));
let persistPanelsHidden = false;
let hoverPanelsHidden = false;
let isCompactMode = false;
let isAlwaysOnTop = true;
let notificationsEnabled = true;
let deadlineRemindersEnabled = true;
let baseTitle = document.title;

// Single source of truth for the shortcut list (Settings section, ? popup and tooltips)
const SHORTCUTS = [
  { keys: 'Space', label: 'Start / pause timer' },
  { keys: 'S', label: 'Stop (focus) / skip (break)' },
  { keys: 'Ctrl+Space', label: 'Compact / full size' },
  { keys: 'Ctrl+D', label: 'Dark / light mode' },
  { keys: 'Ctrl+S', label: 'Open / close Settings' },
  { keys: 'Ctrl+L', label: 'Show / hide panels' },
  { keys: 'Ctrl+T', label: 'New task' },
  { keys: 'Ctrl+P', label: 'Open / close Task Planner' },
  { keys: 'Ctrl+C', label: 'Calendar panel' },
  { keys: 'Ctrl+A', label: 'Activity Log panel' },
  { keys: '?', label: 'Show this list' },
];
const withKey = (label, keys) => `${label} (${keys})`;

const applyPanelsVisibility = () => {
  const hidden = persistPanelsHidden || hoverPanelsHidden;
  document.body.classList.toggle('panels-hidden', hidden);
  panelVisibilityToggle.classList.toggle('active', hidden);
  panelVisibilityToggle.setAttribute('aria-pressed', hidden ? 'true' : 'false');
  panelVisibilityToggle.setAttribute('aria-label', hidden ? 'Show panels' : 'Hide panels');
  panelVisibilityToggle.title = withKey(hidden ? 'Show panels' : 'Hide panels', 'Ctrl+L');
};

panelVisibilityToggle.addEventListener('mouseenter', () => { hoverPanelsHidden = true; applyPanelsVisibility(); });
panelVisibilityToggle.addEventListener('mouseleave', () => { hoverPanelsHidden = false; applyPanelsVisibility(); });
panelVisibilityToggle.addEventListener('click', () => { persistPanelsHidden = !persistPanelsHidden; hoverPanelsHidden = false; applyPanelsVisibility(); });

const updateCompactTaskDisplay = () => {
  if (!compactTaskDisplay) return;
  const activeTask = tasks.find(t => t.active && !t.completed);
  compactTaskDisplay.textContent = activeTask ? activeTask.text.slice(0, 40) : '';
};

if (!window.electronAPI) titleBar.style.display = 'none';
minimizeBtn.addEventListener('click', () => window.electronAPI?.minimizeWindow());
maximizeBtn.addEventListener('click', () => window.electronAPI?.maximizeWindow());
closeBtn.addEventListener('click', () => window.electronAPI?.closeWindow());

if (window.electronAPI?.onMaximizeChange) {
  window.electronAPI.onMaximizeChange(isMax => {
    maximizeBtn.textContent = isMax ? '❐' : '□';
    maximizeBtn.setAttribute('aria-label', isMax ? 'Restore' : 'Maximize');
  });
}

compactModeBtn.addEventListener('click', async () => {
  const enteringCompact = !isCompactMode;
  if (enteringCompact) {
    if (window.electronAPI && document.body.classList.contains('fullscreen')) {
      await window.electronAPI.toggleFullScreen();
      await new Promise(r => setTimeout(r, 250));
    } else if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  }
  isCompactMode = !isCompactMode;
  document.body.classList.toggle('compact-mode', isCompactMode);
  compactModeBtn.querySelector('img').src = isCompactMode ? 'assets/icons/Uncompact_button.png' : 'assets/icons/Compact_button.png';
  compactModeBtn.title = withKey(isCompactMode ? 'Exit compact mode' : 'Compact mode', 'Ctrl+Space');
  compactModeBtn.setAttribute('aria-label', isCompactMode ? 'Exit compact mode' : 'Compact mode');
  if (isCompactMode) updateCompactTaskDisplay();

  if (!window.electronAPI) return;
  if (!isCompactMode) {
    window.electronAPI.setAlwaysOnTop(false);
    window.electronAPI.setCompactMode({ compact: false });
    return;
  }
  window.electronAPI.setAlwaysOnTop(isAlwaysOnTop);
  const appEl = document.querySelector('.app');
  appEl.style.width = 'fit-content';
  appEl.style.flex = 'none';
  const appRect = appEl.getBoundingClientRect();
  appEl.style.width = '';
  appEl.style.flex = '';
  const width = Math.ceil(appRect.width * 1.2);
  const height = Math.ceil(appRect.height + titleBar.offsetHeight);
  window.electronAPI.setCompactMode({ compact: true, width, height });
});


let workMinutes = 50; let breakMinutes = 10; let isWorkMode = true;
let totalSeconds = workMinutes * 60; let remainingSeconds = totalSeconds;
let isRunning = false; let intervalId = null;
let focusedSecondsTotal = 0; let waitingForManualStart = false;
let targetEndTimestampMs = null; let lastPerfNow = null;
let currentRunStartMs = null;
let bgImageData = 'assets/backgrounds/bg1.jpg';
let logEntries = [];
let currentPalette = 'green';
let _clockColors = null;
const getClockColors = () => {
  if (_clockColors) return _clockColors;
  const cs = getComputedStyle(document.body);
  const dark = document.body.classList.contains('dark');
  _clockColors = {
    primary:   cs.getPropertyValue('--primary').trim(),
    accent:    cs.getPropertyValue('--accent').trim(),
    textCol:   cs.getPropertyValue('--text').trim(),
    mutedCol:  cs.getPropertyValue('--muted').trim(),
    borderCol: cs.getPropertyValue('--border').trim(),
    trackCol:  dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
  };
  return _clockColors;
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const MAX_BACKGROUNDS = 30; // highest bg# number checked in assets/backgrounds/

// ── Heatmap palettes ───────────────────────────────────────────────────────
const HEATMAP_PALETTES = {
  violet:   { l: ['#e9d5ff', '#a855f7', '#7c3aed', '#5b21b6'], d: ['#3b0764', '#6d28d9', '#7c3aed', '#a855f7'] },
  burgundy: { l: ['#fda4af', '#f43f5e', '#be123c', '#881337'], d: ['#4c0519', '#9f1239', '#be123c', '#f43f5e'] },
  ocean:    { l: ['#bae6fd', '#0ea5e9', '#0284c7', '#075985'], d: ['#0c4a6e', '#0369a1', '#0ea5e9', '#38bdf8'] },
  gold:     { l: ['#fde68a', '#f59e0b', '#d97706', '#92400e'], d: ['#451a03', '#b45309', '#d97706', '#fbbf24'] },
  rose:     { l: ['#fecaca', '#f87171', '#dc2626', '#991b1b'], d: ['#450a0a', '#7f1d1d', '#b91c1c', '#ef4444'] },
  lime:     { l: ['#bbf7d0', '#4ade80', '#32CD32', '#166534'], d: ['#052e16', '#14532d', '#15803d', '#32CD32'] },
  teal:     { l: ['#99f6e4', '#2dd4bf', '#008080', '#134e4a'], d: ['#042f2e', '#115e59', '#0f766e', '#2dd4bf'] },
};

const PALETTE_LABELS = { violet: 'Violet', burgundy: 'Burgundy', ocean: 'Ocean', gold: 'Gold', rose: 'Rose', lime: 'Lime', teal: 'Teal' };

// ── UI color themes ─────────────────────────────────────────────────────────
const UI_THEMES = {
  indigo:  { label: 'Indigo',  light: { '--primary': '#6366f1', '--primary-hover': '#4f46e5', '--accent': '#06b6d4' }, dark: { '--primary': '#818cf8', '--primary-hover': '#6366f1', '--accent': '#22d3ee' } },
  violet:  { label: 'Violet',  light: { '--primary': '#9333ea', '--primary-hover': '#7c3aed', '--accent': '#ec4899' }, dark: { '--primary': '#c084fc', '--primary-hover': '#a855f7', '--accent': '#f472b6' } },
  teal:    { label: 'Teal',    light: { '--primary': '#0d9488', '--primary-hover': '#0f766e', '--accent': '#0ea5e9' }, dark: { '--primary': '#2dd4bf', '--primary-hover': '#14b8a6', '--accent': '#38bdf8' } },
  rose:    { label: 'Rose',    light: { '--primary': '#e11d48', '--primary-hover': '#be123c', '--accent': '#f97316' }, dark: { '--primary': '#fb7185', '--primary-hover': '#f43f5e', '--accent': '#fb923c' } },
  amber:   { label: 'Amber',   light: { '--primary': '#d97706', '--primary-hover': '#b45309', '--accent': '#059669' }, dark: { '--primary': '#fbbf24', '--primary-hover': '#f59e0b', '--accent': '#34d399' } },
  emerald: { label: 'Emerald', light: { '--primary': '#059669', '--primary-hover': '#047857', '--accent': '#8b5cf6' }, dark: { '--primary': '#34d399', '--primary-hover': '#10b981', '--accent': '#a78bfa' } },
};
let currentUiTheme = 'indigo';

const applyUiTheme = (name) => {
  const theme = UI_THEMES[name] || UI_THEMES.indigo;
  currentUiTheme = name;
  const isDark = document.body.classList.contains('dark');
  const vars = isDark ? theme.dark : theme.light;
  Object.entries(vars).forEach(([k, v]) => document.body.style.setProperty(k, v));
  _clockColors = null;
  localStorage.setItem('uiTheme', name);
};

const renderUiThemePicker = () => {
  const picker = document.getElementById('uiThemePicker');
  if (!picker) return;
  picker.innerHTML = '';
  Object.entries(UI_THEMES).forEach(([name, theme]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `ui-theme-swatch${name === currentUiTheme ? ' active' : ''}`;
    btn.title = theme.label;
    btn.style.background = `linear-gradient(135deg, ${theme.light['--primary']} 50%, ${theme.light['--accent']} 50%)`;
    const label = document.createElement('span');
    label.textContent = theme.label;
    btn.appendChild(label);
    btn.addEventListener('click', () => {
      applyUiTheme(name);
      renderUiThemePicker();
    });
    picker.appendChild(btn);
  });
};

const applyHeatmapPalette = (name) => {
  const p = HEATMAP_PALETTES[name] || HEATMAP_PALETTES.lime;
  currentPalette = name;
  p.l.forEach((c, i) => document.body.style.setProperty(`--hm-l${i + 1}`, c));
  p.d.forEach((c, i) => document.body.style.setProperty(`--hm-d${i + 1}`, c));
  localStorage.setItem('heatmapPalette', name);
};

// A browser can't list a folder, so probe assets/backgrounds/bg1.jpg … bg{MAX}.jpg and keep those that load.
const discoverBackgrounds = async () => {
  const probe = (url) => new Promise((resolve) => {
    const im = new Image();
    im.onload = () => resolve(url);
    im.onerror = () => resolve(null);
    im.src = url;
  });
  const found = await Promise.all(
    Array.from({ length: MAX_BACKGROUNDS }, (_, i) => probe(`assets/backgrounds/bg${i + 1}.jpg`))
  );
  return found.filter(Boolean);
};

const renderPreloadedThumbs = async () => {
  const urls = await discoverBackgrounds();
  if (!urls.length) { preloadedThumbs.textContent = 'No backgrounds found.'; return; }
  let index = Math.max(0, urls.indexOf(bgImageData));
  preloadedThumbs.innerHTML = '';
  preloadedThumbs.className = 'bg-carousel';
  const prev = document.createElement('button');
  prev.type = 'button'; prev.className = 'bg-carousel-btn'; prev.textContent = '‹'; prev.setAttribute('aria-label', 'Previous background');
  const next = document.createElement('button');
  next.type = 'button'; next.className = 'bg-carousel-btn'; next.textContent = '›'; next.setAttribute('aria-label', 'Next background');
  const view = document.createElement('div');
  view.className = 'bg-carousel-view';
  const img = document.createElement('img');
  img.alt = 'Background preview';
  const count = document.createElement('span');
  count.className = 'bg-carousel-count';
  view.append(img, count);
  preloadedThumbs.append(prev, view, next);

  const show = (i, apply) => {
    index = (i + urls.length) % urls.length;
    img.src = urls[index];
    count.textContent = `${index + 1} / ${urls.length}`;
    if (apply) { bgImageData = urls[index]; applySettings(); saveBgImage(); saveSettings(); }
  };
  prev.addEventListener('click', () => show(index - 1, true));
  next.addEventListener('click', () => show(index + 1, true));

  // Scroll wheel / trackpad swipe (horizontal, or vertical when hovering the preview)
  let wheelLock = false;
  view.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (wheelLock) return;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(d) < 4) return;
    wheelLock = true; setTimeout(() => { wheelLock = false; }, 250);
    show(index + (d > 0 ? 1 : -1), true);
  }, { passive: false });

  // Touch swipe
  let touchX = null;
  view.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  view.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1), true);
  });

  // Arrow keys when the preview is focused
  view.tabIndex = 0;
  view.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1, true); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1, true); }
  });

  show(index, false);
};

const isSummaryPinned = () => window.innerWidth >= 1200;
const isLogPinned = () => window.innerWidth >= 900;

const syncRailVisibility = () => {
  if (isSummaryPinned()) { sideRail.classList.add('hidden'); return; }
  const hide = summarySidebar.classList.contains('open');
  sideRail.classList.toggle('hidden', hide);
};

const syncRightRailVisibility = () => {
  if (isLogPinned()) { rightRail.classList.add('hidden'); return; }
  const hide = logPanel.classList.contains('open');
  rightRail.classList.toggle('hidden', hide);
};

const setSidebarState = (sidebar, isOpen) => {
  sidebar.classList.toggle('open', isOpen);
  sidebar.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
};

window.addEventListener('resize', syncRailVisibility);


// ── Sound ──────────────────────────────────────────────────────────────────
const ALERT_GAIN = 0.6; // was 0.2, which was easy to miss
const playAlert = (times = 1) => {
  const sound = soundSelect.value;
  if (sound === 'off') return;
  const patterns = { simple: [660], bell: [900, 650], chime: [700, 900, 1200] };
  let delay = 0;
  for (let repeat = 0; repeat < times; repeat += 1) {
    patterns[sound].forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(ALERT_GAIN,audioCtx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + 0.22);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + delay); osc.stop(audioCtx.currentTime + delay + 0.25);
      delay += 0.18;
    });
    delay += 0.25;
  }
};

// ── Notifications & window title ───────────────────────────────────────────
const notifySessionEnd = (finishedWork) => {
  if (!notificationsEnabled) return;
  const title = finishedWork ? 'Focus session finished' : 'Break finished';
  const body = finishedWork
    ? `Nice work! Time for a ${breakMinutes} min break.`
    : 'Ready for the next focus session?';
  return sendNotification(title, body);
};

// Resolves to { ok, error? }
const sendNotification = async (title, body) => {
  if (window.electronAPI?.showNotification) {
    try { return await window.electronAPI.showNotification({ title, body }); }
    catch (err) { return { ok: false, error: String(err) }; }
  }
  if (!('Notification' in window)) return { ok: false, error: 'Notifications are not supported here.' };
  if (Notification.permission === 'default') {
    try { await Notification.requestPermission(); } catch (_) {}
  }
  if (Notification.permission !== 'granted') return { ok: false, error: 'Notification permission was not granted.' };
  try { new Notification(title, { body, silent: true }); return { ok: true }; }
  catch (err) { return { ok: false, error: String(err) }; }
};

const updateWindowTitle = () => {
  if (isRunning) {
    document.title = `${formatTime(remainingSeconds)} · ${isWorkMode ? 'Focus' : 'Break'} — ${baseTitle}`;
    window.electronAPI?.setProgress?.(totalSeconds > 0 ? 1 - remainingSeconds / totalSeconds : 0);
  } else {
    document.title = baseTitle;
    window.electronAPI?.setProgress?.(-1);
  }
  window.electronAPI?.setTrayState?.({ running: isRunning, tooltip: document.title });
};

window.electronAPI?.onTrayToggleTimer?.(() => startPauseBtn.click());

const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
const formatDuration = (seconds) => `${Math.floor(seconds / 3600).toString().padStart(2, '0')}h ${Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')}m ${(seconds % 60).toString().padStart(2, '0')}s`;

const updateProgressRing = () => {
  if (!progressRingFill) return;
  const proportion = totalSeconds > 0 ? remainingSeconds / totalSeconds : 1;
  progressRingFill.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - proportion);
  progressRingFill.style.stroke = isWorkMode ? 'var(--primary)' : 'var(--accent)';
};

const updateDisplay = () => {
  const timeText = formatTime(remainingSeconds);
  timerDisplay.textContent = timeText;
  // Shrink long readings (e.g. 120:00, 1439:00) so they stay inside the circle; 5 chars = full size.
  timerDisplay.style.setProperty('--timer-scale', Math.min(1, 5 / timeText.length).toFixed(3));
  modeLabel.textContent = isWorkMode ? `Work Session (${workMinutes} min)` : `Break Session (${breakMinutes} min)`;
  timerArea.classList.toggle('break-mode', !isWorkMode);
  drawAnalogClock();
  updateProgressRing();
  updateWindowTitle();
  try { updateGoalProgress(); } catch (_) {} // stats box may not be initialised yet
};

const drawAnalogClock = () => {
  if (!timerArea.classList.contains('analog') || !analogClock) return;
  const dpr = window.devicePixelRatio || 1;
  const logSize = 231;
  if (analogClock.width !== Math.round(logSize * dpr)) {
    analogClock.width = Math.round(logSize * dpr);
    analogClock.height = Math.round(logSize * dpr);
    analogClock.style.width = logSize + 'px';
    analogClock.style.height = logSize + 'px';
  }
  const ctx = analogClock.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const S = logSize, cx = S / 2, cy = S / 2, R = S / 2 - 10;
  const { primary, accent, textCol, mutedCol, borderCol, trackCol } = getClockColors();

  ctx.clearRect(0, 0, S, S);

  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.strokeStyle = borderCol; ctx.lineWidth = 1.5; ctx.stroke();

  ctx.beginPath(); ctx.arc(cx, cy, R - 8, 0, Math.PI * 2);
  ctx.strokeStyle = trackCol; ctx.lineWidth = 9; ctx.lineCap = 'butt'; ctx.stroke();

  const proportion = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
  if (proportion > 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, R - 8, -Math.PI / 2, -Math.PI / 2 + proportion * Math.PI * 2);
    ctx.strokeStyle = isWorkMode ? primary : accent;
    ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.stroke();
  }

  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const maj = i % 3 === 0;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * (R - (maj ? 22 : 19)), cy + Math.sin(a) * (R - (maj ? 22 : 19)));
    ctx.lineTo(cx + Math.cos(a) * (R - 13), cy + Math.sin(a) * (R - 13));
    ctx.strokeStyle = mutedCol; ctx.lineWidth = maj ? 2 : 1; ctx.stroke();
  }

  const elapsedSeconds = totalSeconds - remainingSeconds;
  const eMins = Math.floor(elapsedSeconds / 60) % 60;
  const eSecs = elapsedSeconds % 60;
  const minA = ((eMins + eSecs / 60) / 60) * Math.PI * 2 - Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(cx - Math.cos(minA) * 8, cy - Math.sin(minA) * 8);
  ctx.lineTo(cx + Math.cos(minA) * (R - 30), cy + Math.sin(minA) * (R - 30));
  ctx.strokeStyle = isWorkMode ? textCol : accent; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.stroke();

  const secA = ((elapsedSeconds % 60) / 60) * Math.PI * 2 - Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(cx - Math.cos(secA) * 12, cy - Math.sin(secA) * 12);
  ctx.lineTo(cx + Math.cos(secA) * (R - 20), cy + Math.sin(secA) * (R - 20));
  ctx.strokeStyle = isWorkMode ? primary : accent; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.stroke();

  ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = isWorkMode ? primary : accent; ctx.fill();

};

const updateFocusedTotal = () => { totalFocusedTime.textContent = formatDuration(focusedSecondsTotal); };
const resetCurrentMode = () => { totalSeconds = (isWorkMode ? workMinutes : breakMinutes) * 60; remainingSeconds = totalSeconds; updateDisplay(); updateProgressRing(); };

const dailyFocus = {};

const slotKeyFromDate = (dateObj) => {
  const h = dateObj.getHours();
  const m = dateObj.getMinutes();
  if (h < 7 || h >= 22) return null;
  return (h - 7) * 2 + (m >= 30 ? 1 : 0);
};

const dateKey = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// ── Recurring tasks ────────────────────────────────────────────────────────
// task.repeat: null | { type: 'daily' | 'weekly' | 'monthly', days?: [0-6] }
// (weekly with `days` = custom weekdays, 0 = Sunday)
const parseDateKey = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// Date `n` steps after `base` under `repeat`. Monthly is computed from the base
// day each time so Jan 31 -> Feb 28 -> Mar 31 doesn't drift, clamping on short months.
const stepRecurrence = (repeat, base, n) => {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  if (repeat.type === 'monthly') {
    const target = new Date(base.getFullYear(), base.getMonth() + n, 1);
    const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    return new Date(target.getFullYear(), target.getMonth(), Math.min(base.getDate(), lastDay));
  }
  if (repeat.type === 'weekly' && !(repeat.days && repeat.days.length)) {
    d.setDate(d.getDate() + 7 * n);
    return d;
  }
  const allowed = repeat.type === 'weekly' ? repeat.days : [0, 1, 2, 3, 4, 5, 6];
  for (let left = n; left > 0;) {
    d.setDate(d.getDate() + 1);
    if (allowed.includes(d.getDay())) left--;
  }
  return d;
};

// Next deadline (YYYY-MM-DD): from the old deadline (or today), strictly after today.
const computeNextDeadline = (repeat, deadline, today = new Date()) => {
  const todayKey = dateKey(today);
  const base = deadline ? parseDateKey(deadline) : parseDateKey(todayKey);
  for (let n = 1; n < 1000; n++) {
    const key = dateKey(stepRecurrence(repeat, base, n));
    if (key > todayKey) return key;
  }
  return null;
};

const spawnNextRecurrence = (task) => {
  if (!task.repeat || task.spawnedId) return;
  const copy = {
    id: nextId++,
    text: task.text,
    active: false,
    urgent: task.urgent,
    deadline: computeNextDeadline(task.repeat, task.deadline),
    repeat: { ...task.repeat, days: task.repeat.days ? [...task.repeat.days] : undefined },
    subtasks: (task.subtasks || []).map(s => ({ ...s, id: nextId++, done: false })),
    showSubInput: false,
    completed: false,
    plannedSection: null,
  };
  tasks.push(copy);
  task.spawnedId = copy.id;
};

// Single place that flips completion so recurrence spawn/undo stays consistent.
const setTaskCompleted = (task, done) => {
  if (!!task.completed === done) return;
  task.completed = done;
  if (done) {
    spawnNextRecurrence(task);
  } else if (task.spawnedId) {
    tasks = tasks.filter(t => t.id !== task.spawnedId);
    delete task.spawnedId;
  }
};
const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const describeRepeat = (repeat) => {
  if (repeat.type === 'weekly' && repeat.days && repeat.days.length) {
    return 'Repeats on ' + [...repeat.days].sort().map(i => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]).join(', ');
  }
  return { daily: 'Repeats daily',weekly: 'Repeats weekly', monthly: 'Repeats monthly' }[repeat.type] || 'Repeats';
};
const buildRepeatChip = (repeat) => {
  const chip = document.createElement('span');
  chip.className = 'task-deadline-chip task-repeat-chip';
  chip.textContent = '🔁';
  chip.title = describeRepeat(repeat);
  return chip;
};
const dailyFocusMinutes = (key) => Object.values(dailyFocus[key] || {}).reduce((a, b) => a + b, 0);



// ── 24-Hour heatmap ────────────────────────────────────────────────────────


// ── Compact heatmap (Focus History left panel) ─────────────────────────────
const compactHeatmapPanel = document.getElementById('compactHeatmapPanel');

const renderDailyHeatmapInto = (containerEl, numHours = 24) => {
  const section = document.createElement('div');
  section.className = 'compact-daily-section';

  const grid = document.createElement('div');
  grid.className = 'compact-daily-grid';

  const now = new Date();
  const currentHour = now.getHours();

  for (let i = 0; i < numHours; i++) {
    const cellTs = new Date(now);
    cellTs.setMinutes(0, 0, 0);
    cellTs.setHours(currentHour - (numHours - 1 - i));

    const h = cellTs.getHours();
    const dk = dateKey(cellTs);
    let focusMinutes = 0;
    if (h >= 7 && h < 22) {
      const slot1 = (h - 7) * 2;
      const daySlots = dailyFocus[dk] || {};
      focusMinutes = (daySlots[slot1] || 0) + (daySlots[slot1 + 1] || 0);
    }

    const hrs = focusMinutes / 60;
    const level = focusMinutes > 0 ? (hrs < 0.5 ? 1 : hrs < 1 ? 2 : hrs < 1.5 ? 3 : 4) : 0;
    const isCurrent = i === numHours - 1;

    const cell = document.createElement('div');
    cell.className = `compact-h-cell${level > 0 ? ` gh-l${level}` : ''}${isCurrent ? ' current-hour-cell' : ''}`;

    const timeStr = cellTs.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    const dateStr = cellTs.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    cell.addEventListener('mouseenter', (e) => {
      ghTooltip.textContent = focusMinutes > 0 ? `${focusMinutes}m focused — ${timeStr} ${dateStr}` : `No focus — ${timeStr} ${dateStr}`;
      ghTooltip.style.left = `${e.clientX + 14}px`;
      ghTooltip.style.top = `${e.clientY - 36}px`;
      ghTooltip.style.display = 'block';
    });
    cell.addEventListener('mousemove', (e) => {
      ghTooltip.style.left = `${e.clientX + 14}px`;
      ghTooltip.style.top = `${e.clientY - 36}px`;
    });
    cell.addEventListener('mouseleave', () => { ghTooltip.style.display = 'none'; });

    grid.appendChild(cell);
  }

  // Time labels positioned by cell index within the numHours window
  const labelsEl = document.createElement('div');
  labelsEl.className = 'compact-daily-labels';

  const addLabel = (pos, text) => {
    const span = document.createElement('span');
    span.textContent = text;
    span.style.left = `${18 + pos * 13}px`;
    labelsEl.appendChild(span);
  };

  [{ hh: 0, txt: '12a' }, { hh: 6, txt: '6a' }, { hh: 12, txt: '12p' }, { hh: 18, txt: '6p' }].forEach(({ hh, txt }) => {
    const pos = (numHours - 1) - (currentHour - hh);
    if (pos >= 0 && pos < numHours - 1) addLabel(pos, txt);
  });
  addLabel(numHours - 1, 'Now');

  section.appendChild(grid);
  section.appendChild(labelsEl);
  containerEl.appendChild(section);
};

const renderCompactHeatmap = (containerEl, numWeeks) => {
  containerEl.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'compact-heatmap-card';

  renderDailyHeatmapInto(card, Math.min(24, numWeeks));

  const sep = document.createElement('hr');
  sep.className = 'compact-heatmap-sep';
  card.appendChild(sep);

  containerEl.appendChild(card);

  if (numWeeks <= 0) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - today.getDay() - (numWeeks - 1) * 7);

  // Month labels above week columns
  const monthArea = document.createElement('div');
  monthArea.className = 'compact-month-area';
  for (let w = 0; w < numWeeks; w++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + w * 7);
    let monthText = '';
    if (w === 0) {
      monthText = weekStart.toLocaleDateString('en-US', { month: 'short' });
    } else {
      const prevWeek = new Date(startDate);
      prevWeek.setDate(startDate.getDate() + (w - 1) * 7);
      if (weekStart.getMonth() !== prevWeek.getMonth()) {
        monthText = weekStart.toLocaleDateString('en-US', { month: 'short' });
      }
    }
    const monthCell = document.createElement('div');
    monthCell.className = 'compact-month-cell';
    monthCell.textContent = monthText;
    monthArea.appendChild(monthCell);
  }
  card.appendChild(monthArea);

  // Body: day labels + week columns
  const body = document.createElement('div');
  body.className = 'compact-heatmap-body';

  const dayLabels = document.createElement('div');
  dayLabels.className = 'compact-day-labels';
  ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach((d) => {
    const span = document.createElement('span');
    span.textContent = d;
    dayLabels.appendChild(span);
  });
  body.appendChild(dayLabels);

  const weeksEl = document.createElement('div');
  weeksEl.className = 'compact-heatmap-weeks';
  for (let w = 0; w < numWeeks; w++) {
    const weekEl = document.createElement('div');
    weekEl.className = 'gh-week';
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + w * 7 + d);
      const isFuture = cellDate > today;
      const totalMinutes = dailyFocusMinutes(dateKey(cellDate));
      const hrs = totalMinutes / 60;
      const level = !isFuture && hrs > 0 ? (hrs < 2 ? 1 : hrs < 4 ? 2 : hrs < 6 ? 3 : 4) : 0;

      const isToday = cellDate.getTime() === today.getTime();
      const cell = document.createElement('div');
      cell.className = `gh-cell${level > 0 ? ` gh-l${level}` : ''}${isFuture ? ' gh-future' : ''}${isToday ? ' gh-today' : ''}`;

      const dateStr = cellDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      if (!isFuture) {
        cell.addEventListener('mouseenter', (e) => {
          ghTooltip.textContent = hrs > 0 ? `${hrs.toFixed(1)}h focused — ${dateStr}` : `No focus — ${dateStr}`;
          ghTooltip.style.left = `${e.clientX + 14}px`;
          ghTooltip.style.top = `${e.clientY - 36}px`;
          ghTooltip.style.display = 'block';
        });
        cell.addEventListener('mousemove', (e) => {
          ghTooltip.style.left = `${e.clientX + 14}px`;
          ghTooltip.style.top = `${e.clientY - 36}px`;
        });
        cell.addEventListener('mouseleave', () => { ghTooltip.style.display = 'none'; });
      }
      weekEl.appendChild(cell);
    }
    weeksEl.appendChild(weekEl);
  }
  body.appendChild(weeksEl);
  card.appendChild(body);

  const weeksLabel = document.createElement('p');
  weeksLabel.className = 'compact-weeks-label';
  weeksLabel.textContent = `Last ${numWeeks} week${numWeeks !== 1 ? 's' : ''}`;
  card.appendChild(weeksLabel);

};

const refreshCompactHeatmap = () => {
  if (!compactHeatmapPanel) return;
  const w = compactHeatmapPanel.getBoundingClientRect().width;
  if (w < 32) return;
  renderCompactHeatmap(compactHeatmapPanel, Math.max(1, Math.floor((w - 50) / 13)));
};

// ── Stats box ──────────────────────────────────────────────────────────────
const statToday = document.getElementById('statToday');
const statWeek = document.getElementById('statWeek');
const statVsYesterday = document.getElementById('statVsYesterday');
const statAvg7 = document.getElementById('statAvg7');
const statAvg30 = document.getElementById('statAvg30');

const fmtHM = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const refreshStats = () => {
  if (!statToday) return;
  const now = new Date();
  const todayKey = dateKey(now);

  // Today total minutes
  const todayMinutes = dailyFocusMinutes(todayKey);
  statToday.textContent = fmtHM(todayMinutes);

  let weekMinutes = 0;
  const mondayOffset = (now.getDay() + 6) % 7;
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - mondayOffset + i);
    weekMinutes += dailyFocusMinutes(dateKey(d));
  }
  statWeek.textContent = fmtHM(weekMinutes);

  // Daily average over the last N days, including today
  const avgOver = (days) => {
    let total = 0;
    for (let i = 0; i < days; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      total += dailyFocusMinutes(dateKey(d));
    }
    return total / days;
  };
  statAvg7.textContent = fmtHM(avgOver(7));
  statAvg30.textContent = fmtHM(avgOver(30));
  // Averages are meaningless on a fresh install, so hide them until some focus time is recorded
  const hasHistory = Object.keys(dailyFocus).some(k => dailyFocusMinutes(k) > 0);
  [statAvg7, statAvg30].forEach(el => el.closest('.stats-row').classList.toggle('no-data', !hasHistory));

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayMinutes = dailyFocusMinutes(dateKey(yesterday));
  if (yesterdayMinutes > 0) {
    const pct = Math.round((todayMinutes / yesterdayMinutes) * 100);
    statVsYesterday.textContent = `${pct}%`;
  } else {
    statVsYesterday.textContent = '—';
  }

  updateGoalProgress();
  refreshStreaks();
};

// ── Daily goal & streaks ───────────────────────────────────────────────────
const GOAL_KEY = 'dailyGoalMinutes';
let dailyGoalMinutes = 120;
try {
  const g = parseInt(localStorage.getItem(GOAL_KEY), 10);
  if (g > 0) dailyGoalMinutes = Math.min(g, 1440);
} catch (_) {}

const goalRow = document.getElementById('goalRow');
const statGoalProgress = document.getElementById('statGoalProgress');
const goalBar = document.getElementById('goalBar');
const goalBarFill = document.getElementById('goalBarFill');
const statStreak = document.getElementById('statStreak');
const statLongestStreak = document.getElementById('statLongestStreak');
const fmtDays = (n) => `${n} day${n === 1 ? '' : 's'}`;

// Minutes focused today, including the work session currently running
function liveTodayMinutes() {
  let minutes = dailyFocusMinutes(dateKey(new Date()));
  if (isRunning && isWorkMode) {
    minutes += Math.max(0, workMinutes * 60 - remainingSeconds) / 60;
  }
  return minutes;
}

function updateGoalProgress() {
  if (!statGoalProgress) return;
  const pct = Math.min(100, Math.floor((liveTodayMinutes() / dailyGoalMinutes) * 100));
  statGoalProgress.textContent = `${pct}%`;
  goalBarFill.style.width = `${pct}%`;
  goalBar.classList.toggle('met', pct >= 100);
  goalBar.setAttribute('aria-valuenow', pct);
}

const refreshStreaks = () => {
  if (!statStreak) return;
  const met = (key) => dailyFocusMinutes(key) >= dailyGoalMinutes;

  // Current streak: consecutive met days ending today, or yesterday if today isn't met yet
  const cursor = new Date();
  if (!met(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let current = 0;
  while (met(dateKey(cursor))) { current++; cursor.setDate(cursor.getDate() - 1); }

  // Longest streak: longest run of consecutive met days in recorded history
  const days = Object.keys(dailyFocus).filter(met).sort();
  let longest = 0, run = 0, prev = null;
  days.forEach(k => {
    const [y, m, d] = k.split('-').map(Number);
    const t = new Date(y, m - 1, d);
    if (prev) {
      const next = new Date(prev); next.setDate(next.getDate() + 1);
      run = dateKey(next) === k ? run + 1 : 1;
    } else run = 1;
    prev = t;
    longest = Math.max(longest, run);
  });

  statStreak.textContent = fmtDays(current);
  statLongestStreak.textContent = fmtDays(Math.max(longest, current));
};

const setDailyGoal = (minutes) => {
  const v = parseInt(minutes, 10);
  if (!(v > 0)) return;
  dailyGoalMinutes = Math.min(v, 1440);
  try { localStorage.setItem(GOAL_KEY, String(dailyGoalMinutes)); } catch (_) {}
  refreshStats();
};

// Click the goal progress row or bar to pick a goal
const closeGoalMenu = () => {
  const existing = document.getElementById('goalMenu');
  if (existing) existing.remove();
  document.removeEventListener('mousedown', onGoalMenuOutside, true);
  document.removeEventListener('keydown', onGoalMenuKey, true);
  window.removeEventListener('resize', closeGoalMenu);
};
function onGoalMenuOutside(e) {
  const menu = document.getElementById('goalMenu');
  if (menu && !menu.contains(e.target)) closeGoalMenu();
}
function onGoalMenuKey(e) {
  if (e.key === 'Escape') closeGoalMenu();
}

const openGoalMenu = (anchor) => {
  closeGoalMenu();
  const menu = document.createElement('div');
  menu.id = 'goalMenu';
  menu.className = 'planner-ctx-menu goal-menu';

  const title = document.createElement('div');
  title.className = 'goal-menu-title';
  title.textContent = 'Daily focus goal (minutes)';

  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'goal-menu-input';
  input.min = 1; input.max = 1440; input.step = 5;
  input.value = dailyGoalMinutes;
  const apply = () => { setDailyGoal(input.value); closeGoalMenu(); };
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') apply(); });

  const presets = document.createElement('div');
  presets.className = 'goal-menu-presets';
  [30, 60, 120, 180, 240].forEach(m => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'planner-ctx-item';
    b.textContent = fmtHM(m);
    b.addEventListener('click', () => { setDailyGoal(m); closeGoalMenu(); });
    presets.appendChild(b);
  });

  const save = document.createElement('button');
  save.type = 'button';
  save.className = 'planner-ctx-item';
  save.textContent = 'Set goal';
  save.addEventListener('click', apply);

  menu.append(title, input, presets, save);
  document.body.appendChild(menu);
  const a = anchor.getBoundingClientRect();
  const r = menu.getBoundingClientRect();
  menu.style.left = Math.max(4, Math.min(a.left, window.innerWidth - r.width - 4)) + 'px';
  menu.style.top = Math.max(4, Math.min(a.bottom + 6, window.innerHeight - r.height - 4)) + 'px';
  document.addEventListener('mousedown', onGoalMenuOutside, true);
  document.addEventListener('keydown', onGoalMenuKey, true);
  window.addEventListener('resize', closeGoalMenu);
  input.focus(); input.select();
};

[goalRow, goalBar].forEach(el => {
  if (el) el.addEventListener('click', () => openGoalMenu(goalBar || el));
});

// Right-click the stats box to choose which stats are shown (keyed by value element id)
const STATS_HIDDEN_KEY = 'hiddenStats';
const statsBoxEl = document.getElementById('statsBox');
let hiddenStats = new Set();
try { hiddenStats = new Set(JSON.parse(localStorage.getItem(STATS_HIDDEN_KEY)) || []); } catch (_) {}

const statRows = () => statsBoxEl ? [...statsBoxEl.querySelectorAll('.stats-row')] : [];
const statRowKey = (row) => row.querySelector('.stats-value').id;

const applyStatsVisibility = () => {
  statRows().forEach(row => row.classList.toggle('hidden', hiddenStats.has(statRowKey(row))));
  if (goalBar) goalBar.classList.toggle('hidden', hiddenStats.has('statGoalProgress'));
};

const closeStatsContextMenu = () => {
  const existing = document.getElementById('statsCtxMenu');
  if (existing) existing.remove();
  document.removeEventListener('mousedown', onStatsCtxOutside, true);
  document.removeEventListener('keydown', onStatsCtxKey, true);
  window.removeEventListener('resize', closeStatsContextMenu);
};
function onStatsCtxOutside(e) {
  const menu = document.getElementById('statsCtxMenu');
  if (menu && !menu.contains(e.target)) closeStatsContextMenu();
}
function onStatsCtxKey(e) {
  if (e.key === 'Escape') closeStatsContextMenu();
}

const openStatsContextMenu = (x, y) => {
  closeStatsContextMenu();
  const menu = document.createElement('div');
  menu.id = 'statsCtxMenu';
  menu.className = 'planner-ctx-menu';

  statRows().forEach(row => {
    const key = statRowKey(row);
    const label = document.createElement('label');
    label.className = 'planner-ctx-item stats-ctx-item';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = !hiddenStats.has(key);
    cb.addEventListener('change', () => {
      if (cb.checked) hiddenStats.delete(key); else hiddenStats.add(key);
      try { localStorage.setItem(STATS_HIDDEN_KEY, JSON.stringify([...hiddenStats])); } catch (_) {}
      applyStatsVisibility();
    });
    label.append(cb, ' ', row.querySelector('.stats-label').textContent);
    menu.appendChild(label);
  });

  document.body.appendChild(menu);
  const r = menu.getBoundingClientRect();
  menu.style.left = Math.max(4, Math.min(x, window.innerWidth - r.width - 4)) + 'px';
  menu.style.top = Math.max(4, Math.min(y, window.innerHeight - r.height - 4)) + 'px';
  document.addEventListener('mousedown', onStatsCtxOutside, true);
  document.addEventListener('keydown', onStatsCtxKey, true);
  window.addEventListener('resize', closeStatsContextMenu);
};

if (statsBoxEl) {
  statsBoxEl.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    openStatsContextMenu(e.clientX, e.clientY);
  });
  applyStatsVisibility();
}

const initCompactHeatmap = () => {
  if (!compactHeatmapPanel) return;
  new ResizeObserver(refreshCompactHeatmap).observe(compactHeatmapPanel);
  refreshCompactHeatmap();
  const scheduleHourly = () => {
    const now = new Date();
    const msToNextHour = (60 - now.getMinutes()) * 60000 - now.getSeconds() * 1000 - now.getMilliseconds();
    setTimeout(() => { refreshCompactHeatmap(); scheduleHourly(); }, msToNextHour);
  };
  scheduleHourly();
};


// ── Task management ────────────────────────────────────────────────────────
let tasks = [];
let nextId = 1;
let deletionHistory = [];
let draggedTaskId = null;
const expandedSubtaskIds = new Set();
const expandedPlannerIds = new Set();
let plannerDoneCollapsed = true;
let plannerTableSort = { key: null, dir: 'asc' }; // table view; key null = grouped by column
// 'board' | 'list'; remembered across sessions, defaulting to list on narrow windows
let plannerView = (() => {
  try {
    const saved = localStorage.getItem('plannerView');
    if (saved === 'board' || saved === 'list' || saved === 'table') return saved;
  } catch {}
  return window.innerWidth <= 700 ? 'list' : 'board';
})();

const STORAGE_KEY = 'pomodoroState';
const SETTINGS_KEY = 'pomodoroSettings';
const BACKUP_KEYS = [STORAGE_KEY, SETTINGS_KEY, 'heatmapPalette', 'uiTheme', 'bgImageData'];

const exportBackup = () => {
  // Write current settings first so defaults (sound, mute, notifications) are
  // included even if the user never changed anything.
  saveSettings();
  const data = {};
  BACKUP_KEYS.forEach(key => {
    const value = localStorage.getItem(key);
    if (value !== null) data[key] = value;
  });
  if (data[SETTINGS_KEY]) {
    try {
      const s = JSON.parse(data[SETTINGS_KEY]);
      delete s.alwaysOnTop;
      data[SETTINGS_KEY] = JSON.stringify(s);
    } catch (_) {}
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pomodoro-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

let _pendingImportData = null;

const saveState = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    tasks: tasks.map(({ showSubInput, ...t }) => t),
    focusedSecondsTotal,
    dailyFocus,
    nextId,
    logEntries,
  }));
};

const saveSettings = () => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      isDark: document.body.classList.contains('dark'),
      soundValue: soundSelect.value,
      lastSoundMode,
      soundDisabledBySetting,
      workMinutes,
      breakMinutes,
      isCustomPreset: customPresetChip.classList.contains('active'),
      bgOpacity: bgOpacity.value,
      columnOpacity: columnOpacity.value,
      alwaysOnTop: isAlwaysOnTop,
      notificationsEnabled,
      deadlineRemindersEnabled,
    }));
  } catch (_) {}
};

const saveBgImage = () => {
  try { localStorage.setItem('bgImageData', bgImageData); } catch (_) {}
};

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    if (Array.isArray(s.tasks)) tasks = s.tasks.map(t => ({ completed: false, repeat: null, ...t, showSubInput: false }));
    if (typeof s.focusedSecondsTotal === 'number') focusedSecondsTotal = s.focusedSecondsTotal;
    // Load old dailyFocus first (preserves pre-logEntry history)
    if (s.dailyFocus && typeof s.dailyFocus === 'object') Object.assign(dailyFocus, s.dailyFocus);
    if (typeof s.nextId === 'number') nextId = s.nextId;
    if (Array.isArray(s.logEntries)) {
      logEntries = s.logEntries;
      // Rebuild dailyFocus for days covered by logEntries using local dateKey (fixes UTC timezone mismatch)
      const rebuiltDays = new Set();
      logEntries.forEach(entry => {
        const dt = new Date(entry.timestampMs);
        entry.dateKey = dateKey(dt);
        entry.slot = slotKeyFromDate(dt);
        rebuiltDays.add(entry.dateKey);
      });
      rebuiltDays.forEach(k => { delete dailyFocus[k]; });
      logEntries.forEach(entry => {
        if (!dailyFocus[entry.dateKey]) dailyFocus[entry.dateKey] = {};
        if (entry.slot !== null) {
          dailyFocus[entry.dateKey][entry.slot] = (dailyFocus[entry.dateKey][entry.slot] || 0) + Math.round(entry.seconds / 60);
        } else {
          dailyFocus[entry.dateKey].x = (dailyFocus[entry.dateKey].x || 0) + Math.round(entry.seconds / 60);
        }
      });
    }
  } catch (_) {}
  const savedPalette = localStorage.getItem('heatmapPalette');
  if (savedPalette && HEATMAP_PALETTES[savedPalette]) applyHeatmapPalette(savedPalette);
  const savedUiTheme = localStorage.getItem('uiTheme');
  if (savedUiTheme && UI_THEMES[savedUiTheme]) applyUiTheme(savedUiTheme);
};

const loadSettings = () => {
  // First-run defaults: "chime" and unmuted (overridden below by saved settings).
  soundSelect.value = 'chime';
  try {
    const sr = localStorage.getItem(SETTINGS_KEY);
    if (!sr) return;
    const s = JSON.parse(sr);
    if (s.isDark) { document.body.classList.add('dark'); themeToggleImg.src = 'assets/icons/Light mode.png'; }
    if (s.soundValue && [...soundSelect.options].some(o => o.value === s.soundValue)) soundSelect.value = s.soundValue;
    if (s.lastSoundMode) lastSoundMode = s.lastSoundMode;
    if (typeof s.soundDisabledBySetting === 'boolean') soundDisabledBySetting = s.soundDisabledBySetting;
    if (typeof s.workMinutes === 'number' && s.workMinutes >= 1) workMinutes = s.workMinutes;
    if (typeof s.breakMinutes === 'number' && s.breakMinutes >= 1) breakMinutes = s.breakMinutes;
    if (s.bgOpacity !== undefined) { bgOpacity.value = s.bgOpacity; opacityLabel.textContent = `${s.bgOpacity}%`; }
    if (s.columnOpacity !== undefined) { columnOpacity.value = s.columnOpacity; columnOpacityLabel.textContent = `${s.columnOpacity}%`; }
    if (s.isCustomPreset) customPresetChip.classList.add('active');
    if (typeof s.alwaysOnTop === 'boolean') isAlwaysOnTop = s.alwaysOnTop;
    if (typeof s.notificationsEnabled === 'boolean') notificationsEnabled = s.notificationsEnabled;
    if (typeof s.deadlineRemindersEnabled === 'boolean') deadlineRemindersEnabled = s.deadlineRemindersEnabled;
  } catch (_) {}
  const savedBg = localStorage.getItem('bgImageData');
  if (savedBg && savedBg.startsWith('assets/')) bgImageData = savedBg;
};

const pushUndo = (entry) => {
  deletionHistory.push(entry);
  if (deletionHistory.length > 20) deletionHistory.shift();
};

const undoLastDeletion = () => {
  const entry = deletionHistory.pop();
  if (!entry) return;
  if (entry.type === 'task') {
    const idx = Math.min(entry.index, tasks.length);
    tasks.splice(idx, 0, entry.task);
    renderTasks({ updateCalendar: true });
  } else if (entry.type === 'subtask') {
    const t = tasks.find((t) => t.id === entry.taskId);
    if (!t) return;
    const idx = Math.min(entry.index, t.subtasks.length);
    t.subtasks.splice(idx, 0, entry.subtask);
    renderTasks();
  }
};

const buildTaskItem = (task, isCompleted) => {
    const li = document.createElement('li');
    li.className = `task-item${isCompleted ? ' completed-item slide-in' : ''}`;

    const mainRow = document.createElement('div');
    mainRow.className = 'task-main-row';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `task-btn${task.active ? ' active' : ''}`;
    btn.textContent = task.text;
    btn.title = task.text;
    if (!isCompleted) {
      btn.addEventListener('click', () => {
        tasks.forEach((t) => { t.active = false; });
        task.active = true;
        focusCard.textContent = `🎯 Current Task: ${task.text}`;
        renderTasks();
      });
      btn.addEventListener('dblclick', (e) => { e.stopPropagation(); openPlannerEditPanel(task); });
    }

    // Urgent badge — left of task title
    if (task.urgent) {
      const ub = document.createElement('span');
      ub.className = 'task-urgent-badge';
      ub.textContent = '🚨';
      mainRow.appendChild(ub);
    }

    const badges = document.createElement('div');
    badges.className = 'task-badges';
    if (task.deadline) {
      const dc = document.createElement('span');
      dc.className = 'task-deadline-chip';
      dc.textContent = `📅 ${task.deadline}`;
      badges.appendChild(dc);
    }
    if (task.repeat) badges.appendChild(buildRepeatChip(task.repeat));

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    if (isCompleted) {
      const returnBtn = document.createElement('button');
      returnBtn.type = 'button';
      returnBtn.className = 'task-action-btn return-btn';
      returnBtn.title = 'Return to Task Planner';
      returnBtn.textContent = '↩';
      returnBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setTaskCompleted(task, false);
        renderTasks({ updateCalendar: true });
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'task-action-btn';
      deleteBtn.title = 'Delete task';
      deleteBtn.textContent = '🗑';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const existing = li.querySelector('.delete-confirm');
        if (existing) { existing.remove(); return; }

        const confirmRow = document.createElement('div');
        confirmRow.className = 'delete-confirm';

        const msg = document.createElement('span');
        msg.textContent = 'Are you sure?';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'delete-confirm-cancel';
        cancelBtn.textContent = 'No';
        cancelBtn.addEventListener('click', (ev) => { ev.stopPropagation(); confirmRow.remove(); });

        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'delete-confirm-ok';
        confirmBtn.textContent = 'Yes';
        confirmBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          pushUndo({ type: 'task', task: { ...task, subtasks: [...(task.subtasks || [])] }, index: tasks.indexOf(task) });
          tasks = tasks.filter((t) => t.id !== task.id);
          renderTasks({ updateCalendar: true });
        });

        confirmRow.appendChild(msg);
        confirmRow.appendChild(cancelBtn);
        confirmRow.appendChild(confirmBtn);
        li.appendChild(confirmRow);

        const dismissConfirm = (ev) => {
          if (!confirmRow.contains(ev.target) && ev.target !== deleteBtn) {
            confirmRow.remove();
            document.removeEventListener('pointerdown', dismissConfirm);
          }
        };
        setTimeout(() => document.addEventListener('pointerdown', dismissConfirm), 0);
      });

      actions.appendChild(returnBtn);
      actions.appendChild(deleteBtn);
    } else {
      const addSubBtn = document.createElement('button');
      addSubBtn.type = 'button';
      addSubBtn.className = 'task-action-btn';
      addSubBtn.title = 'Add sub-task';
      addSubBtn.textContent = '＋';
      addSubBtn.style.fontWeight = '800';
      addSubBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        task.showSubInput = !task.showSubInput;
        renderTasks();
      });

      const finishBtn = document.createElement('button');
      finishBtn.type = 'button';
      finishBtn.className = 'task-action-btn finish-btn';
      finishBtn.title = 'Mark as complete';
      finishBtn.textContent = '✓';
      finishBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const existing = li.querySelector('.delete-confirm');
        if (existing) { existing.remove(); return; }

        const confirmRow = document.createElement('div');
        confirmRow.className = 'delete-confirm';

        const msg = document.createElement('span');
        msg.textContent = 'Mark as complete?';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'delete-confirm-cancel';
        cancelBtn.textContent = 'No';
        cancelBtn.addEventListener('click', (ev) => { ev.stopPropagation(); confirmRow.remove(); });

        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'delete-confirm-ok complete-ok';
        confirmBtn.textContent = 'Yes';
        confirmBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          setTaskCompleted(task, true);
          if (task.active) { task.active = false; focusCard.textContent = '🎯 No task selected yet'; }
          renderTasks({ updateCalendar: true });
        });

        confirmRow.appendChild(msg);
        confirmRow.appendChild(cancelBtn);
        confirmRow.appendChild(confirmBtn);
        li.appendChild(confirmRow);

        const dismissConfirm = (ev) => {
          if (!confirmRow.contains(ev.target) && ev.target !== finishBtn) {
            confirmRow.remove();
            document.removeEventListener('pointerdown', dismissConfirm);
          }
        };
        setTimeout(() => document.addEventListener('pointerdown', dismissConfirm), 0);
      });

      const editTaskBtn = document.createElement('button');
      editTaskBtn.type = 'button';
      editTaskBtn.className = 'task-action-btn';
      editTaskBtn.title = 'Edit task';
      editTaskBtn.textContent = '✏️';
      editTaskBtn.addEventListener('click', (e) => { e.stopPropagation(); openPlannerEditPanel(task); });

      actions.appendChild(editTaskBtn);
      actions.appendChild(addSubBtn);
      actions.appendChild(finishBtn);
    }

    mainRow.appendChild(btn);
    mainRow.appendChild(badges);
    mainRow.appendChild(actions);
    li.appendChild(mainRow);

    if (!isCompleted && task.subtasks.length > 0) {
      const subList = document.createElement('ul');
      subList.className = 'subtask-list';
      task.subtasks.forEach((sub) => {
        const subLi = document.createElement('li');
        subLi.className = `subtask-item${sub.done ? ' done' : ''}`;

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = sub.done;
        cb.addEventListener('change', () => { sub.done = cb.checked; renderTasks(); });

        const subText = document.createElement('span');
        subText.className = 'subtask-text';
        subText.textContent = sub.text;
        subText.title = sub.text;
        if (expandedSubtaskIds.has(sub.id)) subText.classList.add('expanded');
        subText.addEventListener('click', (e) => {
          e.stopPropagation();
          if (expandedSubtaskIds.has(sub.id)) expandedSubtaskIds.delete(sub.id);
          else expandedSubtaskIds.add(sub.id);
          subText.classList.toggle('expanded');
        });
        const startSubEdit = () => {
          const inp = document.createElement('input');
          inp.type = 'text';
          inp.value = sub.text;
          inp.className = 'subtask-inline-edit';
          inp.maxLength = 100;
          subText.replaceWith(inp);
          inp.focus();
          inp.select();
          let committed = false;
          const commit = () => {
            if (committed) return;
            committed = true;
            const val = inp.value.trim();
            if (val) sub.text = val;
            renderTasks();
          };
          inp.addEventListener('blur', commit);
          inp.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter') { ev.preventDefault(); inp.blur(); }
            if (ev.key === 'Escape') { committed = true; renderTasks(); }
          });
        };
        subText.addEventListener('dblclick', (e) => { e.stopPropagation(); startSubEdit(); });

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'subtask-del';
        delBtn.textContent = '✕';
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const existing = subLi.querySelector('.delete-confirm');
          if (existing) { existing.remove(); return; }

          const confirmRow = document.createElement('div');
          confirmRow.className = 'delete-confirm';

          const msg = document.createElement('span');
          msg.textContent = 'Are you sure?';

          const cancelBtn = document.createElement('button');
          cancelBtn.className = 'delete-confirm-cancel';
          cancelBtn.textContent = 'No';
          cancelBtn.addEventListener('click', (ev) => { ev.stopPropagation(); confirmRow.remove(); });

          const confirmBtn = document.createElement('button');
          confirmBtn.className = 'delete-confirm-ok';
          confirmBtn.textContent = 'Yes';
          confirmBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            pushUndo({ type: 'subtask', taskId: task.id, subtask: { ...sub }, index: task.subtasks.indexOf(sub) });
            task.subtasks = task.subtasks.filter((s) => s.id !== sub.id);
            renderTasks();
          });

          confirmRow.appendChild(msg);
          confirmRow.appendChild(cancelBtn);
          confirmRow.appendChild(confirmBtn);
          subLi.appendChild(confirmRow);

          const dismissConfirm = (ev) => {
            if (!confirmRow.contains(ev.target) && ev.target !== delBtn) {
              confirmRow.remove();
              document.removeEventListener('pointerdown', dismissConfirm);
            }
          };
          setTimeout(() => document.addEventListener('pointerdown', dismissConfirm), 0);
        });

        const subEditBtn = document.createElement('button');
        subEditBtn.type = 'button';
        subEditBtn.className = 'subtask-edit-btn';
        subEditBtn.title = 'Edit sub-task';
        subEditBtn.textContent = '✏️';
        subEditBtn.addEventListener('click', (e) => { e.stopPropagation(); startSubEdit(); });

        subLi.appendChild(cb);
        subLi.appendChild(subText);
        subLi.appendChild(subEditBtn);
        subLi.appendChild(delBtn);
        subList.appendChild(subLi);
      });
      li.appendChild(subList);
    }

    if (!isCompleted && task.showSubInput) {
      const addRow = document.createElement('div');
      addRow.className = 'add-subtask-row';

      const subInput = document.createElement('input');
      subInput.type = 'text';
      subInput.placeholder = 'Add sub-task…';
      subInput.maxLength = 100;

      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'add-subtask-add-btn';
      addBtn.textContent = 'Add';

      const commitSub = () => {
        const text = subInput.value.trim();
        if (!text) return;
        task.subtasks.push({ id: nextId++, text, done: false });
        task.showSubInput = false;
        renderTasks();
      };

      addBtn.addEventListener('click', commitSub);
      subInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') commitSub();
        if (e.key === 'Escape') { task.showSubInput = false; renderTasks(); }
      });

      const dismissOnOutsideClick = (e) => {
        if (!li.contains(e.target)) {
          document.removeEventListener('pointerdown', dismissOnOutsideClick);
          task.showSubInput = false;
          renderTasks();
        }
      };
      setTimeout(() => document.addEventListener('pointerdown', dismissOnOutsideClick), 0);

      addRow.appendChild(subInput);
      addRow.appendChild(addBtn);
      li.appendChild(addRow);
      setTimeout(() => subInput.focus(), 0);
    }

    if (!isCompleted) {
      li.draggable = true;

      li.addEventListener('dragstart', (e) => {
        draggedTaskId = task.id;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(task.id));
        requestAnimationFrame(() => li.classList.add('dragging'));
      });

      li.addEventListener('dragend', () => {
        draggedTaskId = null;
        li.classList.remove('dragging');
        taskList.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
      });

      li.addEventListener('dragover', (e) => {
        const dragged = tasks.find(t => t.id === draggedTaskId);
        if (!dragged || !!dragged.urgent !== !!task.urgent) return;
        e.preventDefault();
        taskList.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        li.classList.add('drag-over');
      });

      li.addEventListener('dragleave', (e) => {
        if (!li.contains(e.relatedTarget)) li.classList.remove('drag-over');
      });

      li.addEventListener('drop', (e) => {
        e.preventDefault();
        li.classList.remove('drag-over');
        const fromId = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (isNaN(fromId) || fromId === task.id) return;
        const dragged = tasks.find(t => t.id === fromId);
        if (!dragged || !!dragged.urgent !== !!task.urgent) return;
        const fromIdx = tasks.findIndex(t => t.id === fromId);
        tasks.splice(fromIdx, 1);
        const toIdx = tasks.findIndex(t => t.id === task.id);
        tasks.splice(toIdx, 0, dragged);
        renderTasks();
      });
    }

    return li;
};

const PLANNER_SECTIONS = [
  { key: 'today',   label: 'Today' },
  { key: 'week',    label: 'Next 7 Days' },
  { key: 'someday', label: 'Someday' },
  { key: 'done',    label: 'Done' },
];

const getTaskSection = (task, todayStr, weekEndStr) => {
  if (task.completed) return 'done';
  // Tasks with a deadline are placed by date on every render; only undated tasks keep a manual column
  if (!task.deadline) return task.plannedSection || 'someday';
  if (task.deadline <= todayStr) return 'today';
  if (task.deadline <= weekEndStr) return 'week';
  return 'someday';
};

const movePlannerTask = (id, targetSection) => {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  pushPlannerHistory();
  if (targetSection === 'done') {
    setTaskCompleted(task, true);
    task.plannedSection = null;
  } else {
    setTaskCompleted(task, false);
    task.plannedSection = targetSection;
  }
  renderTasks({ updateCalendar: true });
  renderPlanner();
};

const openPlannerEditPanel = (task, { isNew = false } = {}) => {
  const existingScrim = document.getElementById('plannerEditScrim');
  if (existingScrim) { existingScrim.remove(); return; }

  // Work on a draft so clicking outside discards changes cleanly
  const draft = {
    text: task.text,
    urgent: !!task.urgent,
    deadline: task.deadline || '',
    subtasks: (task.subtasks || []).map(s => ({ ...s })),
    repeat: task.repeat ? { ...task.repeat, days: task.repeat.days ? [...task.repeat.days] : undefined } : null,
  };

  // Undo / redo history
  const cloneDraft = () => ({
    ...draft,
    subtasks: draft.subtasks.map(s => ({ ...s })),
    repeat: draft.repeat ? { ...draft.repeat, days: draft.repeat.days ? [...draft.repeat.days] : undefined } : null,
  });
  const history = [cloneDraft()];
  let histIdx = 0;

  const pushHistory = () => {
    history.splice(histIdx + 1);
    history.push(cloneDraft());
    histIdx = history.length - 1;
  };

  // Scrim — click outside panel to discard
  const scrim = document.createElement('div');
  scrim.id = 'plannerEditScrim';
  scrim.className = 'planner-edit-scrim';
  let pointerDownOnPanel = false;
  let isResizing = false;
  scrim.addEventListener('pointerdown', (e) => {
    pointerDownOnPanel = !!e.target.closest('#plannerEditPanel');
  });
  scrim.addEventListener('click', () => {
    if (isResizing) { isResizing = false; return; }
    if (!pointerDownOnPanel) scrim.remove();
  });

  const panel = document.createElement('div');
  panel.id = 'plannerEditPanel';
  panel.className = 'planner-edit-panel';
  panel.addEventListener('click', e => e.stopPropagation());

  // Drag handle
  const dragHandle = document.createElement('div');
  dragHandle.className = 'planner-edit-drag-handle';
  dragHandle.addEventListener('pointerdown', (e) => {
    if (e.target === closeBtn) return;
    e.preventDefault();
    e.stopPropagation();
    isResizing = true; // reuse flag to block scrim close on release
    const scrimRect = scrim.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    // Switch to absolute positioning anchored at current visual position
    panel.style.position = 'absolute';
    panel.style.left = (panelRect.left - scrimRect.left) + 'px';
    panel.style.top  = (panelRect.top  - scrimRect.top)  + 'px';
    panel.style.margin = '0';
    const startX = e.clientX;
    const startY = e.clientY;
    const origLeft = parseFloat(panel.style.left);
    const origTop  = parseFloat(panel.style.top);
    const onMove = (ev) => {
      panel.style.left = (origLeft + ev.clientX - startX) + 'px';
      panel.style.top  = (origTop  + ev.clientY - startY) + 'px';
    };
    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  });

  const handleTitle = document.createElement('span');
  handleTitle.className = 'planner-edit-handle-title';
  handleTitle.textContent = 'Task Editor';
  dragHandle.appendChild(handleTitle);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'planner-edit-close';
  closeBtn.textContent = '✕';
  closeBtn.title = 'Close';
  closeBtn.addEventListener('click', () => scrim.remove());
  dragHandle.appendChild(closeBtn);
  panel.appendChild(dragHandle);

  // Task text

  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.className = 'planner-edit-input';
  textInput.maxLength = 100;
  textInput.value = draft.text;
  textInput.addEventListener('blur', () => { draft.text = textInput.value; pushHistory(); });

  panel.appendChild(textInput);

  // Subtasks box
  const subLabel = document.createElement('div');
  subLabel.className = 'planner-edit-label';
  subLabel.textContent = 'Subtasks';
  panel.appendChild(subLabel);

  const subBox = document.createElement('div');
  subBox.className = 'planner-edit-subbox';

  let pendingSubInput = null; // "Add subtask…" field; its text is saved with the task
  const renderSubList = () => {
    subBox.innerHTML = '';
    draft.subtasks.forEach((sub, i) => {
      const row = document.createElement('div');
      row.className = 'planner-edit-sub-row';

      const check = document.createElement('input');
      check.type = 'checkbox';
      check.checked = sub.done;
      check.addEventListener('change', () => { sub.done = check.checked; pushHistory(); });

      const subInput = document.createElement('textarea');
      subInput.className = 'planner-edit-sub-input';
      subInput.value = sub.text;
      subInput.maxLength = 300;
      subInput.rows = 1;
      const autoResize = () => { subInput.style.height = 'auto'; subInput.style.height = subInput.scrollHeight + 'px'; };
      subInput.addEventListener('input', () => { sub.text = subInput.value; autoResize(); });
      subInput.addEventListener('blur', () => pushHistory());
      requestAnimationFrame(autoResize);

      const delBtn = document.createElement('button');
      delBtn.className = 'planner-edit-sub-del';
      delBtn.textContent = '✕';
      delBtn.addEventListener('click', () => {
        draft.subtasks.splice(i, 1);
        pushHistory();
        renderSubList();
      });

      row.appendChild(check);
      row.appendChild(subInput);
      row.appendChild(delBtn);
      subBox.appendChild(row);
    });

    const addRow = document.createElement('div');
    addRow.className = 'planner-edit-sub-row';
    const newInput = document.createElement('textarea');
    newInput.className = 'planner-edit-sub-input';
    newInput.placeholder = 'Add subtask…';
    newInput.maxLength = 300;
    newInput.rows = 1;
    pendingSubInput = newInput;
    newInput.addEventListener('input', () => { newInput.style.height = 'auto'; newInput.style.height = newInput.scrollHeight + 'px'; });
    const addBtn = document.createElement('button');
    addBtn.className = 'planner-edit-sub-add';
    addBtn.textContent = '+';
    const commitNew = () => {
      const t = newInput.value.trim();
      if (!t) return;
      draft.subtasks.push({ id: nextId++, text: t, done: false });
      pushHistory();
      renderSubList();
    };
    addBtn.addEventListener('click', commitNew);
    newInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.stopPropagation(); commitNew(); } });
    addRow.appendChild(newInput);
    addRow.appendChild(addBtn);
    subBox.appendChild(addRow);
  };

  renderSubList();
  panel.appendChild(subBox);

  // Deadline + Emergency row — bottom
  const bottomRow = document.createElement('div');
  bottomRow.className = 'planner-edit-bottom-row';

  const deadlineInput = document.createElement('input');
  deadlineInput.type = 'date';
  deadlineInput.className = 'planner-edit-input planner-edit-date';
  deadlineInput.value = draft.deadline;
  deadlineInput.classList.toggle('has-date', !!draft.deadline);
  deadlineInput.addEventListener('change', () => {
    draft.deadline = deadlineInput.value;
    deadlineInput.classList.toggle('has-date', !!deadlineInput.value);
    pushHistory();
  });

  const urgentBtn = document.createElement('button');
  urgentBtn.className = 'planner-edit-urgent-btn' + (draft.urgent ? ' active' : '');
  urgentBtn.textContent = '🚨';
  urgentBtn.type = 'button';
  urgentBtn.title = 'Emergency';
  urgentBtn.addEventListener('click', () => {
    draft.urgent = !draft.urgent;
    urgentBtn.classList.toggle('active', draft.urgent);
    pushHistory();
  });

  // Repeat dropdown + custom weekday toggles
  const repeatSelect = document.createElement('select');
  repeatSelect.className = 'planner-edit-input planner-edit-repeat';
  repeatSelect.title = 'Repeat';
  [['none', 'No repeat'], ['daily', 'Daily'],['weekly', 'Weekly'], ['monthly', 'Monthly'], ['custom', 'Custom days']]
    .forEach(([value, label]) => {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = label;
      repeatSelect.appendChild(opt);
    });
  const repeatKind = (r) => !r ? 'none' : (r.type === 'weekly' && r.days && r.days.length) ? 'custom' : r.type;

  const daysRow = document.createElement('div');
  daysRow.className = 'planner-edit-days-row';
  const dayBtns = WEEKDAY_LABELS.map((label, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'planner-edit-day-btn';
    b.textContent = label;
    b.addEventListener('click', () => {
      const days = new Set(draft.repeat.days || []);
      if (days.has(i)) days.delete(i); else days.add(i);
      // Keep at least one day selected so the rule always has a next date
      if (!days.size) return;
      draft.repeat = { type: 'weekly', days: [...days].sort() };
      syncRepeatUi();
      pushHistory();
    });
    return b;
  });
  dayBtns.forEach(b => daysRow.appendChild(b));

  const syncRepeatUi = () => {
    repeatSelect.value = repeatKind(draft.repeat);
    repeatSelect.classList.toggle('has-date', !!draft.repeat);
    daysRow.hidden = repeatSelect.value !== 'custom';
    dayBtns.forEach((b, i) => b.classList.toggle('active', !!(draft.repeat && draft.repeat.days && draft.repeat.days.includes(i))));
  };
  repeatSelect.addEventListener('change', () => {
    const v = repeatSelect.value;
    if (v === 'none') draft.repeat = null;
    else if (v === 'custom') draft.repeat = { type: 'weekly', days: [(draft.deadline ? parseDateKey(draft.deadline) : new Date()).getDay()] };
    else draft.repeat = { type: v };
    syncRepeatUi();
    pushHistory();
  });
  syncRepeatUi();

  bottomRow.appendChild(deadlineInput);
  bottomRow.appendChild(repeatSelect);
  bottomRow.appendChild(urgentBtn);
  panel.appendChild(bottomRow);
  panel.appendChild(daysRow);

  // Apply a history snapshot back into the UI
  const applySnapshot = (snap) => {
    draft.text = snap.text;
    draft.urgent = snap.urgent;
    draft.deadline = snap.deadline;
    draft.subtasks = snap.subtasks.map(s => ({ ...s }));
    draft.repeat = snap.repeat ? { ...snap.repeat, days: snap.repeat.days ? [...snap.repeat.days] : undefined } : null;
    textInput.value = draft.text;
    urgentBtn.classList.toggle('active', draft.urgent);
    deadlineInput.value = draft.deadline;
    syncRepeatUi();
    renderSubList();
  };

  // Save
  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn secondary planner-edit-save';
  saveBtn.textContent = 'Save';

  const commitSave = () => {
    draft.text = textInput.value.trim();
    if (!draft.text) return;
    const pendingSub = pendingSubInput ? pendingSubInput.value.trim() : '';
    if (pendingSub) draft.subtasks.push({ id: nextId++, text: pendingSub, done: false });
    task.text = draft.text;
    task.urgent = draft.urgent;
    task.deadline = draft.deadline || null;
    task.subtasks = draft.subtasks;
    task.repeat = draft.repeat;
    if (isNew) {
      pushPlannerHistory();
      tasks.push(task);
    }
    scrim.remove();
    renderTasks({ updateCalendar: true });
    renderPlanner();
  };

  saveBtn.addEventListener('click', commitSave);
  panel.appendChild(saveBtn);

  // Keyboard shortcuts
  panel.addEventListener('keydown', (e) => {
    const ctrl = e.ctrlKey || e.metaKey;
    if (ctrl && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      if (histIdx > 0) applySnapshot(history[--histIdx]);
      return;
    }
    if ((ctrl && e.key === 'y') || (ctrl && e.shiftKey && e.key === 'z')) {
      e.preventDefault();
      if (histIdx < history.length - 1) applySnapshot(history[++histIdx]);
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey && document.activeElement !== urgentBtn && document.activeElement !== repeatSelect && !dayBtns.includes(document.activeElement)) {
      e.preventDefault();
      commitSave();
    }
  });

  // Resize handle
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'planner-edit-resize-handle';
  resizeHandle.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing = true;
    const rect = panel.getBoundingClientRect();
    const originLeft = rect.left;
    const originTop  = rect.top;
    const onMove = (ev) => {
      panel.style.width  = Math.max(260, ev.clientX - originLeft) + 'px';
      panel.style.height = Math.max(200, ev.clientY - originTop)  + 'px';
    };
    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  });
  panel.appendChild(resizeHandle);

  // Delete task button — bottom right
  const deleteTaskBtn = document.createElement('button');
  deleteTaskBtn.type = 'button';
  deleteTaskBtn.className = 'planner-edit-delete-btn';
  deleteTaskBtn.title = 'Delete task';
  deleteTaskBtn.textContent = '🗑 Delete';
  deleteTaskBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const existing = panel.querySelector('.delete-confirm');
    if (existing) { existing.remove(); return; }

    const confirmRow = document.createElement('div');
    confirmRow.className = 'delete-confirm planner-edit-delete-confirm';

    const msg = document.createElement('span');
    msg.textContent = 'Delete this task?';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'delete-confirm-cancel';
    cancelBtn.textContent = 'No';
    cancelBtn.addEventListener('click', (ev) => { ev.stopPropagation(); confirmRow.remove(); });

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'delete-confirm-ok';
    confirmBtn.textContent = 'Yes';
    confirmBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      pushUndo({ type: 'task', task: { ...task, subtasks: [...(task.subtasks || [])] }, index: tasks.indexOf(task) });
      tasks = tasks.filter((t) => t.id !== task.id);
      if (task.active) focusCard.textContent = '🎯 No task selected yet';
      scrim.remove();
      renderTasks({ updateCalendar: true });
      renderPlanner();
    });

    confirmRow.appendChild(msg);
    confirmRow.appendChild(cancelBtn);
    confirmRow.appendChild(confirmBtn);
    panel.appendChild(confirmRow);

    const dismissConfirm = (ev) => {
      if (!confirmRow.contains(ev.target) && ev.target !== deleteTaskBtn) {
        confirmRow.remove();
        document.removeEventListener('pointerdown', dismissConfirm);
      }
    };
    setTimeout(() => document.addEventListener('pointerdown', dismissConfirm), 0);
  });
  if (!isNew) panel.appendChild(deleteTaskBtn);

  scrim.appendChild(panel);
  document.body.appendChild(scrim);
  textInput.focus();
};

const buildPlannerCard = (task) => {
  const card = document.createElement('div');
  card.className = 'planner-card';
  const hasSubtasks = !!(task.subtasks && task.subtasks.length);
  const isExpanded = hasSubtasks && expandedPlannerIds.has(task.id);
  if (isExpanded) card.classList.add('expanded');
  card.draggable = true;
  card.addEventListener('mousedown', (e) => {
    const inHeader = !!e.target.closest('.planner-card-top');
    const onEditBtn = !!e.target.closest('.planner-card-edit-btn');
    const onCheck = !!e.target.closest('.planner-card-check');
    card.draggable = inHeader && !onEditBtn && !onCheck;
  });
  if (task.urgent) card.classList.add('urgent');
  if (task.completed) card.classList.add('done');
  card.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', task.id.toString());
    card.classList.add('dragging');
  });
  card.addEventListener('dragend', () => card.classList.remove('dragging'));

  const cardTop = document.createElement('div');
  cardTop.className = 'planner-card-top';

  const check = document.createElement('input');
  check.type = 'checkbox';
  check.className = 'planner-card-check';
  check.checked = !!task.completed;
  check.title = task.completed ? 'Mark as not done' : 'Mark as done';
  check.addEventListener('click', (e) => e.stopPropagation());
  check.addEventListener('change', (e) => {
    e.stopPropagation();
    pushPlannerHistory();
    setTaskCompleted(task, check.checked);
    if (check.checked) task.plannedSection = null;
    renderTasks({ updateCalendar: true });
    renderPlanner();
  });

  const textEl = document.createElement('div');
  textEl.className = 'planner-card-text';
  textEl.textContent = task.text;

  const editBtn = document.createElement('button');
  editBtn.className = 'planner-card-edit-btn';
  editBtn.title = 'Edit task';
  editBtn.textContent = '✏️';
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openPlannerEditPanel(task);
  });

  cardTop.appendChild(check);
  cardTop.appendChild(textEl);
  cardTop.appendChild(editBtn);
  card.appendChild(cardTop);

  let clickTimer = null;
  card.addEventListener('click', (e) => {
    if (e.target.closest('.planner-card-top')) return;
    if (!(task.subtasks && task.subtasks.length)) return;
    if (clickTimer) return;
    clickTimer = setTimeout(() => {
      clickTimer = null;
      if (expandedPlannerIds.has(task.id)) expandedPlannerIds.delete(task.id);
      else expandedPlannerIds.add(task.id);
      renderPlanner();
    }, 220);
  });
  card.addEventListener('dblclick', (e) => {
    if (e.target.closest('.planner-card-top')) return;
    e.stopPropagation();
    if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
    openPlannerEditPanel(task);
  });

  const meta = document.createElement('div');
  meta.className = 'planner-card-meta';
  if (task.deadline) {
    const todayStr = dateKey(new Date());
    const d = document.createElement('span');
    d.className = 'task-deadline-chip';
    if (!task.completed) {
      if (task.deadline < todayStr) d.classList.add('overdue');
      else if (task.deadline === todayStr) d.classList.add('due-today');
    }
    d.textContent = `📅 ${task.deadline}`;
    meta.appendChild(d);
  }
  if (task.repeat) meta.appendChild(buildRepeatChip(task.repeat));
  if (hasSubtasks) {
    const done = task.subtasks.filter(s => s.done).length;
    const total = task.subtasks.length;
    const s = document.createElement('span');
    s.className = 'planner-card-subtasks';
    s.textContent = `${done}/${total} ${isExpanded ? '▾' : '▸'}`;
    const bar = document.createElement('span');
    bar.className = 'planner-card-progress';
    const fill = document.createElement('span');
    fill.style.width = `${Math.round((done / total) * 100)}%`;
    bar.appendChild(fill);
    meta.appendChild(bar);
    meta.appendChild(s);
  }
  if (meta.children.length) card.appendChild(meta);

  if (isExpanded) {
    const subList = document.createElement('ul');
    subList.className = 'planner-card-subtasks-list';
    task.subtasks.forEach((sub) => {
      const row = document.createElement('li');
      row.className = 'planner-card-sub-row';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = !!sub.done;
      cb.addEventListener('click', (e) => e.stopPropagation());
      cb.addEventListener('change', (e) => {
        e.stopPropagation();
        sub.done = cb.checked;
        renderPlanner();
        renderTasks();
      });

      const txt = document.createElement('span');
      txt.className = 'planner-card-sub-text' + (sub.done ? ' done' : '');
      txt.textContent = sub.text;

      row.appendChild(cb);
      row.appendChild(txt);
      subList.appendChild(row);
    });
    card.appendChild(subList);
  }

  return card;
};

// Worksheet view: one editable row per task. Text/repeat/urgent edits save in place
// (no re-render, so Tab flow isn't interrupted); anything that changes a task's
// column (done, deadline, section) re-renders so the row regroups.
const renderPlannerTable = (todayStr, weekEndStr) => {
  const sectionLabel = Object.fromEntries(PLANNER_SECTIONS.map(s => [s.key, s.label]));
  const order = PLANNER_SECTIONS.map(s => s.key);
  const repeatRank = (r) => !r ? '' : (r.type === 'weekly' && r.days && r.days.length) ? 'custom' : r.type;
  // Header-click sorting; empty values always sort last regardless of direction
  const sortKeys = {
    done:     (t) => (t.completed ? 1 : 0),
    text:     (t) => t.text.toLowerCase(),
    deadline: (t) => t.deadline || '',
    repeat:   (t) => repeatRank(t.repeat),
    urgent:   (t) => (t.urgent ? 1 : 0),
    section:  (t, sec) => order.indexOf(sec),
    subtasks: (t) => (t.subtasks || []).length,
  };
  const rows = tasks.map(t => ({ t, sec: getTaskSection(t, todayStr, weekEndStr) }));
  if (plannerTableSort.key) {
    const get = sortKeys[plannerTableSort.key];
    const dir = plannerTableSort.dir === 'asc' ? 1 : -1;
    rows.sort((a, b) => {
      const va = get(a.t, a.sec), vb = get(b.t, b.sec);
      const ea = va === '', eb = vb === '';
      if (ea !== eb) return ea ? 1 : -1;
      return (va < vb ? -1 : va > vb ? 1 : 0) * dir;
    });
  } else {
    rows.sort((a, b) =>
      order.indexOf(a.sec) - order.indexOf(b.sec) ||
      (b.t.urgent ? 1 : 0) - (a.t.urgent ? 1 : 0) ||
      (a.t.deadline || '9999').localeCompare(b.t.deadline || '9999'));
  }

  const persist = () => renderTasks({ updateCalendar: true });
  const repeatKind = (r) => !r ? 'none' : (r.type === 'weekly' && r.days && r.days.length) ? 'custom' : r.type;

  const table = document.createElement('table');
  table.className = 'planner-table';
  const head = table.createTHead().insertRow();
  [['done', '✓'], ['text', 'Task'], ['deadline', 'Deadline'], ['repeat', 'Repeat'], ['urgent', '🚨'],
   ['section', 'Column'], ['subtasks', 'Subtasks'], [null, '']].forEach(([key, label]) => {
    const th = document.createElement('th');
    th.textContent = label;
    if (key) {
      th.classList.add('sortable');
      const active = plannerTableSort.key === key;
      if (active) {
        th.classList.add('sorted');
        th.setAttribute('aria-sort', plannerTableSort.dir === 'asc' ? 'ascending' : 'descending');
        const arrow = document.createElement('span');
        arrow.className = 'sort-arrow';
        arrow.textContent = plannerTableSort.dir === 'asc' ? ' ▲' : ' ▼';
        th.appendChild(arrow);
      }
      th.title = 'Click to sort';
      th.addEventListener('click', () => {
        if (plannerTableSort.key === key) {
          plannerTableSort.dir = plannerTableSort.dir === 'asc' ? 'desc' : 'asc';
        } else {
          plannerTableSort = { key, dir: 'asc' };
        }
        renderPlanner();
      });
    }
    head.appendChild(th);
  });

  const tbody = table.createTBody();
  rows.forEach(({ t: task, sec }) => {
    const tr = tbody.insertRow();
    tr.className = `planner-table-row sec-${sec}` + (task.urgent ? ' urgent' : '') + (task.completed ? ' done' : '');

    // Done checkbox
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'planner-card-check';
    check.checked = !!task.completed;
    check.addEventListener('change', () => {
      pushPlannerHistory();
      setTaskCompleted(task, check.checked);
      if (check.checked) task.plannedSection = null;
      persist();
      renderPlanner();
    });
    tr.insertCell().appendChild(check);

    // Task text
    const text = document.createElement('input');
    text.type = 'text';
    text.className = 'planner-table-input planner-table-text';
    text.maxLength = 100;
    text.value = task.text;
    text.addEventListener('change', () => {
      const v = text.value.trim();
      if (!v) { text.value = task.text; return; }
      task.text = v;
      persist();
    });
    text.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') text.blur();
      else if (e.key === 'Escape') { text.value = task.text; text.blur(); }
    });
    tr.insertCell().appendChild(text);

    // Deadline
    const date = document.createElement('input');
    date.type = 'date';
    date.className = 'planner-table-input planner-table-date';
    date.value = task.deadline || '';
    date.addEventListener('change', () => {
      task.deadline = date.value || null;
      persist();
      renderPlanner();
    });
    tr.insertCell().appendChild(date);

    // Repeat
    const rep = document.createElement('select');
    rep.className = 'planner-table-input planner-table-repeat';
    const kind = repeatKind(task.repeat);
    [['none', '—'], ['daily', 'Daily'], ['weekly', 'Weekly'], ['monthly', 'Monthly'], ...(kind === 'custom' ? [['custom', 'Custom days']] : [])]
      .forEach(([v, l]) => {
        const o = document.createElement('option');
        o.value = v; o.textContent = l;
        rep.appendChild(o);
      });
    rep.value = kind;
    rep.addEventListener('change', () => {
      if (rep.value === 'custom') return; // keep existing custom days
      task.repeat = rep.value === 'none' ? null : { type: rep.value };
      persist();
    });
    tr.insertCell().appendChild(rep);

    // Urgent toggle
    const urg = document.createElement('button');
    urg.type = 'button';
    urg.className = 'planner-table-urgent' + (task.urgent ? ' active' : '');
    urg.textContent = '🚨';
    urg.title = 'Toggle urgent';
    urg.addEventListener('click', () => {
      task.urgent = !task.urgent;
      persist();
      renderPlanner();
    });
    tr.insertCell().appendChild(urg);

    // Column: editable only for undated tasks (dated tasks are placed by deadline)
    const secCell = tr.insertCell();
    if (task.deadline && !task.completed) {
      const tag = document.createElement('span');
      tag.className = 'planner-table-sec-tag';
      tag.textContent = sectionLabel[sec];
      tag.title = 'Placed automatically by deadline';
      secCell.appendChild(tag);
    } else {
      const sel = document.createElement('select');
      sel.className = 'planner-table-input';
      PLANNER_SECTIONS.forEach(({ key, label }) => {
        const o = document.createElement('option');
        o.value = key; o.textContent = label;
        sel.appendChild(o);
      });
      sel.value = sec;
      sel.addEventListener('change', () => movePlannerTask(task.id, sel.value));
      secCell.appendChild(sel);
    }

    // Subtasks -> open full editor
    const subs = task.subtasks || [];
    const subBtn = document.createElement('button');
    subBtn.type = 'button';
    subBtn.className = 'planner-table-subs';
    subBtn.textContent = subs.length ? `${subs.filter(s => s.done).length}/${subs.length}` : '+';
    subBtn.title = 'Edit subtasks';
    subBtn.addEventListener('click', () => openPlannerEditPanel(task));
    tr.insertCell().appendChild(subBtn);

    // Delete (click twice to confirm)
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'planner-table-del';
    del.textContent = '🗑';
    del.title = 'Delete task';
    let armed = null;
    del.addEventListener('click', () => {
      if (!armed) {
        del.textContent = 'Sure?';
        del.classList.add('armed');
        armed = setTimeout(() => { armed = null; del.textContent = '🗑'; del.classList.remove('armed'); }, 2500);
        return;
      }
      clearTimeout(armed);
      pushUndo({ type: 'task', task: { ...task, subtasks: [...subs] }, index: tasks.indexOf(task) });
      tasks = tasks.filter(t => t.id !== task.id);
      if (task.active) focusCard.textContent = '🎯 No task selected yet';
      persist();
      renderPlanner();
    });
    tr.insertCell().appendChild(del);
  });

  // New-task row
  const addRow = tbody.insertRow();
  addRow.className = 'planner-table-addrow';
  addRow.insertCell();
  const addCell = addRow.insertCell();
  addCell.colSpan = 7;
  const addInput = document.createElement('input');
  addInput.type = 'text';
  addInput.className = 'planner-table-input planner-table-text';
  addInput.maxLength = 100;
  addInput.placeholder = '+ New task — type and press Enter';
  addInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const v = addInput.value.trim();
    if (!v) return;
    pushPlannerHistory();
    tasks.push({
      id: nextId++, text: v, active: false, urgent: false, deadline: null,
      subtasks: [], showSubInput: false, completed: false, plannedSection: 'today',
    });
    persist();
    renderPlanner();
    plannerBoard.querySelector('.planner-table-addrow input')?.focus();
  });
  addCell.appendChild(addInput);

  const wrap = document.createElement('div');
  wrap.className = 'planner-table-wrap';
  wrap.appendChild(table);
  plannerBoard.appendChild(wrap);
};

const renderPlanner = () => {
  if (!plannerBoard) return;
  plannerBoard.innerHTML = '';
  const todayStr = dateKey(new Date());
  const weekEndStr = dateKey(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  plannerBoard.classList.toggle('done-collapsed', plannerDoneCollapsed);
  plannerBoard.classList.toggle('list-view', plannerView === 'list');
  plannerBoard.classList.toggle('table-view', plannerView === 'table');
  document.querySelectorAll('.planner-view-opt').forEach((b) => {
    const on = b.dataset.view === plannerView;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  if (plannerView === 'table') { renderPlannerTable(todayStr, weekEndStr); return; }

  PLANNER_SECTIONS.forEach(({ key, label }) => {
    const col = document.createElement('div');
    col.className = 'planner-col';
    col.dataset.section = key;
    const isDoneCol = key === 'done';
    const isCollapsed = isDoneCol && plannerDoneCollapsed;
    if (isCollapsed) col.classList.add('collapsed');

    const heading = document.createElement('div');
    heading.className = 'planner-col-heading';
    const sectionTasks = tasks.filter(t => getTaskSection(t, todayStr, weekEndStr) === key);
    if (isDoneCol) {
      heading.classList.add('toggleable');
      heading.title = isCollapsed ? 'Show completed tasks' : 'Collapse completed tasks';
      heading.textContent = `${isCollapsed ? '▸' : '▾'} ${label} (${sectionTasks.length})`;
      heading.addEventListener('click', () => { plannerDoneCollapsed = !plannerDoneCollapsed; renderPlanner(); });
    } else {
      heading.textContent = `${label} (${sectionTasks.length})`;
    }
    col.appendChild(heading);

    const body = document.createElement('div');
    body.className = 'planner-col-body';
    body.addEventListener('dragover', (e) => { e.preventDefault(); body.classList.add('drag-over'); });
    body.addEventListener('dragleave', (e) => { if (!body.contains(e.relatedTarget)) body.classList.remove('drag-over'); });
    body.addEventListener('drop', (e) => {
      e.preventDefault();
      body.classList.remove('drag-over');
      const id = parseInt(e.dataTransfer.getData('text/plain'));
      movePlannerTask(id, key);
    });
    body.addEventListener('contextmenu', (e) => {
      if (e.target.closest('.planner-card')) return;
      e.preventDefault();
      openPlannerContextMenu(e.clientX, e.clientY, key, body);
    });

    // A collapsed Done strip must still accept drops
    if (isCollapsed) {
      col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('drag-over'); });
      col.addEventListener('dragleave', (e) => { if (!col.contains(e.relatedTarget)) col.classList.remove('drag-over'); });
      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('drag-over');
        movePlannerTask(parseInt(e.dataTransfer.getData('text/plain')), key);
      });
    }

    sectionTasks.forEach(task => body.appendChild(buildPlannerCard(task)));
    col.appendChild(body);

    if (!isDoneCol) {
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'planner-col-add-btn';
      addBtn.textContent = '+ Add task';
      addBtn.addEventListener('click', () => startPlannerInlineAdd(key, body));
      col.appendChild(addBtn);
    }
    plannerBoard.appendChild(col);
  });
};

const closePlannerContextMenu = () => {
  const existing = document.getElementById('plannerCtxMenu');
  if (existing) existing.remove();
  document.removeEventListener('mousedown', onPlannerCtxOutside, true);
  document.removeEventListener('keydown', onPlannerCtxKey, true);
  window.removeEventListener('resize', closePlannerContextMenu);
  window.removeEventListener('scroll', closePlannerContextMenu, true);
};
function onPlannerCtxOutside(e) {
  const menu = document.getElementById('plannerCtxMenu');
  if (menu && !menu.contains(e.target)) closePlannerContextMenu();
}
function onPlannerCtxKey(e) {
  if (e.key === 'Escape') closePlannerContextMenu();
}

const openPlannerContextMenu = (x, y, sectionKey, bodyEl) => {
  closePlannerContextMenu();
  const menu = document.createElement('div');
  menu.id = 'plannerCtxMenu';
  menu.className = 'planner-ctx-menu';

  const addItem = document.createElement('button');
  addItem.type = 'button';
  addItem.className = 'planner-ctx-item';
  addItem.textContent = '➕ Add new task';
  addItem.addEventListener('click', () => {
    closePlannerContextMenu();
    openPlannerEditPanel({
      id: nextId++, text: '', active: false, urgent: false, deadline: null,
      subtasks: [], showSubInput: false, completed: sectionKey === 'done',
      plannedSection: sectionKey === 'done' ? null : sectionKey,
    }, { isNew: true });
  });
  menu.appendChild(addItem);

  menu.style.left = '0px';
  menu.style.top = '0px';
  document.body.appendChild(menu);
  const rect = menu.getBoundingClientRect();
  const px = Math.min(x, window.innerWidth - rect.width - 6);
  const py = Math.min(y, window.innerHeight - rect.height - 6);
  menu.style.left = `${Math.max(4, px)}px`;
  menu.style.top = `${Math.max(4, py)}px`;

  setTimeout(() => {
    document.addEventListener('mousedown', onPlannerCtxOutside, true);
    document.addEventListener('keydown', onPlannerCtxKey, true);
    window.addEventListener('resize', closePlannerContextMenu);
    window.addEventListener('scroll', closePlannerContextMenu, true);
  }, 0);
};

const startPlannerInlineAdd = (sectionKey, bodyEl) => {
  const existing = bodyEl.querySelector('.planner-inline-add');
  if (existing) { existing.querySelector('input')?.focus(); return; }

  const wrap = document.createElement('div');
  wrap.className = 'planner-inline-add';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'New task…';
  input.className = 'planner-inline-add-input';

  const commit = () => {
    const text = input.value.trim();
    if (!text) { wrap.remove(); return; }
    pushPlannerHistory();
    const newTask = {
      id: nextId++, text, active: false, urgent: false, deadline: null,
      subtasks: [], showSubInput: false, completed: sectionKey === 'done',
      plannedSection: sectionKey === 'done' ? null : sectionKey,
    };
    tasks.push(newTask);
    renderTasks({ updateCalendar: true });
    renderPlanner();
  };
  const cancel = () => wrap.remove();

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
    else if (e.key === 'Escape') { e.preventDefault(); cancel(); }
  });
  input.addEventListener('blur', () => {
    if (input.value.trim()) commit(); else cancel();
  });

  wrap.appendChild(input);
  bodyEl.insertBefore(wrap, bodyEl.firstChild);
  setTimeout(() => input.focus(), 0);
};

const renderTasks = ({ updateCalendar = false } = {}) => {
  taskList.innerHTML = '';

  const activeTasks = tasks.filter((t) => !t.completed);
  const sorted = [...activeTasks].sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0));
  sorted.forEach((task) => taskList.appendChild(buildTaskItem(task, false)));

  if (updateCalendar) renderCalendar();
  updateCompactTaskDisplay();
  saveState();
};

addTaskBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ id: nextId++, text, active: false, urgent: false, deadline: null, subtasks: [], showSubInput: false, completed: false, plannedSection: null });
  taskInput.value = '';
  renderTasks();
  renderCalendar();
});

taskInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTaskBtn.click(); });


// ── Activity log ───────────────────────────────────────────────────────────
const deleteLogEntry = (id) => {
  const entry = logEntries.find(e => e.id === id);
  if (!entry) return;
  focusedSecondsTotal = Math.max(0, focusedSecondsTotal - entry.seconds);
  updateFocusedTotal();
  if (entry.dateKey) {
    const mins = Math.round(entry.seconds / 60);
    if (dailyFocus[entry.dateKey]) {
      if (entry.slot !== null) {
        dailyFocus[entry.dateKey][entry.slot] = Math.max(0, (dailyFocus[entry.dateKey][entry.slot] || 0) - mins);
      } else {
        dailyFocus[entry.dateKey].x = Math.max(0, (dailyFocus[entry.dateKey].x || 0) - mins);
      }
    }
  }
  logEntries = logEntries.filter(e => e.id !== id);
  renderActivityLog();

  refreshCompactHeatmap();
  refreshStats();
  saveState();
};

const startLogEdit = (li, entry) => {
  li.innerHTML = '';
  li.className = 'log-item log-item-editing';
  const oldMins = Math.floor(entry.seconds / 60);
  const oldSecs = entry.seconds % 60;

  const label = document.createElement('span');
  label.className = 'log-edit-label';
  label.textContent = 'Duration:';

  const minsInput = document.createElement('input');
  minsInput.type = 'number'; minsInput.min = '0'; minsInput.max = '999'; minsInput.value = oldMins;
  minsInput.className = 'log-edit-input'; minsInput.placeholder = 'min';

  const mLabel = document.createElement('span');
  mLabel.className = 'log-edit-unit'; mLabel.textContent = 'm';

  const secsInput = document.createElement('input');
  secsInput.type = 'number'; secsInput.min = '0'; secsInput.max = '59'; secsInput.value = oldSecs;
  secsInput.className = 'log-edit-input log-edit-input-sm'; secsInput.placeholder = 'sec';

  const sLabel = document.createElement('span');
  sLabel.className = 'log-edit-unit'; sLabel.textContent = 's';

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button'; saveBtn.className = 'log-edit-save'; saveBtn.textContent = 'Save';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button'; cancelBtn.className = 'log-edit-cancel'; cancelBtn.textContent = 'Cancel';

  const commit = () => {
    const newMins = Math.max(0, parseInt(minsInput.value) || 0);
    const newSecs = Math.max(0, Math.min(59, parseInt(secsInput.value) || 0));
    const newSeconds = newMins * 60 + newSecs;
    const deltaSeconds = newSeconds - entry.seconds;
    focusedSecondsTotal = Math.max(0, focusedSecondsTotal + deltaSeconds);
    updateFocusedTotal();
    if (entry.dateKey) {
      const deltaMins = Math.round(deltaSeconds / 60);
      if (!dailyFocus[entry.dateKey]) dailyFocus[entry.dateKey] = {};
      if (entry.slot !== null) {
        dailyFocus[entry.dateKey][entry.slot] = Math.max(0, (dailyFocus[entry.dateKey][entry.slot] || 0) + deltaMins);
      } else {
        dailyFocus[entry.dateKey].x = Math.max(0, (dailyFocus[entry.dateKey].x || 0) + deltaMins);
      }
    }
    entry.seconds = newSeconds;
    renderActivityLog();
    refreshCompactHeatmap();
    refreshStats();
    saveState();
  };

  saveBtn.addEventListener('click', commit);
  cancelBtn.addEventListener('click', () => renderActivityLog());
  [minsInput, secsInput].forEach(inp => {
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') renderActivityLog(); });
  });

  li.append(label, minsInput, mLabel, secsInput, sLabel, saveBtn, cancelBtn);
  setTimeout(() => minsInput.focus(), 0);
};

const buildLogItem = (entry) => {
  const li = document.createElement('li');
  li.className = 'log-item';
  // Timer entries store their start; manual entries treat the entered time as the start;
  // older entries only have an end timestamp.
  const startMs = entry.intervalStartMs !== undefined ? entry.intervalStartMs
    : entry.manual ? entry.timestampMs
    : entry.timestampMs - entry.seconds * 1000;
  const fmt = (ms) => new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const timeStr = `${fmt(startMs)} – ${fmt(startMs + entry.seconds * 1000)}`;
  const mins = Math.floor(entry.seconds / 60);
  const secs = entry.seconds % 60;

  const textSpan = document.createElement('span');
  textSpan.className = 'log-item-text';
  textSpan.textContent = `${timeStr} (${Math.max(entry.seconds > 0 ? 1 : 0, Math.round(entry.seconds / 60))} min)`;

  const editBtn = document.createElement('button');
  editBtn.type = 'button'; editBtn.className = 'log-item-btn'; editBtn.title = 'Edit duration'; editBtn.textContent = '✏️';
  editBtn.addEventListener('click', () => startLogEdit(li, entry));

  const delBtn = document.createElement('button');
  delBtn.type = 'button'; delBtn.className = 'log-item-btn log-item-del'; delBtn.title = 'Delete entry'; delBtn.textContent = '✕';
  delBtn.addEventListener('click', () => {
    const existing = li.querySelector('.log-del-confirm');
    if (existing) { existing.remove(); return; }
    const row = document.createElement('div');
    row.className = 'log-del-confirm';
    const msg = document.createElement('span'); msg.textContent = 'Delete?';
    const okBtn = document.createElement('button'); okBtn.className = 'log-del-ok'; okBtn.textContent = 'Delete';
    const cnclBtn = document.createElement('button'); cnclBtn.className = 'log-del-cancel'; cnclBtn.textContent = 'Cancel';
    okBtn.addEventListener('click', (e) => { e.stopPropagation(); deleteLogEntry(entry.id); });
    cnclBtn.addEventListener('click', (e) => { e.stopPropagation(); row.remove(); });
    row.append(msg, cnclBtn, okBtn);
    li.appendChild(row);
    const dismiss = (ev) => {
      if (!row.contains(ev.target) && ev.target !== delBtn) { row.remove(); document.removeEventListener('pointerdown', dismiss); }
    };
    setTimeout(() => document.addEventListener('pointerdown', dismiss), 0);
  });

  if (entry.manual) {
    const badge = document.createElement('span');
    badge.className = 'log-manual-badge';
    badge.textContent = 'M';
    badge.title = 'Entered manually';
    textSpan.appendChild(badge);
  }

  li.append(textSpan, editBtn, delBtn);
  return li;
};

const renderActivityLog = () => {
  activityLog.innerHTML = '';
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 6); cutoff.setHours(0, 0, 0, 0);
  const visible = logEntries.filter(e => e.timestampMs >= cutoff.getTime());
  if (visible.length === 0) { emptyState.classList.remove('hidden'); return; }
  emptyState.classList.add('hidden');
  const todayKey = dateKey(new Date());
  const yesterdayKey = dateKey(new Date(Date.now() - 86400000));
  let lastDay = null;
  visible.forEach(entry => {
    if (entry.dateKey !== lastDay) {
      const sep = document.createElement('li');
      sep.className = 'log-day-sep';
      if (entry.dateKey === todayKey) sep.textContent = 'Today';
      else if (entry.dateKey === yesterdayKey) sep.textContent = 'Yesterday';
      else sep.textContent = new Date(entry.timestampMs).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
      activityLog.appendChild(sep);
      lastDay = entry.dateKey;
    }
    activityLog.appendChild(buildLogItem(entry));
  });
};


// ── Manual log entry form ──────────────────────────────────────────────────
addLogEntryBtn.addEventListener('click', () => {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  manualDateInput.max = todayStr;
  manualDateInput.value = todayStr;
  manualTimeInput.value = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  manualDurationInput.value = '';
  manualEntryForm.classList.toggle('hidden');
  if (!manualEntryForm.classList.contains('hidden')) setTimeout(() => manualDurationInput.focus(), 0);
});

manualCancelBtn.addEventListener('click', () => manualEntryForm.classList.add('hidden'));

manualAddBtn.addEventListener('click', () => {
  const dur = parseInt(manualDurationInput.value);
  if (!dur || dur < 1) { manualDurationInput.focus(); return; }
  const ts = new Date(`${manualDateInput.value}T${manualTimeInput.value}`).getTime();
  if (isNaN(ts)) return;
  if (manualDateInput.value > manualDateInput.max) { manualDateInput.focus(); return; }
  addLogEntry(dur * 60, { timestampMs: ts, manual: true });
  manualEntryForm.classList.add('hidden');
});

manualDurationInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') manualAddBtn.click();
  if (e.key === 'Escape') manualEntryForm.classList.add('hidden');
});


// ── Log & heatmap update ───────────────────────────────────────────────────
const addLogEntry = (secondsFocused, opts = {}) => {
  const ts = opts.timestampMs !== undefined ? opts.timestampMs : Date.now();
  const dt = new Date(ts);
  const key = dateKey(dt);
  const slot = slotKeyFromDate(dt);

  const entry = { id: nextId++, timestampMs: ts, seconds: secondsFocused, dateKey: key, slot, ...(opts.manual ? { manual: true } : {}), ...(opts.intervalStartMs !== undefined ? { intervalStartMs: opts.intervalStartMs } : {}) };
  logEntries.unshift(entry);

  focusedSecondsTotal += secondsFocused;
  updateFocusedTotal();

  if (!dailyFocus[key]) dailyFocus[key] = {};
  if (slot !== null) {
    dailyFocus[key][slot] = (dailyFocus[key][slot] || 0) + Math.round(secondsFocused / 60);
  } else {
    // Outside heatmap hours — track in overflow bucket so daily totals stay correct
    dailyFocus[key].x = (dailyFocus[key].x || 0) + Math.round(secondsFocused / 60);
  }

  renderActivityLog();

  refreshCompactHeatmap();
  refreshStats();
  saveState();
};

// Splits a contiguous focus interval at local-midnight boundaries so each day
// gets credited for the seconds actually spent focusing on that day.
const logInterval = (startMs, endMs) => {
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return;
  let cursor = startMs;
  while (cursor < endMs) {
    const d = new Date(cursor);
    const nextMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
    const chunkEnd = Math.min(nextMidnight, endMs);
    const chunkSeconds = Math.round((chunkEnd - cursor) / 1000);
    if (chunkSeconds > 0) {
      // chunkEnd - 1 keeps the timestamp on the correct calendar day when the chunk ends exactly at midnight.
      addLogEntry(chunkSeconds, { timestampMs: chunkEnd - 1, intervalStartMs: cursor });
    }
    cursor = chunkEnd;
  }
};


// ── Palette picker ─────────────────────────────────────────────────────────
const renderPalettePicker = () => {
  palettePicker.innerHTML = '';
  Object.keys(HEATMAP_PALETTES).forEach(name => {
    const p = HEATMAP_PALETTES[name];
    const swatch = document.createElement('button');
    swatch.type = 'button';
    swatch.className = `palette-swatch${name === currentPalette ? ' active' : ''}`;
    swatch.title = PALETTE_LABELS[name];
    swatch.style.background = `linear-gradient(135deg, ${p.l[0]}, ${p.l[1]} 40%, ${p.l[3]})`;
    const label = document.createElement('span');
    label.textContent = PALETTE_LABELS[name];
    swatch.appendChild(label);
    swatch.addEventListener('click', () => {
      applyHeatmapPalette(name);
      renderPalettePicker();
      refreshCompactHeatmap();
    });
    palettePicker.appendChild(swatch);
  });
};


// ── Right panel tab toggle ─────────────────────────────────────────────────
const logTabContent = document.getElementById('logTabContent');
const calendarTabContent = document.getElementById('calendarTabContent');
const tasksTabContent = document.getElementById('tasksTabContent');
const rightPanelTabContents = { tasks: tasksTabContent, log: logTabContent, calendar: calendarTabContent };

document.querySelectorAll('.log-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.log-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    Object.entries(rightPanelTabContents).forEach(([key, el]) => {
      el.classList.toggle('hidden', key !== tab.dataset.tab);
    });
    if (tab.dataset.tab === 'calendar') renderCalendar();
  });
});


// ── Calendar ───────────────────────────────────────────────────────────────
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();
const CAL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const buildDeadlineItem = (label, text) => {
  const item = document.createElement('div');
  item.className = 'cal-deadline-item';
  const dateEl = document.createElement('span');
  dateEl.className = 'cal-deadline-date';
  dateEl.textContent = label;
  const textEl = document.createElement('span');
  textEl.className = 'cal-deadline-text';
  textEl.textContent = text;
  item.append(dateEl, textEl);
  return item;
};

const showUpcomingDeadlines = (deadlineMap, todayStr) => {
  calDeadlineList.innerHTML = '';
  const sorted = Object.entries(deadlineMap)
    .filter(([d]) => d >= todayStr)
    .sort(([a], [b]) => a.localeCompare(b));
  if (sorted.length === 0) {
    const p = document.createElement('p');
    p.className = 'cal-no-deadlines';
    p.textContent = 'No upcoming deadlines.';
    calDeadlineList.appendChild(p);
    return;
  }
  sorted.forEach(([ds, names]) => {
    const label = new Date(ds + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    names.forEach(text => calDeadlineList.appendChild(buildDeadlineItem(label, text)));
  });
};

const renderCalendar = () => {
  if (!calGrid) return;
  calMonthLabel.textContent = `${CAL_MONTHS[calMonth]} ${calYear}`;

  const deadlineMap = {};
  tasks.filter(t => t.deadline && !t.completed).forEach(t => {
    if (!deadlineMap[t.deadline]) deadlineMap[t.deadline] = [];
    deadlineMap[t.deadline].push(t.text);
  });

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const startDow = new Date(calYear, calMonth, 1).getDay();
  const todayStr = dateKey(new Date());

  calGrid.innerHTML = '';
  for (let i = 0; i < startDow; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-cell cal-empty';
    calGrid.appendChild(empty);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = dateKey(new Date(calYear, calMonth, d));
    const isToday = ds === todayStr;
    const deadlines = deadlineMap[ds];
    const cell = document.createElement('div');
    cell.className = `cal-cell${isToday ? ' cal-today' : ''}${deadlines ? ' cal-has-deadline' : ''}`;
    const num = document.createElement('span');
    num.textContent = d;
    cell.appendChild(num);
    if (deadlines) {
      const dot = document.createElement('span');
      dot.className = 'cal-deadline-dot';
      cell.appendChild(dot);
      cell.addEventListener('click', () => {
        calDeadlineList.innerHTML = '';
        const label = new Date(ds + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        deadlines.forEach(text => calDeadlineList.appendChild(buildDeadlineItem(label, text)));
      });
    }
    calGrid.appendChild(cell);
  }
  showUpcomingDeadlines(deadlineMap, todayStr);
};

document.getElementById('calPrevBtn').addEventListener('click', () => {
  calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
});
document.getElementById('calNextBtn').addEventListener('click', () => {
  calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
});


// ── Timer logic ────────────────────────────────────────────────────────────
const clearRunningInterval = () => {
  if (isWorkMode && currentRunStartMs !== null) {
    // Cap at the scheduled end so a backgrounded tab doesn't over-credit past target.
    const endMs = Math.min(Date.now(), targetEndTimestampMs ?? Date.now());
    logInterval(currentRunStartMs, endMs);
  }
  currentRunStartMs = null;
  clearInterval(intervalId); intervalId = null; targetEndTimestampMs = null; lastPerfNow = null;
};

const onSessionFinished = () => {
  const finishedWork = isWorkMode;
  clearRunningInterval();
  isRunning = false;
  setPresetButtonsDisabled(false);
  isWorkMode = !isWorkMode;
  updateStopSkipBtn();
  resetCurrentMode();
  audioCtx.resume().then(() => playAlert(isWorkMode ? 1 : 2));
  notifySessionEnd(finishedWork);
  waitingForManualStart = true;
  startPauseBtnText.textContent = 'Start'; startPauseBtnIcon.textContent = '▶';
  statusMessage.textContent = isWorkMode
    ? 'Break finished. Press Start when ready for focus.'
    : 'Focus finished. Press Start when ready for break.';
};

const syncRemainingFromClock = () => {
  if (!isRunning || targetEndTimestampMs === null) return;
  const nowMs = Date.now();
  const remainingMs = Math.max(0, targetEndTimestampMs - nowMs);
  const nextSeconds = Math.ceil(remainingMs / 1000);
  if (nextSeconds !== remainingSeconds) { remainingSeconds = nextSeconds; updateDisplay(); }
  if (remainingMs <= 0) onSessionFinished();
};

const startAccurateTimer = () => {
  const nowDateMs = Date.now();
  const perfNow = performance.now();
  targetEndTimestampMs = nowDateMs + remainingSeconds * 1000;
  currentRunStartMs = nowDateMs;
  lastPerfNow = perfNow;
  intervalId = setInterval(() => {
    const perfDelta = performance.now() - lastPerfNow;
    lastPerfNow = performance.now();
    if (perfDelta > 1500) { syncRemainingFromClock(); return; }
    syncRemainingFromClock();
  }, 250);
};

const updateStopSkipBtn = () => {
  if (isWorkMode) {
    stopBtnText.textContent = 'Stop';
    stopBtnIcon.textContent = '⏹';
    stopBtn.classList.replace('secondary', 'danger');
  } else {
    stopBtnText.textContent = 'Skip';
    stopBtnIcon.textContent = '⏭';
    stopBtn.classList.replace('danger', 'secondary');
  }
};

const stopTimer = ({ keepMode = true } = {}) => {
  clearRunningInterval();
  isRunning = false;
  waitingForManualStart = false;
  startPauseBtnText.textContent = 'Start'; startPauseBtnIcon.textContent = '▶';
  setPresetButtonsDisabled(false);
  statusMessage.textContent = '';
  if (!keepMode) isWorkMode = true;
  resetCurrentMode();
  updateStopSkipBtn();
  updateWindowTitle();
};

const setPresetState = (activeButton = null) => presets.forEach((preset) => {
  const isActive = preset === activeButton;
  preset.classList.toggle('active', isActive);
  preset.setAttribute('aria-pressed', isActive ? 'true' : 'false');
});

const setPresetButtonsDisabled = (isDisabled) => {
  [...presets, customPresetChip].forEach((button) => { button.disabled = isDisabled; });
};


// ── Controls ───────────────────────────────────────────────────────────────
startPauseBtn.addEventListener('click', async () => {
  if (audioCtx.state === 'suspended') await audioCtx.resume();
  if (!isRunning) {
    isRunning = true; waitingForManualStart = false;
    statusMessage.textContent = '';
    startPauseBtnText.textContent = 'Pause'; startPauseBtnIcon.textContent = '⏸';
    setPresetButtonsDisabled(true);
    startAccurateTimer();
    updateWindowTitle();
    if (notificationsEnabled && !window.electronAPI && 'Notification' in window && Notification.permission === 'default') {
      try { Notification.requestPermission(); } catch (_) {}
    }
    return;
  }
  syncRemainingFromClock();
  clearRunningInterval();
  isRunning = false;
  startPauseBtnText.textContent = 'Start'; startPauseBtnIcon.textContent = '▶';
  setPresetButtonsDisabled(false);
  updateWindowTitle();
});

stopBtn.addEventListener('click', () => {
  // Interval logging happens inside clearRunningInterval (called by stopTimer),
  // which splits at midnight boundaries and credits each day correctly.
  if (isWorkMode && isRunning) syncRemainingFromClock();
  stopTimer({ keepMode: false });
});

customPresetChip.addEventListener('click', () => { customTimeModal.classList.remove('hidden'); });
closeCustomTimeBtn.addEventListener('click', () => { customTimeModal.classList.add('hidden'); });

applyCustomBtn.addEventListener('click', () => {
  const customWork = Number(customWorkInput.value); const customBreak = Number(customBreakInput.value);
  if (!Number.isFinite(customWork) || !Number.isFinite(customBreak) || customWork < 1 || customBreak < 1 || customWork > MAX_CUSTOM_MINUTES || customBreak > MAX_CUSTOM_MINUTES) { alert('Please enter valid focus and break durations (1 to ' + MAX_CUSTOM_MINUTES + ' minutes).'); return; }
  workMinutes = customWork; breakMinutes = customBreak; isWorkMode = true;
  setPresetState(null); customPresetChip.classList.add('active');
  customTimeModal.classList.add('hidden'); stopTimer({ keepMode: true });
  saveSettings();
});

presets.forEach((button) => button.addEventListener('click', () => {
  if (button === customPresetChip) return;
  setPresetState(button); customPresetChip.classList.remove('active');
  workMinutes = Number(button.dataset.work); breakMinutes = Number(button.dataset.break);
  isWorkMode = true; stopTimer({ keepMode: true });
  saveSettings();
}));


// Press-and-drag on the clock to set the focus length continuously (only while idle).
// Drag up = longer, drag down = shorter, snapping to DRAG_STEP_MIN-minute steps.
// Break length follows at ~1/5 of focus time (matches the built-in presets).
const DRAG_PX_PER_MIN = 3;
const DRAG_STEP_MIN = 5;
const DRAG_MIN_WORK = 5;
const getDragMaxWork = () => Number(customWorkInput.max) || 1439;
let clockDrag = null;
let suppressClockClick = false;

timerArea.addEventListener('pointerdown', (e) => {
  if (e.button !== 0 || isRunning) return;
  clockDrag = { id: e.pointerId, startY: e.clientY, startWork: workMinutes, last: workMinutes, moved: false };
});

timerArea.addEventListener('pointermove', (e) => {
  if (!clockDrag || e.pointerId !== clockDrag.id) return;
  if (isRunning) { clockDrag = null; return; }
  const dy = clockDrag.startY - e.clientY;
  if (!clockDrag.moved) {
    if (Math.abs(dy) < 6) return;
    clockDrag.moved = true;
    timerArea.setPointerCapture(e.pointerId);
    timerArea.classList.add('dragging');
  }
  // Linear at first, accelerating so the Custom dialog's max is reachable within the screen height.
  const mins = dy / DRAG_PX_PER_MIN;
  const raw = clockDrag.startWork + mins + Math.sign(mins) * mins * mins / 60;
  const work = Math.max(DRAG_MIN_WORK, Math.min(getDragMaxWork(), Math.round(raw / DRAG_STEP_MIN) * DRAG_STEP_MIN));
  if (work === clockDrag.last) return;
  clockDrag.last = work;
  workMinutes = work; breakMinutes = Math.max(1, Math.round(work / 5));
  isWorkMode = true;
  setPresetState(null); customPresetChip.classList.remove('active');
  const match = [...presets].find((p) => p !== customPresetChip && Number(p.dataset.work) === work && Number(p.dataset.break) === breakMinutes);
  if (match) setPresetState(match); else customPresetChip.classList.add('active');
  stopTimer({ keepMode: true });
});

const endClockDrag = (e) => {
  if (!clockDrag || e.pointerId !== clockDrag.id) return;
  if (clockDrag.moved) {
    suppressClockClick = true;
    setTimeout(() => { suppressClockClick = false; }, 0);
    saveSettings();
  }
  timerArea.classList.remove('dragging');
  clockDrag = null;
};
timerArea.addEventListener('pointerup', endClockDrag);
timerArea.addEventListener('pointercancel', endClockDrag);

timerArea.addEventListener('click', () => {
  if (suppressClockClick) return;
  timerArea.classList.toggle('analog');
  if (timerArea.classList.contains('analog')) drawAnalogClock();
});
timerArea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); timerArea.click(); }
});

themeToggleBtn.addEventListener('click', () => {
  const darkActive = document.body.classList.toggle('dark');
  themeToggleImg.src = darkActive ? 'assets/icons/Light mode.png' : 'assets/icons/Dark mode.png';
  _clockColors = null;
  applyUiTheme(currentUiTheme);
  saveSettings();
});

// ── Sidebar toggles ────────────────────────────────────────────────────────

summaryRailBtn.addEventListener('click', () => {
  const willOpen = !summarySidebar.classList.contains('open');
  setSidebarState(summarySidebar, willOpen);
  setSidebarState(plannerOverlay, false);
  syncRailVisibility();
  if (willOpen) refreshCompactHeatmap();
});

logRailBtn.addEventListener('click', () => {
  const willOpen = !logPanel.classList.contains('open');
  logPanel.classList.toggle('open', willOpen);
  syncRightRailVisibility();
});

document.getElementById('plannerViewSwitch')?.addEventListener('click', (e) => {
  const opt = e.target.closest('.planner-view-opt');
  if (!opt) return;
  plannerView = opt.dataset.view;
  try { localStorage.setItem('plannerView', plannerView); } catch {}
  renderPlanner();
});

completedTasksBtn.addEventListener('click', () => {
  renderPlanner();
  resetDraggable(plannerOverlay.querySelector('.planner-shell'));
  setSidebarState(plannerOverlay, true);
});

closePlannerBtn.addEventListener('click', () => {
  setSidebarState(plannerOverlay, false);
});

document.addEventListener('keydown', (e) => {
  if (!plannerOverlay.classList.contains('open')) return;
  if (document.getElementById('plannerEditScrim')) return; // edit panel has its own undo
  const isUndo = (e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z';
  const isRedo = (e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'));
  if (!isUndo && !isRedo) return;
  e.preventDefault();
  if (isUndo && plannerUndoStack.length) {
    plannerRedoStack.push(snapshotPlannerState());
    applyPlannerSnapshot(plannerUndoStack.pop());
  } else if (isRedo && plannerRedoStack.length) {
    plannerUndoStack.push(snapshotPlannerState());
    applyPlannerSnapshot(plannerRedoStack.pop());
  }
});

previewSoundBtn.addEventListener('click', async () => { if (audioCtx.state === 'suspended') await audioCtx.resume(); playAlert(1); });

document.addEventListener('pointerdown', (event) => {
  const target = event.target;
  const insideSummary = target.closest('#summarySidebar');
  const insideRail = target.closest('.side-rail');
  const insideLogPanel = target.closest('.log-panel');
  const insideRightRail = target.closest('.right-rail');
  const insidePlanner = target.closest('#plannerOverlay .planner-shell');
  if (!insideSummary && !insideRail) {
    if (!isSummaryPinned()) setSidebarState(summarySidebar, false);
    syncRailVisibility();
  }
  if (!insidePlanner && !target.closest('#completedTasksBtn') && !target.closest('#plannerEditPanel') && !target.closest('#plannerEditScrim') && !target.closest('#plannerCtxMenu')) {
    setSidebarState(plannerOverlay, false);
  }
  if (!insideLogPanel && !insideRightRail && !isLogPinned()) {
    logPanel.classList.remove('open');
    syncRightRailVisibility();
  }
});

window.addEventListener('resize', () => {
  syncRailVisibility();
  syncRightRailVisibility();
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'z' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
    e.preventDefault();
    undoLastDeletion();
  }
});

// ── Keyboard shortcuts: Space = start/pause, S = skip/stop ───
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
  const key = e.key.toLowerCase();
  if (key !== ' ' && key !== 's') return;
  const active = document.activeElement;
  if (active && (active.isContentEditable || active.closest?.('#timerArea') ||
      ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(active.tagName))) return;
  // Leave modals, the planner overlay and the settings dialog alone
  if (document.querySelector('.modal:not(.hidden), #plannerEditScrim') || plannerOverlay.classList.contains('open')) return;
  e.preventDefault();
  if (key === ' ') startPauseBtn.click();
  else stopBtn.click();
});

// ── Shortcut help: tooltips, Settings list and the ? popup ─────────────────
[
  [startPauseBtn, 'Start / pause', 'Space'],
  [stopBtn, 'Stop / skip', 'S'],
  [settingsBtn, 'Settings', 'Ctrl+S'],
  [themeToggleBtn, 'Toggle dark mode', 'Ctrl+D'],
  [compactModeBtn, 'Compact mode', 'Ctrl+Space'],
  [completedTasksBtn, 'Task Planner', 'Ctrl+P'],
  [document.querySelector('.log-tab[data-tab="calendar"]'), 'Calendar', 'Ctrl+C'],
  [document.querySelector('.log-tab[data-tab="log"]'), 'Activity Log', 'Ctrl+A'],
].forEach(([el, label, keys]) => { if (el) el.title = withKey(label, keys); });

const shortcutsModal = document.getElementById('shortcutsModal');
document.querySelectorAll('.shortcut-list').forEach((list) => {
  SHORTCUTS.forEach(({ keys, label }) => {
    const dt = document.createElement('dt'); dt.textContent = keys;
    const dd = document.createElement('dd'); dd.textContent = label;
    list.append(dt, dd);
  });
});
const closeShortcuts = () => shortcutsModal.classList.add('hidden');
document.getElementById('closeShortcutsBtn').addEventListener('click', closeShortcuts);
shortcutsModal.addEventListener('pointerdown', (e) => { if (e.target === shortcutsModal) closeShortcuts(); });
document.getElementById('shortcutsHelpBtn').addEventListener('click', () => shortcutsModal.classList.remove('hidden'));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !shortcutsModal.classList.contains('hidden')) { closeShortcuts(); return; }
  if (e.key !== '?' || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
  if (!shortcutsModal.classList.contains('hidden')) { e.preventDefault(); closeShortcuts(); return; }
  const active = document.activeElement;
  if (active && (active.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName))) return;
  if (document.querySelector('.modal:not(.hidden), #plannerEditScrim')) return;
  e.preventDefault();
  shortcutsModal.classList.remove('hidden');
});

// ── Ctrl shortcuts: D theme, S settings, L panels, T new task, P planner, C calendar, A activity log ──
const showRightPanelTab = (tabName) => {
  document.querySelector(`.log-tab[data-tab="${tabName}"]`).click();
  logPanel.classList.add('open');
  syncRightRailVisibility();
};

document.addEventListener('keydown', (e) => {
  if (!e.ctrlKey || e.shiftKey || e.altKey || e.metaKey || e.repeat) return;
  const key = e.key.toLowerCase();
  if (!'dslptca '.includes(key) || key.length !== 1) return;

  if (key === 'c' || key === 'a') {
    // Keep native copy / select-all when editing text or when text is selected
    const active = document.activeElement;
    if (active && (active.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName))) return;
    if (window.getSelection().toString()) return;
  }

  e.preventDefault();
  switch (key) {
    case 'd': themeToggleBtn.click(); break;
    case 's':
      if (settingsModal.classList.contains('hidden')) settingsBtn.click();
      else closeSettingsBtn.click();
      break;
    case 'l': panelVisibilityToggle.click(); break;
    case 't':
      if (document.getElementById('plannerEditScrim')) break;
      closePlannerContextMenu();
      openPlannerEditPanel({
        id: nextId++, text: '', active: false, urgent: false, deadline: null,
        subtasks: [], showSubInput: false, completed: false, plannedSection: null,
      }, { isNew: true });
      break;
    case 'p':
      if (plannerOverlay.classList.contains('open')) closePlannerBtn.click();
      else completedTasksBtn.click();
      break;
    case 'c': showRightPanelTab('calendar'); break;
    case 'a': showRightPanelTab('log'); break;
    case ' ': compactModeBtn.click(); break;
  }
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) syncRemainingFromClock();
});

// ── Mute toggle ────────────────────────────────────────────────────────────
let lastSoundMode = 'chime';
let soundDisabledBySetting = false;
let muteTooltipTimer;
const syncMuteBtn = () => {
  if (soundDisabledBySetting) {
    muteSoundBtnImg.src = 'assets/icons/Mute_button.png';
    muteSoundBtn.classList.add('mute-sound-disabled');
    muteSoundBtn.title = '';
    muteSoundBtn.setAttribute('aria-label', 'Sound is off — choose an alert sound in Settings');
    muteSoundBtn.setAttribute('aria-disabled', 'true');
  } else {
    const muted = soundSelect.value === 'off';
    muteSoundBtnImg.src = muted ? 'assets/icons/Unmute_button.png' : 'assets/icons/Mute_button.png';
    muteSoundBtn.classList.remove('mute-sound-disabled');
    muteSoundBtn.title = muted ? 'Unmute sound' : 'Mute sound';
    muteSoundBtn.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound');
    muteSoundBtn.removeAttribute('aria-disabled');
  }
};
muteSoundBtn.addEventListener('click', () => {
  if (soundDisabledBySetting) {
    const rect = muteSoundBtn.getBoundingClientRect();
    ghTooltip.textContent = 'Sound is off — choose an alert sound in Settings';
    ghTooltip.style.left = `${rect.left}px`;
    ghTooltip.style.top = `${rect.bottom + 8}px`;
    ghTooltip.style.display = 'block';
    clearTimeout(muteTooltipTimer);
    muteTooltipTimer = setTimeout(() => { ghTooltip.style.display = 'none'; }, 2500);
    return;
  }
  if (soundSelect.value === 'off') {
    soundSelect.value = lastSoundMode;
  } else {
    lastSoundMode = soundSelect.value;
    soundSelect.value = 'off';
  }
  syncMuteBtn();
  saveSettings();
});
soundSelect.addEventListener('change', () => {
  soundDisabledBySetting = soundSelect.value === 'off';
  if (soundSelect.value !== 'off') lastSoundMode = soundSelect.value;
  syncMuteBtn();
  saveSettings();
});

// ── Settings ───────────────────────────────────────────────────────────────
const applySettings = () => {
  const opacity = Number(bgOpacity.value) / 100;
  const panelAlpha = Number(columnOpacity.value) / 100;
  document.body.style.setProperty('--custom-bg-opacity', opacity.toString());
  document.body.style.setProperty('--panel-alpha', (panelAlpha * 0.75).toString());
  if (bgImageData) document.body.style.setProperty('--custom-bg-image', `url(${bgImageData})`);
};

// ── Draggable panels ───────────────────────────────────────────────────────
const makeDraggable = (panel, handle) => {
  handle.style.cursor = 'grab';
  handle.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, input, select, textarea, a')) return;
    e.preventDefault();
    if (!panel.style.left) {
      const rect = panel.getBoundingClientRect();
      panel.style.position = 'absolute';
      panel.style.left = rect.left + 'px';
      panel.style.top  = rect.top  + 'px';
      panel.style.margin = '0';
    }
    const startX = e.clientX - parseFloat(panel.style.left);
    const startY = e.clientY - parseFloat(panel.style.top);
    handle.style.cursor = 'grabbing';
    const onMove = (ev) => {
      panel.style.left = Math.max(0, Math.min(window.innerWidth  - panel.offsetWidth,  ev.clientX - startX)) + 'px';
      panel.style.top  = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, ev.clientY - startY)) + 'px';
    };
    const onUp = () => {
      handle.style.cursor = 'grab';
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup',   onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup',   onUp);
  });
};
const resetDraggable = (panel) => { panel.style.position = ''; panel.style.left = ''; panel.style.top = ''; panel.style.margin = ''; };

// Settings modal
const settingsContent = settingsModal.querySelector('.modal-content');
makeDraggable(settingsContent, document.getElementById('settingsModalHeader'));
settingsBtn.addEventListener('click', () => { resetDraggable(settingsContent); settingsModal.classList.remove('hidden'); });
doneSettingsBtn.addEventListener('click', () => { settingsModal.classList.add('hidden'); saveSettings(); });
closeSettingsBtn.addEventListener('click', () => { settingsModal.classList.add('hidden'); saveSettings(); });
settingsModal.addEventListener('pointerdown', (e) => { if (e.target === settingsModal) settingsModal.classList.add('hidden'); });

bgOpacity.addEventListener('input', () => { opacityLabel.textContent = `${bgOpacity.value}%`; applySettings(); });
columnOpacity.addEventListener('input', () => { columnOpacityLabel.textContent = `${columnOpacity.value}%`; applySettings(); });

fullscreenBtn.addEventListener('click', async () => {
  if (window.electronAPI) {
    await window.electronAPI.toggleFullScreen();
  } else if (document.fullscreenElement) {
    await document.exitFullscreen();
  } else {
    await document.documentElement.requestFullscreen();
  }
});

document.addEventListener('fullscreenchange', () => {
  fullscreenBtn.setAttribute('aria-pressed', String(!!document.fullscreenElement));
});

if (window.electronAPI?.onFullScreenChange) {
  window.electronAPI.onFullScreenChange(isFS => {
    document.body.classList.toggle('fullscreen', isFS);
    fullscreenBtn.setAttribute('aria-pressed', String(isFS));
  });
}

exportDataBtn.addEventListener('click', exportBackup);
const SHARE_URL = 'https://github.com/sfabdkia-dev/Pomoro';
const shareAppBtn = document.getElementById('shareAppBtn');
shareAppBtn.addEventListener('click', async () => {
  let ok = false;
  try {
    await navigator.clipboard.writeText(SHARE_URL);
    ok = true;
  } catch {
    ok = false;
  }
  const original = { text: '🔗', title: 'Copy a link to share this app' };
  shareAppBtn.textContent = ok ? '✓' : '✗';
  shareAppBtn.title = ok ? 'Link copied!' : `Copy failed — ${SHARE_URL}`;
  setTimeout(() => {
    shareAppBtn.textContent = original.text;
    shareAppBtn.title = original.title;
  }, 1800);
});
document.querySelectorAll('[data-kofi]').forEach((link) => {
  link.addEventListener('click', (e) => {
    if (!window.electronAPI?.openExternal) return; // browser: let the link open normally
    e.preventDefault();
    window.electronAPI.openExternal(link.href);
  });
});

clearAllDataBtn.addEventListener('click', () => {
  settingsModal.classList.add('hidden');
  clearDataModal.classList.remove('hidden');
});
const _closeClearDataModal = () => {
  clearDataModal.classList.add('hidden');
  settingsModal.classList.remove('hidden');
};
closeClearDataBtn.addEventListener('click', _closeClearDataModal);
cancelClearDataBtn.addEventListener('click', _closeClearDataModal);
confirmClearDataBtn.addEventListener('click', () => {
  BACKUP_KEYS.forEach(key => localStorage.removeItem(key));
  clearTelemetryId(); // the consent choice is kept; the ID and send history are not
  location.reload();
});
const _showImportError = (msg) => {
  importErrorMsg.textContent = msg;
  importErrorMsg.classList.remove('hidden');
};
importDataBtn.addEventListener('click', () => {
  importErrorMsg.classList.add('hidden');
  importDataInput.click();
});
importDataInput.addEventListener('change', () => {
  const file = importDataInput.files[0];
  if (!file) return;
  importDataInput.value = '';
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!parsed || typeof parsed !== 'object' || !parsed.pomodoroState) {
        _showImportError('Import failed: this file is not a compatible backup.');
        return;
      }
      _pendingImportData = parsed;
      importErrorMsg.classList.add('hidden');
      importOptionsModal.classList.remove('hidden');
    } catch (_) {
      _showImportError('Import failed: the file could not be read. Make sure it is a valid JSON backup.');
    }
  };
  reader.onerror = () => _showImportError('Import failed: the file could not be read.');
  reader.readAsText(file);
});

const _closeImportModal = () => {
  _pendingImportData = null;
  importOptionsModal.classList.add('hidden');
};
closeImportOptionsBtn.addEventListener('click', _closeImportModal);
cancelImportBtn.addEventListener('click', _closeImportModal);
importOptionsModal.addEventListener('pointerdown', e => { if (e.target === importOptionsModal) _closeImportModal(); });

confirmImportBtn.addEventListener('click', () => {
  if (!_pendingImportData) return;

  const historyMode = document.querySelector('input[name="historyMode"]:checked').value;
  const tasksMode   = document.querySelector('input[name="tasksMode"]:checked').value;

  let imp = null;
  if (typeof _pendingImportData.pomodoroState === 'string') {
    try { imp = JSON.parse(_pendingImportData.pomodoroState); } catch (_) {}
  }

  if (imp) {
    // ── Focus History ──
    if (historyMode === 'skip') {
      const impDF = imp.dailyFocus || {};
      const newDays = Object.keys(impDF).filter(d => !dailyFocus[d]);
      newDays.forEach(d => { dailyFocus[d] = impDF[d]; });
      const newLogs = (imp.logEntries || []).filter(e => newDays.includes(e.dateKey));
      logEntries = [...logEntries, ...newLogs].sort((a, b) => b.timestampMs - a.timestampMs);
      focusedSecondsTotal += newLogs.reduce((s, e) => s + (e.seconds || 0), 0);
    } else if (historyMode === 'replace') {
      Object.keys(dailyFocus).forEach(k => delete dailyFocus[k]);
      Object.assign(dailyFocus, imp.dailyFocus || {});
      logEntries = imp.logEntries || [];
      if (typeof imp.focusedSecondsTotal === 'number') focusedSecondsTotal = imp.focusedSecondsTotal;
    }

    // ── Tasks ──
    if (tasksMode === 'add') {
      const offset = nextId;
      const added = (imp.tasks || []).map(t => ({
        completed: false, repeat: null, ...t, showSubInput: false,
        id: t.id + offset,
        ...(t.spawnedId ? { spawnedId: t.spawnedId + offset } : {}),
        subtasks: (t.subtasks || []).map(s => ({ ...s, id: s.id + offset })),
      }));
      tasks = [...tasks, ...added];
      nextId = offset + (imp.nextId || 0);
    } else if (tasksMode === 'replace') {
      tasks = (imp.tasks || []).map(t => ({ completed: false, repeat: null, ...t, showSubInput: false }));
      if (typeof imp.nextId === 'number') nextId = imp.nextId;
    }

    nextId = Math.max(nextId, 1);
    saveState();
  }

  // Always apply non-selective keys (settings, palette, background image)
  [SETTINGS_KEY, 'heatmapPalette', 'bgImageData'].forEach(key => {
    if (typeof _pendingImportData[key] === 'string') localStorage.setItem(key, _pendingImportData[key]);
  });

  _closeImportModal();
  location.reload();
});


if (alwaysOnTopToggle) {
  if (!window.electronAPI) {
    alwaysOnTopRow.hidden = true;
    if (windowSettingsHeading) windowSettingsHeading.hidden = true;
  }
  alwaysOnTopToggle.addEventListener('change', () => {
    isAlwaysOnTop = alwaysOnTopToggle.checked;
    if (window.electronAPI) window.electronAPI.setAlwaysOnTop(isCompactMode && isAlwaysOnTop);
    saveSettings();
  });
}

const notificationsToggle = document.getElementById('notificationsToggle');
if (notificationsToggle) {
  notificationsToggle.addEventListener('change', () => {
    notificationsEnabled = notificationsToggle.checked;
    saveSettings();
  });
}

const deadlineRemindersToggle = document.getElementById('deadlineRemindersToggle');
if (deadlineRemindersToggle) {
  deadlineRemindersToggle.addEventListener('change', () => {
    deadlineRemindersEnabled = deadlineRemindersToggle.checked;
    saveSettings();
    if (deadlineRemindersEnabled) checkDeadlineReminders({ startup: true });
  });
}

// ── Deadline reminders ─────────────────────────────────────────────────────
// Deadlines are dates without a time of day: remind on app start, then (if left
// open) once the clock passes REMINDER_HOUR. localStorage 'deadlineRemindersSent'
// maps taskId -> "<today>:<type>" so each reminder fires at most once per day.
const REMINDERS_SENT_KEY = 'deadlineRemindersSent';
const REMINDER_HOUR = 9;
const REMINDER_TYPES = [
  { type: 'overdue',  single: (t) => `Overdue: ${t}`,      many: (n) => `${n} tasks overdue` },
  { type: 'today',    single: (t) => `Due today: ${t}`,    many: (n) => `${n} tasks due today` },
  { type: 'tomorrow', single: (t) => `Due tomorrow: ${t}`, many: (n) => `${n} tasks due tomorrow` },
];

const checkDeadlineReminders = ({ startup = false } = {}) => {
  if (!deadlineRemindersEnabled) return;
  const now = new Date();
  if (!startup && now.getHours() < REMINDER_HOUR) return;
  const todayKey = dateKey(now);
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const tomorrowKey = dateKey(tomorrow);

  let sent = {};
  try { sent = JSON.parse(localStorage.getItem(REMINDERS_SENT_KEY)) || {}; } catch (_) {}
  // Drop entries for deleted tasks or earlier days
  Object.keys(sent).forEach((id) => {
    if (!tasks.some(t => String(t.id) === id) || !String(sent[id]).startsWith(todayKey)) delete sent[id];
  });

  const groups = { overdue: [], today: [], tomorrow: [] };
  tasks.forEach((t) => {
    if (t.completed || !t.deadline) return;
    const type = t.deadline < todayKey ? 'overdue' : t.deadline === todayKey ? 'today' : t.deadline === tomorrowKey ? 'tomorrow' : null;
    if (!type || sent[t.id] === `${todayKey}:${type}`) return;
    groups[type].push(t);
  });

  REMINDER_TYPES.forEach(({ type, single, many }) => {
    const list = groups[type];
    if (!list.length) return;
    const title = list.length === 1 ? single(list[0].text) : many(list.length);
    const body = list.length === 1 ? 'Task deadline reminder' : list.map(t => t.text).join(', ');
    sendNotification(title, body);
    list.forEach((t) => { sent[t.id] = `${todayKey}:${type}`; });
  });

  try { localStorage.setItem(REMINDERS_SENT_KEY, JSON.stringify(sent)); } catch (_) {}
};

// Start with Windows: the OS login-item is the source of truth, so it isn't stored in settings.
const launchAtLoginRow = document.getElementById('launchAtLoginRow');
const launchAtLoginToggle = document.getElementById('launchAtLoginToggle');
if (launchAtLoginToggle && window.electronAPI && window.electronAPI.getLaunchAtLogin) {
  window.electronAPI.getLaunchAtLogin().then(({ supported, enabled }) => {
    if (!supported) return;
    launchAtLoginToggle.checked = enabled;
    launchAtLoginRow.hidden = false;
  });
  launchAtLoginToggle.addEventListener('change', async () => {
    launchAtLoginToggle.checked = await window.electronAPI.setLaunchAtLogin(launchAtLoginToggle.checked);
  });
}

// App updates (Electron installed build only). The button cycles: check → download → restart.
const updateRow = document.getElementById('updateRow');
const updateBtn = document.getElementById('updateBtn');
const updateStatus = document.getElementById('updateStatus');
if (updateBtn && window.electronAPI?.updateSupported) {
  let updateStage = 'check'; // 'check' | 'download' | 'install' | 'busy'
  const setUpdateUi = (stage, label, status) => {
    updateStage = stage;
    updateBtn.textContent = label;
    updateBtn.disabled = stage === 'busy';
    updateStatus.textContent = status || '';
  };
  window.electronAPI.updateSupported().then((supported) => {
    if (supported) updateRow.hidden = false;
  });
  window.electronAPI.onUpdateStatus((s) => {
    if (s.state === 'checking') setUpdateUi('busy', '🔄 Checking…', '');
    else if (s.state === 'none') setUpdateUi('check', '🔄 Check for updates', "You're on the latest version.");
    else if (s.state === 'available') setUpdateUi('download', `⬇️ Download v${s.version}`, `Version ${s.version} is available.`);
    else if (s.state === 'downloading') setUpdateUi('busy', '⬇️ Downloading…', `${s.percent}%`);
    else if (s.state === 'downloaded') setUpdateUi('install', '🚀 Restart to update', `Version ${s.version} is ready.`);
    else if (s.state === 'error') setUpdateUi('check', '🔄 Check for updates', `Update failed: ${s.message}`);
  });
  updateBtn.addEventListener('click', async () => {
    if (updateStage === 'check') {
      const res = await window.electronAPI.checkForUpdate();
      if (!res.ok) setUpdateUi('check', '🔄 Check for updates', res.error);
    } else if (updateStage === 'download') {
      setUpdateUi('busy', '⬇️ Downloading…', '0%');
      window.electronAPI.downloadUpdate();
    } else if (updateStage === 'install') {
      window.electronAPI.installUpdate();
    }
  });
}

const testNotificationBtn = document.getElementById('testNotificationBtn');
const testNotificationStatus = document.getElementById('testNotificationStatus');
if (testNotificationBtn) {
  testNotificationBtn.addEventListener('click', async () => {
    testNotificationStatus.textContent = 'Sending…';
    const res = await sendNotification('Test notification', 'If you can read this, notifications work.');
    testNotificationStatus.textContent = !res.ok
      ? `Failed: ${res.error}`
      : res.unconfirmed
        ? 'Sent, but Windows did not confirm. Check Focus Assist / Do Not Disturb and Settings > System > Notifications.'
        : 'Sent.';
  });
}

// ── Anonymous research telemetry (Electron only) ───────────────────────────
// One coarse `daily_summary` per finished day, sent from the main process to PostHog EU.
// Consent lives in its own localStorage keys (not BACKUP_KEYS) so backups/imports never clone
// an ID or flip someone's choice. EU/EEA/UK/CH (or unknown) regions are opt-in; elsewhere it is
// on by default behind a first-run notice. Opting out deletes the ID.
const TELEMETRY_KEY = 'telemetryState'; // { enabled: bool|null, noticeShown, lastSent: 'YYYY-MM-DD' }
const TELEMETRY_ID_KEY = 'telemetryId';
const TELEMETRY_RETRY_MS = 30 * 60 * 1000;
const telemetryApi = window.electronAPI?.getTelemetryInfo ? window.electronAPI : null;
let telemetryInfo = null; // { strict, privacyUrl, platform, version }
let telemetrySending = false;
let telemetryRetryAt = 0;

const privacySettings = document.getElementById('privacySettings');
const telemetryToggle = document.getElementById('telemetryToggle');
const telemetryViewBtn = document.getElementById('telemetryViewBtn');
const telemetryPreview = document.getElementById('telemetryPreview');
const telemetryIdLine = document.getElementById('telemetryIdLine');
const telemetryModal = document.getElementById('telemetryModal');

const readTelemetryState = () => {
  try {
    const s = JSON.parse(localStorage.getItem(TELEMETRY_KEY));
    if (s && typeof s === 'object') {
      return {
        enabled: typeof s.enabled === 'boolean' ? s.enabled : null,
        noticeShown: !!s.noticeShown,
        lastSent: typeof s.lastSent === 'string' ? s.lastSent : '',
      };
    }
  } catch (_) {}
  return { enabled: null, noticeShown: false, lastSent: '' };
};
const writeTelemetryState = (s) => {
  try { localStorage.setItem(TELEMETRY_KEY, JSON.stringify(s)); } catch (_) {}
};

const TELEMETRY_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const getTelemetryId = () => {
  let id = null;
  try { id = localStorage.getItem(TELEMETRY_ID_KEY); } catch (_) {}
  if (!id || !TELEMETRY_UUID_RE.test(id)) {
    id = crypto.randomUUID();
    try { localStorage.setItem(TELEMETRY_ID_KEY, id); } catch (_) {}
  }
  return id;
};
// Only called when sharing is turned off or all data is cleared. Forgetting the ID also forgets what was sent under it.
const clearTelemetryId = () => {
  try { localStorage.removeItem(TELEMETRY_ID_KEY); } catch (_) {}
  writeTelemetryState({ ...readTelemetryState(), lastSent: '' });
};

const bucketCount = (n) => (n === 0 ? '0' : n <= 5 ? '1-5' : n <= 20 ? '6-20' : '21+');

const previousDateKey = () => {
  const now = new Date();
  return dateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
};

// Coarse, text-free summary. Settings are a snapshot of now; focus is for `key`.
const buildDailySummary = async (key) => {
  let launchAtLogin = false;
  try { launchAtLogin = !!(await telemetryApi.getLaunchAtLogin()).enabled; } catch (_) {}
  return {
    app_version: telemetryInfo?.version || 'unknown',
    platform: telemetryInfo?.platform || 'unknown',
    focus_minutes: Math.round(dailyFocusMinutes(key) / 5) * 5,
    session_count: logEntries.filter(e => e.dateKey === key && !e.manual).length,
    work_minutes: workMinutes,
    break_minutes: breakMinutes,
    sound: soundSelect.value,
    notifications: notificationsEnabled,
    deadline_reminders: deadlineRemindersEnabled,
    always_on_top: isAlwaysOnTop,
    launch_at_login: launchAtLogin,
    dark_mode: document.body.classList.contains('dark'),
    ui_theme: (localStorage.getItem('uiTheme') || 'default').slice(0, 40),
    daily_goal_minutes: dailyGoalMinutes,
    tasks: bucketCount(tasks.length),
    recurring_tasks: bucketCount(tasks.filter(t => t.repeat).length),
  };
};

// Sends yesterday's summary once. Days without any focus are skipped (the app may not have run).
const maybeSendTelemetry = async () => {
  if (!telemetryApi || !telemetryInfo || telemetrySending || Date.now() < telemetryRetryAt) return;
  const stateBefore = readTelemetryState();
  const key = previousDateKey();
  if (stateBefore.enabled !== true || !stateBefore.noticeShown || stateBefore.lastSent >= key) return;
  telemetrySending = true;
  try {
    const properties = await buildDailySummary(key);
    // The user may have opted out while the summary was being built.
    if (readTelemetryState().enabled !== true) return;
    if (properties.focus_minutes > 0) {
      const res = await telemetryApi.sendTelemetry({ id: getTelemetryId(), date: key, properties });
      if (!res || !res.ok) { telemetryRetryAt = Date.now() + TELEMETRY_RETRY_MS; return; }
    }
    const cur = readTelemetryState();
    if (cur.enabled === true) writeTelemetryState({ ...cur, lastSent: key });
  } catch (_) {
    telemetryRetryAt = Date.now() + TELEMETRY_RETRY_MS;
  } finally {
    telemetrySending = false;
  }
};

const refreshTelemetryUi = () => {
  const on = readTelemetryState().enabled === true;
  telemetryToggle.checked = on;
  telemetryPreview.hidden = true;
  telemetryIdLine.hidden = !on;
  if (on) telemetryIdLine.textContent = `Your random ID: ${getTelemetryId()} (quote it to ask for your data to be deleted)`;
};

const setTelemetryEnabled = (on) => {
  writeTelemetryState({ ...readTelemetryState(), enabled: on, noticeShown: true });
  if (!on) clearTelemetryId();
  refreshTelemetryUi();
  if (on) maybeSendTelemetry();
};

// Resolves once the person has chosen. Not dismissible by backdrop click or Escape.
const showTelemetryNotice = () => new Promise((resolve) => {
  const strict = telemetryInfo.strict;
  document.getElementById('telemetryModalText').textContent = strict
    ? 'Would you like to share anonymous usage data to help research what helps people focus? Nothing is shared unless you say yes.'
    : 'Pomoro shares anonymous usage data to help research what helps people focus. It is on by default; you can turn it off now or at any time.';
  const acceptBtn = document.getElementById('telemetryAcceptBtn');
  const declineBtn = document.getElementById('telemetryDeclineBtn');
  acceptBtn.textContent = strict ? 'Share data' : 'OK';
  declineBtn.textContent = strict ? 'No thanks' : 'Turn off';
  const finish = (on) => {
    telemetryModal.classList.add('hidden');
    setTelemetryEnabled(on);
    resolve();
  };
  acceptBtn.addEventListener('click', () => finish(true), { once: true });
  declineBtn.addEventListener('click', () => finish(false), { once: true });
  telemetryModal.classList.remove('hidden');
  acceptBtn.focus();
});

const openPrivacyPolicy = (e) => {
  if (!telemetryInfo?.privacyUrl) return;
  e.preventDefault();
  telemetryApi.openExternal(telemetryInfo.privacyUrl);
};

const initTelemetry = async () => {
  if (!telemetryApi) return; // browser build: nothing is ever sent
  try {
    telemetryInfo = await telemetryApi.getTelemetryInfo();
    telemetryInfo.version = await telemetryApi.getAppVersion();
  } catch (_) { telemetryInfo = null; return; }

  telemetryToggle.addEventListener('change', () => setTelemetryEnabled(telemetryToggle.checked));
  telemetryViewBtn.addEventListener('click', async () => {
    if (readTelemetryState().enabled !== true) {
      telemetryPreview.textContent = 'Sharing is off, so nothing is sent.';
    } else {
      const key = previousDateKey();
      telemetryPreview.textContent = JSON.stringify({
        id: getTelemetryId(), date: key, properties: await buildDailySummary(key),
      }, null, 2);
    }
    telemetryPreview.hidden = !telemetryPreview.hidden;
  });
  document.getElementById('telemetryPolicyLink').addEventListener('click', openPrivacyPolicy);
  document.getElementById('telemetryModalPolicy').addEventListener('click', openPrivacyPolicy);

  privacySettings.hidden = false;
  if (!readTelemetryState().noticeShown) await showTelemetryNotice();
  refreshTelemetryUi();
  maybeSendTelemetry();
  setInterval(maybeSendTelemetry, 60 * 1000);
};

// ── Init ───────────────────────────────────────────────────────────────────
loadState();
loadSettings();
if (notificationsToggle) notificationsToggle.checked = notificationsEnabled;
if (deadlineRemindersToggle) deadlineRemindersToggle.checked = deadlineRemindersEnabled;
syncMuteBtn();
resetCurrentMode();
applySettings();
if (alwaysOnTopToggle) {
  alwaysOnTopToggle.checked = isAlwaysOnTop;
  if (window.electronAPI) window.electronAPI.setAlwaysOnTop(isCompactMode && isAlwaysOnTop);
}
const standardPresetBtns = [...document.querySelectorAll('.preset:not(#customPresetChip)')];
if (!customPresetChip.classList.contains('active')) {
  const matchingPreset = standardPresetBtns.find(p => Number(p.dataset.work) === workMinutes && Number(p.dataset.break) === breakMinutes);
  if (matchingPreset) setPresetState(matchingPreset);
}
const activeTask = tasks.find(t => t.active);
if (activeTask) focusCard.textContent = `🎯 Current Task: ${activeTask.text}`;
updateDisplay();
updateFocusedTotal();
renderActivityLog();
initCompactHeatmap();
renderTasks();
renderCalendar();
renderPreloadedThumbs();
renderPalettePicker();
renderUiThemePicker();
refreshStats();
setSidebarState(summarySidebar, false);
setSidebarState(plannerOverlay, false);
syncRailVisibility();
syncRightRailVisibility();
checkDeadlineReminders({ startup: true });
setInterval(checkDeadlineReminders, 60 * 1000);
initTelemetry();

if (window.electronAPI?.getAppVersion) {
  window.electronAPI.getAppVersion().then(v => {
    const appName = 'Pomoro';
    baseTitle = `${appName} v${v}`;
    updateWindowTitle();
    const label = document.querySelector('.title-bar-label');
    if (label) label.textContent = `${appName} v${v}`;
  });
}

// ── Planner shell resize handle ────────────────────────────────────────────
const plannerShell = plannerOverlay.querySelector('.planner-shell');

const savedPlannerSize = (() => { try { return JSON.parse(localStorage.getItem('plannerSize')); } catch(_) { return null; } })();
if (savedPlannerSize && savedPlannerSize.w && savedPlannerSize.h) {
  plannerShell.style.width    = savedPlannerSize.w + 'px';
  plannerShell.style.height   = savedPlannerSize.h + 'px';
  plannerShell.style.maxHeight = 'none';
}

const plannerResizeHandle = document.createElement('div');
plannerResizeHandle.className = 'planner-resize-handle';
plannerResizeHandle.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  e.stopPropagation();
  const rect = plannerShell.getBoundingClientRect();
  const originLeft = rect.left;
  const originTop  = rect.top;
  const onMove = (ev) => {
    plannerShell.style.width    = Math.max(420, ev.clientX - originLeft) + 'px';
    plannerShell.style.height   = Math.max(300, ev.clientY - originTop)  + 'px';
    plannerShell.style.maxHeight = 'none';
  };
  const onUp = (ev) => {
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup',   onUp);
    const w = Math.max(420, ev.clientX - originLeft);
    const h = Math.max(300, ev.clientY - originTop);
    localStorage.setItem('plannerSize', JSON.stringify({ w, h }));
  };
  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup',   onUp);
});
plannerShell.appendChild(plannerResizeHandle);
makeDraggable(plannerShell, plannerShell.querySelector('.planner-header'));

window.addEventListener('beforeunload', () => {
  if (!isRunning || !isWorkMode) return;
  const elapsed = totalSeconds - remainingSeconds;
  if (elapsed > 0) addLogEntry(elapsed);
});
