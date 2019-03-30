const { app, BrowserWindow} = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const url = require('url');
const { autoUpdater } = require("electron-updater");

autoUpdater.requestHeaders = { "PRIVATE-TOKEN": "the access token we created above" };

autoUpdater.setFeedURL({
    provider: "generic",
    url: "http://gitlab.com/api/v4/projects/your project id from above/jobs/artifacts/master/raw/dist/?job=build"
});

autoUpdater.checkForUpdatesAndNotify();

const pages = {
    mainWindow: null
}

createWindow = () =>{
    pages.mainWindow = new BrowserWindow({
        width: 800, height: 800
    })

    pages.mainWindow.loadURL( //loads our react app depending on where its located during development and production
        isDev ? 
        'http://localhost:3000/' : 
        url.format({
            pathname: path.join(__dirname, './index.html'),
            protocol: 'file',
            slashes: true
        })
    )

    pages.mainWindow.once('ready-to-show', ()=>{
        pages.mainWindow.show();
        pages.mainWindow.webContents.openDevTools();
    })

    pages.mainWindow.on('close', ()=> pages.mainWindow = null)
}

app.on('ready', ()=> createWindow())

app.on('window-all-closed', ()=> app.quit())

app.on('activate', ()=>{
    if(pages.mainWindow === null) createWindow();