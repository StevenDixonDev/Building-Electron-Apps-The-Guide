# Setting up Public Github Repository for updates

This section of the tutorial will walk us through:

1. [Getting Github Access Token](#getting-gh-access-token)
2. [Getting Travis setup](#getting-travis-setup)
3. [Adding Code and Publishing](#adding-code-and-publishing)

# Getting GH Access Token

In this section we will discuss retreiving our GH acces token from github in order to give Electron-Builder access to create draft releases.

In order to get a Personal Access token we will need to follow this tutorial. [Getting a Personal Access Token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line). 

Make sure to copy this token down as we will need it in the future. 

# Getting Travis Setup

In this section we will create a .travis.yml and configure our build process through [https://travis-ci.org](https://travis-ci.org).

Note: Travis is not the only CI/CD product that can accomplish what we want. [Here](https://github.com/ripienaar/free-for-dev#ci--cd) is a list of different CI/CD products that are free. The only requirement I would look for is that the app can connect to your github. Note that travis is only free for the first 100 builds. I Hope to find a good free version and get a tutorial up on that. We are using Travis based on the fact that it lets us compile our apps for Mac.

Navigate to [https://travis-ci.org/](https://travis-ci.org/) and sign up, then integrate Travis with github by selecting your public repo. (Note: that there are two versions of Travis. A .org and .com)

Next we will setup our credentials.

## Credentials

The first thing we need to do is make sure we have our ENV keys setup in our Travis project.

Open your project in travis and select "More Options" from the right hand side menu then from the drop down menu click on "settings".

On the settings page there is a section Titled "Environment Variables". This is where you will enter your GH_TOKEN.

Make sure you have Your GH_TOKEN variable defined.

- GH_TOKEN: YOURGITHUBACCESSTOKEN

These credentials will be used by electron builder to upload our compiled app to our Github Releases Draft.

## .Travis.yml

Now we need to create a .travis.yml file in the root of our project. Then copy the following code into the file.

```Bash
matrix:
  include:
    - os: osx
      osx_image: xcode9.4
      language: node_js
      node_js: "10"
      env:
        - ELECTRON_CACHE=$HOME/.cache/electron
        - ELECTRON_BUILDER_CACHE=$HOME/.cache/electron-builder
        
    - os: linux
      language: node_js
      node_js: "10"
      services: docker
      env:
        - GH_TOKEN=$GH_TOKEN

cache:  
  directories:
    - node_modules
    - $HOME/.cache/electron
    - $HOME/.cache/electron-builder

script:
  - |
    if [ "$TRAVIS_OS_NAME" == "linux" ]; then
      docker run --rm \
         --env-file <(env | grep -vE '\r|\n' | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
          --env ELECTRON_CACHE="/root/.cache/electron" \
          --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
          -v ${PWD}:/project \
          -v ~/.cache/electron:/root/.cache/electron \
          -v ~/.cache/electron-builder:/root/.cache/electron-builder \
          electronuserland/builder:wine \
        /bin/bash -c "npm install && npm run pack"
    else
      npm run travis-mac
    fi
before_cache:
  - rm -rf $HOME/.cache/electron-builder/wine

branches:
  except:
    - "/^v\\d+\\.\\d+\\.\\d+$/"

```

Note: This yml file will compile our code for mac, windows, and linux, However you will need some extra steps to get the mac version to run properly. This tutorial will not cover code signing, but you can learn more about it here [mac code signing tutorial](https://electronjs.org/docs/tutorial/code-signing).

This will finish our Travis Setup.

# Adding Code and Publishing

Now we need to complete the final step of getting our App finsished.

## Setting up publish

Firstly we need to install the Electron Auto Updater

```Bash

npm install electron-updater --save

``` 

The next thing we will do is update our package.json, we need to tell updater and publisher where the items we are looking for are.

```json
{
    "name": "react-electron",
    "version": "0.0.0",
    "private": true,
    "repository": "https://github.com/YourUserName/YourProjectName.git",
    "homepage": ".",
    "main": "public/electron.js",
    "description": "A React-Electron Template",
    "dependencies": {
        "react": "^16.8.3",
        "react-dom": "^16.8.3",
        "electron-is-dev": "^1.0.1",
        "electron-log": "^3.0.1",
        "electron-updater": "^4.0.6"
    },
    "devDependencies": {
        "concurrently": "^3.6.0",
        "cross-env": "^5.2.0",
        "electron": "^4.0.5",
        "react-scripts": "^2.1.8",
        "wait-on": "^3.2.0",
        "electron-builder": "^20.38.5"
    },
    "scripts": {
        "start": "concurrently \"cross-env BROWSER=none react-scripts start\" \"wait-on http://localhost:3000 && electron .\"",
        "dev": "react-scripts start",
        "reactbuild": "react-scripts build --prod",
        "test": "react-scripts test --env=jsdom",
        "eject": "react-scripts eject",
        "pre-build": "npm run reactbuild && electron-builder --dir",
        "build": "npm run reactbuild && electron-builder",
        "pack": "printenv && npm run reactbuild && electron-builder --linux --win --x64 -p always",
        "travis-mac": "npm run reactbuild && electron-builder --mac -p always"
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
        "publish": ["github"],
        "win": {
            "target": "nsis",
            "publish": ["github"]
        },
        "mac": {
            "category": "your.app.category.type"
        },
        "linux": {
            "target": [
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

You should notice a large difference from the last tutorial in our scripts. Build and Travis-mac are used by travis to compile our program. Prebuild is used when we want to package our app without uploading it to github, and Pack will compile our app and upload it to our github releases.

It is manditory that you specify the correct repository otherwise the build will fail

Note: to use Pack you will need to set your system ENV variables like so: (Make sure to use your Writer_user info)

On macOS/linux:

```Bash
export GH_TOKEN="YourGHAccessToken"
```

On Windows, run in powershell:

```Bash
[Environment]::SetEnvironmentVariable("GH_TOKEN","YourGHAccessToken","User")
```


## Setting up automated updates

To get our automated updates setup. We will need to edit our electron.js file as such

```JavaScript
const { app, BrowserWindow} = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const url = require('url');
const { autoUpdater } = require("electron-updater");

//This will log our update info where our app installed so that we can debug the app if we need to.
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info"

app.getVersion(); //list version number

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

After Updating our electron.js file everything should be set up and ready to go.

AutoUpdater.logging is not enabled by default, this code will output a log file in the folder our app is installed in. This is great to check if our app is actually loading.

Now whenever we push to master travis will compile our project and upload it to our GH releases.