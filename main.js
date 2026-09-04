const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const http = require('http');

const fs = require('fs');
const preloadPath = path.join(__dirname, 'preload.js');


let mainWindow = null;
const PORT = process.env.PORT || 3000;

function checkServerReady(url, callback) {
    const request = http.get(url, (res) => {
        if (res.statusCode === 200 || res.statusCode === 304 || res.statusCode === 404) {
            callback(true);
        } else {
            setTimeout(() => checkServerReady(url, callback), 200);
        }
    });
    request.on('error', () => {
        setTimeout(() => checkServerReady(url, callback), 200);
    });
}

function createWindow() {
    const iconPath = path.join(__dirname, 'icon.png');
    const windowOptions = {
        width: 1280,
        height: 800,
        minWidth: 1024,
        minHeight: 700,
        title: 'Hardware POS',
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

    Menu.setApplicationMenu(null); // Optional: remove standard default menu for clean POS interface

    const serverUrl = `http://localhost:${PORT}`;
    
    // Ensure Express server has started before loading URL
    checkServerReady(serverUrl, () => {
        if (mainWindow) {
            mainWindow.loadURL(serverUrl);
        }
    });

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

// Start Express server inside Electron
require('./server.js');

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
