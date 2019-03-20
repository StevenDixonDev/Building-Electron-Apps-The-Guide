# Setting Up Electron With Create React App

At this point we should already have a react app created and ready to go based on the previous tutorial.

The first thing we need to do is add Electron to our app but we have some other depencies we need to install as well

```
npm install electron --save-dev
npm install electron-is-dev --save

```

These libraries will help us run electron during development.

now we need to add our electron entry point to our project. Go ahead and create an electron js in the public folder of our react app.

our electron.js file should look as shown below. this information was provided from this article [Here](https://medium.freecodecamp.org/building-an-electron-application-with-create-react-app-97945861647c)

```JavaScript

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

```

Now that we have our electron app that should be all right? Well now we need add the ability for electron and react to work together. First we want to install these libraries as they will allow us to run our app for development.

```
npm install concurrently --save-dev
npm install cross-env --save-dev

```

Now we need to update our scripts in our package.json. Make %100 percent sure the dependencies and devDepencies match otherwise it will lead to wierd issues later on when we are building the app!

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
    "browserslist": [
        ">0.2%",
        "not dead",
        "not ie <= 11",
        "not op_mini all"
    ]
}

```

And Thats it! 

All right if you have done everything correctly we should be able to run "npm start" and our electron app will now open!

There is a lot of things to learn with electron, unfortunatly this tutorial does not cover how to use alot of electron just how to set it up but [here](https://gitconnected.com/learn/electron) is really good resource for learning.

Make sure to check the template folder here to make sure you did not miss anything. You should be able to run "npm install" in the folder then "npm start"  to start the app. 