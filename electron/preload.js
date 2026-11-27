const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setIgnoreMouseEvents: (ignore, options) =>
    ipcRenderer.send('set-ignore-mouse-events', ignore, options),
  moveWindow: (deltaX, deltaY) =>
    ipcRenderer.send('move-window', { deltaX, deltaY }),
  stepWalk: (stepX) =>
    ipcRenderer.invoke('step-walk', { stepX }),
  resizeForDex: (isOpen) =>
    ipcRenderer.send('resize-for-dex', isOpen), // <-- 이 부분이 추가되었습니다
  onTamagotchiAction: (callback) => {
    const handler = (_event, action) => callback(action);
    ipcRenderer.on('tamagotchi-action', handler);
    return () => ipcRenderer.removeListener('tamagotchi-action', handler);
  },
  onToggleWalk: (callback) => {
    const handler = (_event, enabled) => callback(enabled);
    ipcRenderer.on('toggle-walk', handler);
    return () => ipcRenderer.removeListener('toggle-walk', handler);
  },
  onSystemStats: (callback) => {
    const handler = (_event, stats) => callback(stats);
    ipcRenderer.on('system-stats', handler);
    return () => ipcRenderer.removeListener('system-stats', handler);
  },
});