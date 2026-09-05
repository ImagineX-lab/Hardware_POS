const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { startServer } = require('./server.js');

let mainWindow = null;
let serverInstance = null;
let activePort = 3000;

// Enforce single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    app.whenReady().then(async () => {
        try {
            const serverInfo = await startServer(3000);
            serverInstance = serverInfo.server;
            activePort = serverInfo.port;
            createWindow(activePort);
        } catch (err) {
            console.error('Failed to start Hardware POS server:', err);
            dialog.showErrorBox(
                'Hardware POS Startup Error',
                `Failed to initialize the local server.\n\nError: ${err.message || err}`
            );
            app.quit();
        }

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow(activePort);
            }
        });
    });
}

function createWindow(port) {
    const preloadPath = path.join(__dirname, 'preload.js');
    const iconPath = path.join(__dirname, 'icon.png');
    const windowOptions = {
        width: 1280,
        height: 800,
        minWidth: 1024,
        minHeight: 700,
        title: 'Hardware POS',
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: preloadPath
        }
    };

    if (fs.existsSync(iconPath)) {
        windowOptions.icon = iconPath;
    }

    mainWindow = new BrowserWindow(windowOptions);
    Menu.setApplicationMenu(null);

    const serverUrl = `http://127.0.0.1:${port}`;
    mainWindow.loadURL(serverUrl);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// IPC: silent direct print (no preview dialog)
ipcMain.handle('print-receipt', (event, options) => {
    return new Promise((resolve) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (!win) return resolve({ success: false, error: 'No window' });
        win.webContents.print(
            {
                silent: true,
                printBackground: true,
                margins: { marginType: 'none' },
                ...options
            },
            (success, errorType) => {
                resolve({ success, errorType: errorType || null });
            }
        );
    });
});

app.on('window-all-closed', () => {
    if (serverInstance && typeof serverInstance.close === 'function') {
        serverInstance.close();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
