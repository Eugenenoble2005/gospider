const {app,ipcMain,shell,} = require("electron")
var os = require("os");
//import appropriate browserWIndow depending on platform
var module_for_browser_window = os.platform() == "win32" ? 'electron-acrylic-window' : "electron"
  const {BrowserWindow } = require(module_for_browser_window)
    const url = require("url");
    const path = require("path");

    let mainWindow

    function createWindow () {
      //use BrowserWindow class from package electron-acrylic-window on windows platforms
      mainWindow = new BrowserWindow({
        // width: 800,
        // height: 600,
        autoHideMenuBar: true ,
        icon:path.join(__dirname, `/gogoanime.png`),
        vibrancy:{
          effect:"acrylic",
          theme:"#12345678"
        },
        webPreferences: {
          nodeIntegration: true,
          contextIsolation:false,
          //disbaling cors for hanime.
          webSecurity: false
          //devTools:false,
          
        }
      })
      mainWindow.maximize();
      mainWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, `/dist/gospider/index.html`),
          protocol: "file:",
          slashes: true
        }),
        // "http://localhost:4200"
      ); 
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