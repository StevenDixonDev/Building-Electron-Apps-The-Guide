# Setting Up Electron With Create React App

At this point we should already have a react app created and ready to go based on the previous tutorial.

The first thing we need to do is add Electron to our app but we have some other depencies we need to install as well

```
npm install electron --save-dev
npm install electron-is-dev --save

```

These libraries will help us run electron during development. electron-is-dev detects whether or not our app in is development mode, this is usefull because once the app is packaged our electron will need to load our react files from a different place.

Now we need to add our electron entry point to our project. Go ahead and create an electron.js file in the public folder of our react app.

our electron.js file should look as shown below. Most of this information was provided from this article [Here](https://medium.freecodecamp.org/building-an-electron-application-with-create-react-app-97945861647c) However It has been trimmed down to be the bare minimum required to run an electron app.

```JavaScript

const { app, BrowserWindow} = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const url = require('url');

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
            pathname: path.join(__dirname, '../build/index.html'),
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
})

```

Now that we have our electron.js file created that should be all, right? Well now we need add the ability for electron and react to work together. First we want to install these libraries as they will allow us to run our app for development.

```
npm install concurrently --save-dev
npm install cross-env --save-dev

```

[concurrently](https://www.npmjs.com/package/concurrently) allows us to run multiple commands in the command line at the same time, this is needed only during development however because our packaged app will manage this on its own.

[cross-env](https://www.npmjs.com/package/cross-env) Allows us run scripts that set and use environment variables across platforms, this is important for windows enviroments. 

Now we need to update our scripts in our package.json. Make %1000 percent sure the dependencies and devDepencies match otherwise it will lead to wierd issues later on when we are building the app! 

My personal expereince that if react-scripts are in dependencies it lead to errors down the road.

```json
{
    "name": "react-electron",
    "version": "0.0.0",
    "private": true,
    "homepage": ".",
    "main": "public/electron.js",
    "description": "A React-Electron Template",
    "author": "",
    "dependencies": {
        "react": "^16.8.3",
        "react-dom": "^16.8.3",
        "electron-is-dev": "^1.0.1"
    },
    "devDependencies": {
        "react-scripts": "^2.1.8",
        "electron": "^4.0.5",
        "cross-env": "^5.2.0",
        "concurrently": "^3.6.0"
    },
    "scripts": {
        "start": "concurrently \"cross-env BROWSER=none react-scripts start\" \"wait-on http://localhost:3000 && electron .\"",
        "dev": "react-scripts start",
        "reactbuild": "react-scripts build --prod",
        "test": "react-scripts test --env=jsdom",
        "eject": "react-scripts eject"
    },
    "eslintConfig": {
        "extends": "react-app"
    },
    "browserslist": "Electron 1.6"
}

```

And Thats it! If you have done everything correctly we should be able to run "npm start" and our electron app will now open!

You will notice that the browserslist was changed from the last tutorial where we set up react. This reflects our target browser.

There is a lot of things to learn with electron, unfortunatly this tutorial does not cover how to use alot of electron just how to set it up but [here](https://gitconnected.com/learn/electron) is really good resource for learning.

Make sure to check the template folder here to make sure you did not miss anything. You should be able to run "npm install" in the folder then "npm start"  to start the app. 

All right our next step is actually getting the app built! check out the tutorial [Setting Up Electron React Build](../%233A_SettingUpElectronReactBuild/)
