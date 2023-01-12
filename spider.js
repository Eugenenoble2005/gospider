const puppeteer = require("puppeteer")
const chromePaths = require('chrome-paths');
const {app,ipcMain} = require("electron")
//puppeteer.use(StealthPlugin())
const cheerio = require("cheerio")
async function main(url,quality){
    console.log("loading...")
    let app_data = process.env.APPDATA?.split(`\\`)
    app_data?.pop()
    let chrome_data_folder = app_data?.join(`\\\\`)+"\\\\"+"Local\\\\Google\\\\Chrome\\\\User Data";
   //C:\\Users\\noble\\AppData\\Local\\Google\\Chrome\\User Data
    const browser = await puppeteer.launch({
      headless:true,
      userDataDir:chrome_data_folder,
        executablePath:chromePaths.chrome,
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
        let download_link = $("a").map((i,el)=>{
            return el
        })
        await page.close()
        return $(download_link[quality]).attr("href")
        }
     

ipcMain.handle("spider",async (event,data)=>{
     return main(data.url,data.quality)
})
