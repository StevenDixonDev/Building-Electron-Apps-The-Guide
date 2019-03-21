# Setting Up React

For the sake of making this tutorial simple we will be using Create-React-App with NPM

[Info on CRA](https://facebook.github.io/create-react-app/docs/getting-started)

We will be building this app without ejecting the react app to simplify the setup.

```
npx create-react-app react-electron
cd react-electron
npm start
```

We should now have an app directory that looks like this:

```diff
react-electron
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    └── serviceWorker.js
```

With this we have a fully functioning react app, we should be able to move into the directory and run npm start to run and verify the app is working.

We are going to ahead and modify the package.json file to make sure we are ready to include Electron. The build script will conflict with Electron's build command so we will rename it. 

```JSON
{
    "name": "react-electron",
    "version": "0.0.0",
    "private": true,
    "homepage": ".",
    "description": "A React-Electron Template",
    "author": "",
    "dependencies": {
        "react": "^16.8.3",
        "react-dom": "^16.8.3"
    },
    "devDependencies": {
        "react-scripts": "^2.1.8"
    },
    "scripts": {
        "start": "react-scripts start",
        "reactbuild": "react-scripts build",
        "test": "react-scripts test --env=jsdom",
        "eject": "react-scripts eject"
    },
    "eslintConfig": {
        "extends": "react-app"
    },
    "browserlist": [
        ">0.2%",
        "not dead",
        "not ie <= 11",
        "not op_mini all"
    ]
}
```

Congratulations You now have a react application, crazy easy right? If you want more info on working with react checkout [The react Tutorial](https://reactjs.org/tutorial/tutorial.html) from React.

Alright lets move on to the next Steps [Setting Up Electron With React](../%232A_SettingUpElectronReact/readme.md)


