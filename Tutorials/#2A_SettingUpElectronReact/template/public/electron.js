const { app, BrowserWindow} = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

const pages = {
    mainWindow: null
}

createWindow = () =>{
    pages.mainWindow = new BrowserWindow({
        width: 800, height: 800
    })

    pages.mainWindow.loadURL( //loads our react app depending on where its located during development and production
        isDev ? 'http://localhost:3000/' : path.join(__dirname, './index.html')
    )

    pages.mainWindow.once('ready-to-show', ()=>{
        pages.mainWindow.show();
    })

    pages.mainWindow.on('close', ()=> pages.mainWindow = null)
}

app.on('ready', ()=> createWindow())

app.on('window-all-closed', ()=> app.quit())

app.on('activate', ()=>{
    if(pages.mainWindow === null) createWindow();
})