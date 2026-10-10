const { app, BrowserWindow, Menu, Tray, ipcMain, Notification, shell } = require('electron');
const path = require('path');
const telemetry = require('./telemetry');

Menu.setApplicationMenu(null);
// Store packages get their AUMID from the manifest; overriding it breaks toast notifications.
if (!process.windowsStore) app.setAppUserModelId('com.sfabdkia.pomoro');

const ICON_PATH = path.join(__dirname, 'assets', 'Icon.ico');
let mainWindow = null;
let tray = null;
let isQuitting = false;
let timerRunning = false;
let trayTooltip = 'Pomoro';

if (!app.requestSingleInstanceLock()) {
  isQuitting = true;
  app.quit();
} else {
  app.on('second-instance', showMainWindow);
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) { createWindow(); return; }
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}

function buildTrayMenu() {
  return Menu.buildFromTemplate([
    { label: 'Show Pomoro', click: showMainWindow },
    {
      label: timerRunning ? 'Pause' : 'Start',
      click: () => {
        if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('tray-toggle-timer');
      },
    },
    { type: 'separator' },
    { label: 'Quit', click: () => { isQuitting = true; app.quit(); } },
  ]);
}

function createTray() {
  tray = new Tray(ICON_PATH);
  tray.setToolTip(trayTooltip);
  tray.setContextMenu(buildTrayMenu());
  tray.on('click', () => {
    if (mainWindow && !mainWindow.isDestroyed() && mainWindow.isVisible() && !mainWindow.isMinimized()) {
      mainWindow.hide();
    } else {
      showMainWindow();
    }
  });
}

// Launched by the OS at login (see set-launch-at-login): start minimized to the tray.
const LAUNCH_ARG = '--launched-at-login';
let startHidden = process.argv.includes(LAUNCH_ARG);

function createWindow() {
  const showNow = !startHidden;
  startHidden = false;
  const win = new BrowserWindow({
    show: showNow,
    width: 1280,
    height: 860,
    minWidth: 700,
    frame: false,
    alwaysOnTop: false,
    icon: ICON_PATH,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false, // keep the timer ticking while hidden in the tray
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow = win;

  win.loadFile(path.join(__dirname, 'index.html'));

  // Closing hides to the tray so the timer keeps running; Quit lives in the tray menu.
  win.on('close', (e) => {
    if (isQuitting) return;
    e.preventDefault();
    win.hide();
  });
  win.on('closed', () => { if (mainWindow === win) mainWindow = null; });

  win.on('enter-full-screen', () => win.webContents.send('fullscreen-changed', true));
  win.on('leave-full-screen',  () => win.webContents.send('fullscreen-changed', false));
  win.on('maximize',   () => win.webContents.send('maximize-changed', true));
  win.on('unmaximize', () => win.webContents.send('maximize-changed', false));
}

ipcMain.handle('toggle-fullscreen', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const next = !win.isFullScreen();
  win.setFullScreen(next);
  return next;
});

ipcMain.handle('minimize-window', (event) => {
  BrowserWindow.fromWebContents(event.sender).minimize();
});

ipcMain.handle('maximize-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win.isMaximized()) win.unmaximize(); else win.maximize();
});

ipcMain.handle('close-window', (event) => {
  BrowserWindow.fromWebContents(event.sender).close();
});

ipcMain.handle('get-app-version', () => app.getVersion());

ipcMain.handle('telemetry-get-info', () => ({
  ...telemetry.getRegionPolicy(),
  privacyUrl: telemetry.PRIVACY_URL,
  platform: process.platform,
}));
ipcMain.handle('telemetry-send', (_event, payload) => telemetry.sendDailySummary(payload));

// Only https links to Ko-fi and the privacy policy may be opened in the user's default browser.
ipcMain.handle('open-external', (_event, url) => {
  if (typeof url !== 'string') return false;
  if (!/^https:\/\/ko-fi\.com\//.test(url) && url !== telemetry.PRIVACY_URL) return false;
  shell.openExternal(url);
  return true;
});

// Only meaningful for the installed app; in dev it would register electron.exe.
ipcMain.handle('get-launch-at-login', () => ({
  // Store (MSIX) packages need a manifest StartupTask instead of login-item settings.
  supported: app.isPackaged && !process.windowsStore,
  enabled: app.isPackaged && !process.windowsStore && app.getLoginItemSettings({ args: [LAUNCH_ARG] }).openAtLogin,
}));

ipcMain.handle('set-launch-at-login', (_event, value) => {
  if (!app.isPackaged) return false;
  app.setLoginItemSettings({ openAtLogin: !!value, args: [LAUNCH_ARG] });
  return app.getLoginItemSettings({ args: [LAUNCH_ARG] }).openAtLogin;
});

ipcMain.handle('show-notification', (event, payload) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const { title, body } = payload || {};
  if (win && !win.isFocused()) win.flashFrame(true);
  if (!Notification.isSupported()) return { ok: false, error: 'Notifications are not supported on this system.' };
  return new Promise((resolve) => {
    let n;
    try {
      n = new Notification({
        title: String(title || ''),
        body: String(body || ''),
        icon: path.join(__dirname, 'assets', 'Icon.ico'),
        silent: true, // the app plays its own alert sound
      });
    } catch (err) {
      resolve({ ok: false, error: String(err && err.message || err) });
      return;
    }
    n.on('click', () => {
      if (!win || win.isDestroyed()) return;
      if (win.isMinimized()) win.restore();
      win.show();
      win.focus();
    });
    n.on('show', () => resolve({ ok: true }));
    n.on('failed', (_e, error) => resolve({ ok: false, error: String(error) }));
    n.show();
    setTimeout(() => resolve({ ok: true, unconfirmed: true }), 3000);
  });
});

ipcMain.handle('set-progress', (event, fraction) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const f = Number(fraction);
  if (win) win.setProgressBar(Number.isFinite(f) ? Math.min(1, f) : -1);
});

ipcMain.handle('set-tray-state', (_event, payload) => {
  const { running, tooltip } = payload || {};
  const nextTooltip = String(tooltip || 'Pomoro');
  if (tray && nextTooltip !== trayTooltip) { trayTooltip = nextTooltip; tray.setToolTip(trayTooltip); }
  if (tray && !!running !== timerRunning) { timerRunning = !!running; tray.setContextMenu(buildTrayMenu()); }
});

ipcMain.handle('set-always-on-top',(event, value) => {
  BrowserWindow.fromWebContents(event.sender).setAlwaysOnTop(value);
});

ipcMain.handle('set-compact-mode', (event, payload) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const { compact, width, height } = payload || {};
  if (compact) {
    win._preCompactSize = win.getSize();
    win._preCompactPos  = win.getPosition();
    win.setMinimumSize(0, 0);
    win.setResizable(false);
    win.setContentSize(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)), true);
  } else {
    win.setResizable(true);
    win.setMinimumSize(700, 0);
    const [w, h] = win._preCompactSize || [1280, 860];
    win.setContentSize(w, h, true);
    if (win._preCompactPos) {
      const [x, y] = win._preCompactPos;
      win.setPosition(x, y);
    }
  }
});

// ── Auto-update (GitHub Releases via electron-updater) ─────────────────────
// Only works for the installed (NSIS) build; dev runs and portable builds can't self-update.
let autoUpdater = null;
// The Microsoft Store updates its own packages, so the in-app updater stays off there.
if (app.isPackaged && !process.windowsStore && !process.env.PORTABLE_EXECUTABLE_DIR) {
  try {
    ({ autoUpdater } = require('electron-updater'));
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;
  } catch (_) { autoUpdater = null; }
}

function sendUpdateStatus(payload) {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('update-status', payload);
}

if (autoUpdater) {
  autoUpdater.on('checking-for-update', () => sendUpdateStatus({ state: 'checking' }));
  autoUpdater.on('update-available', (info) => sendUpdateStatus({ state: 'available', version: info.version }));
  autoUpdater.on('update-not-available', () => sendUpdateStatus({ state: 'none' }));
  autoUpdater.on('download-progress', (p) => sendUpdateStatus({ state: 'downloading', percent: Math.round(p.percent) }));
  autoUpdater.on('update-downloaded', (info) => sendUpdateStatus({ state: 'downloaded', version: info.version }));
  autoUpdater.on('error', (err) => sendUpdateStatus({ state: 'error', message: String(err && err.message || err) }));
}

ipcMain.handle('update-supported', () => !!autoUpdater);

ipcMain.handle('check-for-update', async () => {
  if (!autoUpdater) return { ok: false, error: 'Updates are only available in the installed version of the app.' };
  try { await autoUpdater.checkForUpdates(); return { ok: true }; }
  catch (err) { return { ok: false, error: String(err && err.message || err) }; }
});

ipcMain.handle('download-update', async () => {
  if (!autoUpdater) return false;
  try { await autoUpdater.downloadUpdate(); return true; }
  catch (_) { return false; }
});

ipcMain.handle('install-update', () => {
  if (!autoUpdater) return;
  isQuitting = true; // let the window actually close instead of hiding to the tray
  autoUpdater.quitAndInstall(false, true);
});

app.whenReady().then(() => {
  if (isQuitting) return;
  createWindow();
  createTray();

  // Quiet background check shortly after launch; the UI only reacts if an update exists.
  if (autoUpdater) setTimeout(() => { autoUpdater.checkForUpdates().catch(() => {}); }, 10000);

  app.on('activate', showMainWindow);
});

app.on('before-quit', () => { isQuitting = true; });

// Stay alive in the tray; quitting goes through the tray menu.
app.on('window-all-closed', () => {});
