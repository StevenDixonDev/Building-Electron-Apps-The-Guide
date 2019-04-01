# Do not Follow this section it is under construction

# Setting up Private Github Repository for updates

Disclaimer: This tutorial is much longer than the public version. As of 2019 You cannot update from a private repo anymore due to file size constraints, you will have to use S3 or something  simalar.

This section will walk you through:

1. [Getting Github setup](#github-setup)
2. [Getting Amazon S3 Setup]()
3. [Getting Travis setup]()
4. [Adding Code and Publishing]()


# Github Setup

This part will be short, the only thing we need to do is get a Personal Access Token.

Aside: technically you do not need to do this if you are not going to keep your releases on github

In order to do this you can follow the [github documentation](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line). The process is super simple, however make sure to save that token somewhere because if you lose it you will have to regenerate it.

Make sure the token has the repo scope/permissions!

And thats it for this part.

# AWS S3 setup

AWS is a great tool if you have never used it before. Unfortunatly it does require you to provide a credit card so it may not be accesible.

What we want to do is create a new bucket in S3 and give our app the rights to edit the bucket. [This](https://docs.aws.amazon.com/AmazonS3/latest/gsg/SigningUpforS3.html) Is a really good tutorial on how to sign up for Amazon S3 and create said bucket.

Once your bucket is created you will need to need change the buckets permissions. 

Verify that on the main permissions page that: 

1. Block new public ACLs and uploading public objects (Recommended) is set to False
2. Block new public bucket policies (Recommended) is set to False

Now we can create a policy for our bucket, Open the bucket polocies tab then copy and save this code. make sure to replace Yourbucketname with your actual buckets name.

```Bash
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowAppS3Releases",s
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:AbortMultipartUpload",
                "s3:GetObject",
                "s3:GetObjectAcl",
                "s3:GetObjectVersion",
                "s3:ListMultipartUploadParts",
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::Yourbucketname/*"
        },
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:ListBucket",
                "s3:ListBucketMultipartUploads"
            ],
            "Resource": "arn:aws:s3:::Yourbucketname"
        }
    ]
}

```

At this point our bucket is fully setup but now we need to give Electron builder access to write and Auto Updater access to read from the bucket. To do this we need to create 2 IAM users, one to read and one to write. 

To do this we will need to go to [Amazon AWS IAM](https://console.aws.amazon.com/iam/home?region=us-east-1#/users).

First we will create our Write User.

Click Add a new user and make sure to name them something appropriate. Since this is our Writer I named mine "S3Write_User".

Under acess type make sure to only select Programmitic Access then click the next button.

On the permissions page we are going to select to Attach an existing policy directly. 

In the search bar type "AmazonS3FullAccess" this will be our user Travis (or your CI of choices uses to upload our program). Add the only item that shows up by selecting the check box and click the next button.

We can skip over the tags unless you have a personal reason to use them, Click next.

On this page review the info you provided and click the "Create User" button

You should now be on the final screen now, Please copy down the Access key ID and the Secret access key, if you lose them you will need to create a new user or regenerate the key.

Now we need to create our Read user.

We will follow the same steps but change a couple things. 

firstly I Named this user S3Read_user.

Then on the permisions page we will attach the existing policy "AmazonS3ReadOnlyAccess".

Finish creating the user and copy down the Access key ID and the Secret access key.

And now our S3 bucket is ready. In the next step we will setup Travis.




# Getting Travis setup

Note: Travis is not the only CI/CD product that can accomplish what we want. [Here](https://github.com/ripienaar/free-for-dev#ci--cd) is a list of different CI/CD products that are free. The only requirement I would look for is that the app can connect to your github.

Navigate to [https://travis-ci.com/](https://travis-ci.com/) and sign up, then intergrate Travis with github by selecting your private repo. (Note: that there are two versions of Travis. A .org and .com, the .com can access our private repo.)

## Credentials
The first thing we need to do is make sure we have our ENV keys setup in our Travis project.

Open your project in travis and select "More Options" from the right hand side menu then from the drop down menu click on "settings".

On the settings page there is a section Titled "Environment Variables". This is where you will enter your AWS_SECRET_ACCESS_KEY and AWS_ACCESS_KEY_ID from your S3Write_User.

These credentials will by electron builder to upload to our S3 Bucket. 

## .Travis.yml

now we need to create a .travis.yml file in the root of our project. Then copy the following code into the file.

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
      language: generic

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
    "repository": "https://github.com/StevenDixonDev/Electron-Github-Build-Template.git",
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
        "pack": "npm run reactbuild && electron-builder -w --x64 -p always",
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
        "publish": [
            {
                "provider": "s3",
                "bucket": "YourBucketNameHere"
            }
        ],
        "win": {
            "target": "nsis",
            "publish": [
                {
                    "provider": "s3",
                    "bucket": "YourBucketNameHere"
                }
            ]
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

You should notice a large difference from the last tutorial in our scripts. Build and Travis-mac are used by travis to compile our program. Prebuild is used when we want to test our packaged app without uploaded it to S3, and Pack will compile our app and upload it to our S3 bucket.

Note: to use Pack you will need to set your system ENV variables like so: (Make sure to use your Writer_user info)

On macOS/linux:

```Bash
export AWS_ACCESS_KEY_ID="Users Secret ID"
export AWS_SECRET_ACCESS_KEY="User secret key"
```

On Windows, run in powershell:

```Bash
[Environment]::SetEnvironmentVariable("AWS_ACCESS_KEY_ID","Users Secret ID","User")
[Environment]::SetEnvironmentVariable("AWS_SECRET_ACCESS_KEY","User secret key","User")
```

Make sure to Copy your buckets name into the publish sections in package.json.

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

//
autoUpdater.requestHeaders = { 
    "AWS_ACCESS_KEY_ID": "Read Users Secret ID",
    "AWS_SECRET_ACCESS_KEY": "Read User secret key" 
};

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