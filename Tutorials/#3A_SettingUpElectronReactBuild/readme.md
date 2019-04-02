# Setting up React Electron app Build

For this section we will be setting up our project to be able to compile our React code and Package everything into an Electron app.

Now we need to install a package to make our lives easier.

```
npm install electron-builder --save-dev

```

Electron builder is a robust package that lets us compile our app for windows, linux, and mac! Learn more about [Electron Builder](https://github.com/electron-userland/electron-builder).

The reasons for using this package is because it provides the ability to sign code and auto update. This tutorial will not cover code signing however.

Please Note By default build command will only generate the installer for current platform and current arch.
You can specify to build for linux in windows, however this is currently broken, a work around I have found is to have a runner build it for me (ie: Gitlabs Runner or Heroku)

Mac building requires that the app is compiled on a Mac system. (I have heard that it is possible with something like [Travis-CI](https://travis-ci.org/).

The next thing that needs to be done is update our package.json again to account for the build scripts and tags that Electron-builder needs to compile our app.

```json
{
    "name": "react-electron",
    "version": "0.0.0",
    "private": true,
    "homepage": ".",
    "main": "public/electron.js",
    "description": "A React-Electron Template",
    "dependencies": {
        "react": "^16.8.3",
        "react-dom": "^16.8.3",
        "electron-is-dev": "^1.0.1"
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
        "dist": "npx build --x64 --win --lin --c.extraMetadata.main=build/electron.js -p always",
        "build": "npm run reactbuild && electron-builder ",
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


There are many build options for Electron builder when it comes to windows, linux, and mac. You can check out some of the Boiler plates provided by Electron builder [Here](https://www.electron.build/#boilerplates) for more options.

For Linux builds the author section must be filled out and include an email adress.

If you set everything up propery you should be able to run 

```
npm run build

```

which will build our react app and then package our electron app into our dist folder.

If you are curious you can navigate to the dist folder to run the app and make sure it works.

Remember to add the /dist folder to your .gitignore, otherwise you will be uploading your entire compiled program when ever you push!

Congratulations if you have made it this far, the next tutorials will be working on setting up an atuomated update for the app using git: 

[Setting Up Gitlab for Auto Updates](../%234A_SettingUpGitlab)

[Setting Up Github Private Repo for Auto Updates](../%234B_SettingUpGithubPrivate)

[Setting Up Github Public Repo for Auto Updates](../%234C_SettingUpGithubPublic)