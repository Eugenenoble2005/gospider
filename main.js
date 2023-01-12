const {app,ipcMain,shell} = require("electron")
const {BrowserWindow} = require('electron-acrylic-window')
    const url = require("url");
    const path = require("path");

    let mainWindow

    function createWindow () {
      mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        vibrancy:{
          effect:"acrylic",
          theme:"#12345678"
        },
        webPreferences: {
          nodeIntegration: true,
          contextIsolation:false,
        }
      })

      mainWindow.loadURL(
        // url.format({
        //   pathname: path.join(__dirname, `/dist/electron-app/index.html`),
        //   protocol: "file:",
        //   slashes: true
        // })
        "http://localhost:4200"
      );
      // Open the DevTools.
      mainWindow.webContents.openDevTools()
      //open download links externally
      mainWindow.on('closed', function () {
        mainWindow = null
      })
    }
    ipcMain.handle("openInChrome",async(event,link)=>{
        shell.openExternal(link)
    })
    app.on('ready', createWindow)

    app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') app.quit()
    })

    app.on('activate', function () {
      if (mainWindow === null) createWindow()
    })
    require("./spider.js")