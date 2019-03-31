# Seting Up Gitlab for Automated Updating Your Electron App

So this part of the tutorial is going to setup 2 things:

1. [Getting Gitlab to compile our App](#getting-gitlab-to-compile-our-app)
2. [Getting the information from Gitlab we need to setup our automated updates](#getting-the-information)
3. [Installing the last few libraries and wrapping up](#finalizing-everything)

## Getting Gitlab to compile our App 

Gitlab has entire pages of CI/CD setups for us to go through [here](https://docs.gitlab.com/ee/ci/) and this tutorial is not even gonna scratch the surface of what is possible, but if you follow along we should be okay!

The first thing we are going to want to do is tell Gitlab that we want it to run the Gitlab runners. By default github tries to compile your code whenever you push an update to your master branch, Unfortunatly it does not know how to after you add some code. So we need to tell the Runners how to compile our code.  The way we are going to do that is by providing a .gitlab-ci.yml file in the root of our project project directory.

Create a .gitlab-ci.yml file and copy the following code.

```Bash
variables:
  VERSION_ID: '1.0.$CI_PIPELINE_ID'

image: electronuserland/builder:wine

stages:
  - build

build:
  stage: build
  artifacts:
    paths:
      - $CI_PROJECT_DIR/dist/*.*
  script:
    - sed "s/0.0.0/${VERSION_ID}/g" package.json > _package.json && mv _package.json package.json
    - npm install && npm run build

```

This tutorial will not go into depth on how this file works, but the basics are that the image line tells Gitlab runner which Docker image file to run when compiling our app. Docker is kind of like a virtual machine.

To learn more about Docker check out [this](https://opensource.com/resources/what-docker).

To learn about the configuration of this file checkout the [Gitlab documentation](https://docs.gitlab.com/ee/ci/yaml/).

The image specified above comes with all the programs we need preinstalled in a linux instance, There are many images available to choose from for many different types of projects. 
The docker image used in this tutorial is provided by [Electron Userland](https://github.com/electron-userland) on github. It is important that we have wine installed in the docker instance so that we can compile our app for windows.

For our scripts we are telling our Docker instance to install the depencies we specified in the package.json file for our app, and then to compile our app just like we would normally.

Now whenever you push to your master branch you should see an icon specifying that Gitlab is compiling your project. ![A compiling picture](https://docs.gitlab.com/ee/ci/examples/laravel_with_gitlab_and_envoy/img/pipelines_page.png)

## Getting the information

Setting up gitlab is pretty straight forwward all we need to do is located Our projects "Project ID" which is always located underneath the project name on the project details page.

![Pitcure of project id](https://i.stack.imgur.com/u0K4w.png)

Then we need to create an access token.

You can find out how to make access tokens on the gitlab docs [here](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html).

We need the token so that when we can give access to the electron-updater library we are going to install in the next step

## Finalizing Everything

Alright so you have made it this far, and we are close to being done. All thats left updating our code.

So now we need to update our app with the Auto updater

```Bash

npm install electron-updater --save

```

Electron updater is a fancy little library that will allow us to connect to our Git product of choice and pull down our compiled app whenever it detects we created a new tag

Our package.json should look like this now.

```Json {
    "name": "react-electron",
    "version": "0.0.0",
    "private": true,
    "homepage": ".",
    "main": "public/electron.js",
    "description": "A React-Electron Template",
    "dependencies": {
        "react": "^16.8.3",
        "react-dom": "^16.8.3",
        "electron-is-dev": "^1.0.1",
        "electron-updater": "^4.0.6",
    },
    "devDependencies": {
        "react-scripts": "^2.1.8",
        "electron": "^4.0.5",
        "cross-env": "^5.2.0",
        "concurrently": "^3.6.0",
        "wait-on": "^3.2.0",
        "electron-builder": "^20.38.5"
    },
    "scripts": {
        "start": "concurrently \"cross-env BROWSER=none react-scripts start\" \"wait-on http://localhost:3000 && electron .\"",
        "dev": "react-scripts start",
        "reactbuild": "react-scripts build --prod",
        "test": "react-scripts test --env=jsdom",
        "eject": "react-scripts eject",
        "build": "npm run reactbuild && electron-builder",
        "pack": "electron-builder --dir",
        "pack-win": "electron-builder build --win --x64",
        "pack-linux": "electron-builder build --linux"
    },
    "eslintConfig": {
        "extends": "react-app"
    },
    "browserslist": "Electron 1.6",
    "build": {
        "appId": "com.electron.react",
        "compression": "normal",
        "productName": "React-Electron",
        "directories": {
            "output": "dist",
            "buildResources": "build"
        },
        "win": {
            "target": "nsis"
        },
        "linux": {
            "target": [
                "deb",
                "rpm",
                "snap",
                "AppImage"
            ],
            "category": "Development"
        },
        "dmg": {
            "contents": [
                {
                    "x": 130,
                    "y": 220
                },
                {
                    "x": 410,
                    "y": 220,
                    "type": "link",
                    "path": "/Applications"
                }
            ]
        }
    },
    "author": {
        "name": "Electron React Build App",
        "email": "StevenDixonDev@Github.com",
        "url": "https://github.com/StevenDixonDev/Electron-React-Build-Guide"
      }
}

```

Now all that is left is to update our Electron.js file in our public directory and add the code for the updater!

```JavaScript
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
})
```

Most tutorials out there give you the wrong link for pulling the update down, the reason is in 2017/2018 Gitlab changed the way their website worked due to security reasons. This change seems to have broken the compatibility, and most tutorials have not been updated.

Congratulations fpr getting to the end of the tutorial.

Some extra notes: 

- Update and Notify will not notify your users of an update, instead it will wait for the app to be closed before updating. There is a guide on how to design your own way of dealing with the updates. 

Thanks so much for using my tutorial, good luck and happy hacking!