
const chromePaths = require('chrome-paths');
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const {app,ipcMain} = require("electron")
puppeteer.use(StealthPlugin())
const cheerio = require("cheerio")
async function main(url,quality,driver){
    console.log("loading...")
    let app_data = process.env.APPDATA.split(`\\`)
    app_data.pop()
    let chrome_data_folder = app_data.join(`\\\\`)+"\\\\"+"Local\\\\Google\\\\Chrome\\\\User Data";
    let edge_data_folder = app_data.join(`\\\\`)+"\\\\"+"Local\\\\Microsoft\\\\Edge\\\\User Data";
    let edge_path = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
   //C:\\Users\\noble\\AppData\\Local\\Google\\Chrome\\User Data
    const browser = await puppeteer.launch({
      headless:true,
      userDataDir:driver == "chrome" ? chrome_data_folder : edge_data_folder,
        executablePath:driver == "chrome" ? chromePaths.chrome : edge_path,
    })
       var page = await browser.newPage()
       await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");
       await page.goto(url)
       var link = await page.$eval("text/download",element=>element.getAttribute("href"))
       await page.goto("https://"+link)
       const response = await page.waitForResponse(
        res =>
        res.url() == "https://gogohd.pro/download" && res.request().method() == "POST"
      );
        let download_body = await response.text()
        const $ = cheerio.load(download_body)
        if($("a").length == 0){
           throw {"error":"Captcha Block Detected",link:link};
        }
        let download_link = $("a").map((i,el)=>{
            return el
        })
        await browser.close()
        return $(download_link[quality]).attr("href")
        }
     

ipcMain.handle("spider",async (event,data)=>{
    //do nothing eith error
     return main(data.url,data.quality,data.driver)
})
