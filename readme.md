# Electron Build Guide 2019

It is 2019 and Currently Electron has been around for almost 8 years. Unfortunately some of the documentation and tutorials on how to Build, Pack, And handling CI & CD are either lacking or severely out of date.

This tutorial aims to create and outline the process not only to setup the application and get users started but to setup some of the best features that are available but poorly documented.

## How to use this Tutorial

In the tutorial folder you will find numbered folders on each topic. Each tutorial builds on the previous. Each Tutorial will have a Read me file with instructions on how to use them, and a template folder containing the files used to build the tutorial.

1. Setting up FrameWorks - Follow the process of Setting up your selected frame work
    - [Setting up React](./tutorials/#1A_SettingUpReact/readme.md)
    - [Setting up Vue](./tutorials/#1B_SettingUpVue/readme.md)
    - [Setting up Angular](./tutorials/#1C_SettingUpAngular/readme.md)

2. [Setting up Electron](./tutorials/#2_SettingUpElectron/readme.md) - This builds on top of the previously created react app.
    
3. Git based CI and CD  - This tutorial builds on top of everything we have created so far and Sets up Continuous Integration and Continuous Deployment.
    - [#3A_SettingUpGitlab](./tutorials/#3A_SettingUpGitlab/readme.md)
    - [#3B_SettingUpGithub](./tutorials/#3B_SettingUpGithub/readme.md)

4. Electron Auto Update - The final step of getting your Electron app to update itself
    - [Place Holder]()

By the end of the tutorial we should have a fully functioning Self Updating React Desktop Application.

## How to Compile

This project was built with the following:

- Node v11.10.0
- NPM v6.7.0

Each tutorial will outline the minimum required packages for creating each section.

## Things That are not covered

1. Electron Builds for Mac - If someone would like to pitch in and explain this in the tutorial that would be great.
2. Actually using Electron - There are many tutorial on how to use electron and its API to create applications. for more info on Electron and Using it check out the [QuickStart Guide](https://electronjs.org/docs/tutorial/quick-start) On electrons site.

## Things that would be Awesome to Cover

Checkout the Issues! I have included some stuff that would be awesome to cover!

## I want to contribute to this project

I would love to have some one to help me out, please get in touch with me!