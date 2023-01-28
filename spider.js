
const chromePaths = require('chrome-paths');
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const {app,ipcMain} = require("electron")
puppeteer.use(StealthPlugin())
const cheerio = require("cheerio")
async function main(url,quality,driver){
  
    console.log("loading...")
    //using user data helps convince google the browser is human operated as opposed to an empty chromium instance.
    let app_data = process.env.APPDATA.split(`\\`)
    app_data.pop()
    let chrome_data_folder = app_data.join(`\\\\`)+"\\\\"+"Local\\\\Google\\\\Chrome\\\\User Data";
    let edge_data_folder = app_data.join(`\\\\`)+"\\\\"+"Local\\\\Microsoft\\\\Edge\\\\User Data";
    let edge_path = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
   //C:\\Users\\noble\\AppData\\Local\\Google\\Chrome\\User Data
   let link = url
    const browser = await puppeteer.launch({
      headless:true,
      userDataDir:driver == "chrome" ? chrome_data_folder : edge_data_folder,
        executablePath:driver == "chrome" ? chromePaths.chrome : edge_path,
    })
       var page = await browser.newPage()
        await page.goto(link,{waitUntil:"domcontentloaded"})
        //block popup ad script because it interfers with scalping
        await page.setRequestInterception(true);
        let accepted_hosts = ["www.google.com",new URL(link).hostname,"www.gstatic.com"]
        page.on('request', interceptedRequest => {
          if (
            //greatly increases speed. Ignore all malicous ad networks
           accepted_hosts.includes(new URL(interceptedRequest.url()).hostname)
          ){
            interceptedRequest.continue()
         }
          else { 
             interceptedRequest.abort();
            };
        });
          const response = await page.waitForResponse(
            res =>
            res.url() == "https://"+new URL(link).hostname+"/download" && res.request().method() == "POST"
          );
          let download_body = await response.text()
          const $ = cheerio.load(await download_body)
          if($("a").length == 0){
             return {"status":false,"error":"captcha","link":`${link}`}
          }
          let download_link = $("a").map((i,el)=>{
              return el
          })
           browser.close()
          return {"status":true,"link":$(download_link[quality]).attr("href")}
        }
        
     

ipcMain.handle("spider",async (event,data)=>{
    //do nothing eith error
     return main(data.url,data.quality,data.driver)
})
