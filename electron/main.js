const { app, BrowserWindow, Tray, Menu, ipcMain, screen, nativeImage } = require('electron');
const path = require('path');
const os = require('os');

let mainWindow = null;
let tray = null;
let prevCpuInfo = getCpuTimes();

app.commandLine.appendSwitch('enable-transparent-visuals');

function getCpuTimes() {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;
  for (const cpu of cpus) {
    for (const type in cpu.times) {
      total += cpu.times[type];
    }
    idle += cpu.times.idle;
  }
  return { idle, total };
}

function getSystemStats() {
  const currentCpu = getCpuTimes();
  const idleDiff = currentCpu.idle - prevCpuInfo.idle;
  const totalDiff = currentCpu.total - prevCpuInfo.total;
  prevCpuInfo = currentCpu;

  const cpuUsage = totalDiff > 0 ? Math.round(100 - (100 * idleDiff) / totalDiff) : 0;
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const memUsage = Math.round(((totalMem - freeMem) / totalMem) * 100);

  return {
    cpu: Math.max(0, Math.min(100, cpuUsage)),
    mem: Math.max(0, Math.min(100, memUsage)),
  };
}

function createWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 280,
    height: 380,
    x: Math.floor(screenWidth / 2) - 140,
    y: screenHeight - 380,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.setIgnoreMouseEvents(true, { forward: true });
}

function createTray() {
  const iconPath = path.join(__dirname, '../public/icon.ico');
  let trayIcon = nativeImage.createFromPath(iconPath);
  if (trayIcon.isEmpty()) {
    trayIcon = nativeImage.createEmpty();
  }

  tray = new Tray(trayIcon);
  tray.setToolTip('바탕화면 다마고치');

  const loginSettings = app.getLoginItemSettings();

  const contextMenu = Menu.buildFromTemplate([
    { label: '🍖 밥 주기', click: () => mainWindow?.webContents.send('tamagotchi-action', 'FEED') },
    { label: '🎾 미니게임 열기', click: () => mainWindow?.webContents.send('tamagotchi-action', 'PLAY') },
    { label: '🧹 청소하기', click: () => mainWindow?.webContents.send('tamagotchi-action', 'CLEAN') },
    { label: '📖 방사형 진화 도감', click: () => mainWindow?.webContents.send('tamagotchi-action', 'DEX') },
    { type: 'separator' },
    {
      label: '🚶 자율 배회 모드',
      type: 'checkbox',
      checked: true,
      click: (menuItem) => mainWindow?.webContents.send('toggle-walk', menuItem.checked),
    },
    {
      label: '🚀 윈도우 시작 시 자동 실행',
      type: 'checkbox',
      checked: loginSettings.openAtLogin,
      click: (menuItem) => {
        app.setLoginItemSettings({
          openAtLogin: menuItem.checked,
          path: app.getPath('exe'),
        });
      },
    },
    {
      label: '📍 작업표시줄 위로 복귀',
      click: () => {
        const { width, height } = screen.getPrimaryDisplay().workAreaSize;
        mainWindow?.setPosition(Math.floor(width / 2) - 140, height - 380);
      },
    },
    {
      label: '🔄 새 알부터 다시 키우기',
      click: () => mainWindow?.webContents.send('tamagotchi-action', 'RESET'),
    },
    { type: 'separator' },
    { label: '종료', click: () => app.quit() },
  ]);

  tray.setContextMenu(contextMenu);
}

ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
  BrowserWindow.fromWebContents(event.sender)?.setIgnoreMouseEvents(ignore, options);
});

ipcMain.on('move-window', (event, { deltaX, deltaY }) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;
  const [currentX, currentY] = win.getPosition();
  win.setPosition(currentX + deltaX, currentY + deltaY);
});

ipcMain.handle('step-walk', (event, { stepX }) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return { hitEdge: false };

  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize;
  const [currentX, currentY] = win.getPosition();
  const [winWidth] = win.getSize();

  let nextX = currentX + stepX;
  let hitEdge = false;

  if (nextX <= 0) {
    nextX = 0;
    hitEdge = true;
  } else if (nextX + winWidth >= screenWidth) {
    nextX = screenWidth - winWidth;
    hitEdge = true;
  }

  win.setPosition(nextX, currentY);
  return { hitEdge };
});

// 도감 팝업 열림/닫힘에 따른 창 크기 강제 전환 (resizable 잠금 해제 후 변경)
ipcMain.on('resize-for-dex', (event, isOpen) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;

  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
  const [curX, curY] = win.getPosition();

  win.setResizable(true);

  if (isOpen) {
    const targetW = 450;
    const targetH = 480;
    const nextX = Math.max(10, Math.min(curX - 85, screenWidth - targetW - 10));
    const nextY = Math.max(10, Math.min(curY - 100, screenHeight - targetH - 10));
    win.setSize(targetW, targetH);
    win.setPosition(nextX, nextY);
  } else {
    const targetW = 280;
    const targetH = 380;
    const nextX = Math.max(0, Math.min(curX + 85, screenWidth - targetW));
    const nextY = Math.max(0, Math.min(curY + 100, screenHeight - targetH));
    win.setSize(targetW, targetH);
    win.setPosition(nextX, nextY);
  }

  win.setResizable(false);
});

setInterval(() => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('system-stats', getSystemStats());
  }
}, 3000);

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});