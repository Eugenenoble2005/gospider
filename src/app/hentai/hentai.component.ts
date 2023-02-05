import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElectronService } from "ngx-electron"
const cheerio = require("cheerio")
import { StreamComponent } from '../stream/stream.component';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
@Component({
  selector: 'app-hentai',
  templateUrl: './hentai.component.html',
  styleUrls: ['./hentai.component.scss']
})
export class HentaiComponent implements OnInit {
  hentai_list:Array<any> = []
  hentai: any;
  constructor(public http:HttpClient,public electronService:ElectronService,public dialog:MatDialog) { }
  public scalping:boolean = false
  public driver = "chrome"
  ngOnInit(): void {
  }
  findWank(data:any){
    this.scalping = true
    data.driver = this.driver
    //replace spaces with slashes
    data.hentai_id = data.hentai_id.split(" ").join("-")
      //cors blocks wonte let me scrape manually. Gotta bust out puppetter
      this.http.get(`https://hanime.tv/videos/hentai/${data.hentai_id}`,{responseType:"text"}).subscribe((rez:any)=>{
        let $ = cheerio.load(rez)
        let script_data = $("script").map((i:any,el:any)=>{
          if(el.children[0]?.data?.length > 1000){
            return el
          }
        })
        let result =  script_data[0].children[0].data.split("window.__NUXT__=").pop();
        result = result.substring(0,result.length-1);
        result = JSON.parse(result)
        console.log(result)
        if(result.state.data.video == undefined){
          this.scalping = false
          this.dialog.open(DialogComponent,{
            data:{message:"Something went wrong. Please Ensure you got the hentai's title right and your connection is properly setup"},
            backdropClass:"stream-blur",
          }).beforeClosed().subscribe(()=>{
            document.body.style.background = "transparent"
          })
          return
        }
        this.hentai = result
        this.scalping = false;
        (<HTMLElement>document.getElementById("hentai_background")).style.background = `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)), url(${result.state.data.video.hentai_video.cover_url})`

        $("a").map((i:any,el:any)=>{
            if(el.attribs.href?.length > 30){
              let download_url = "http://hanime.tv"+el.attribs.href
              this.hentai.secondary_download = download_url
            }
        })
      },(error:any)=>{
       
      })
   
  }
  openInChrome(link:any){
    this.electronService.ipcRenderer.invoke("openInChrome",link)
  }
  searchHentai($event:any)
  {
    this.hentai_list = []
    let text = $event.target.value;
    this.http.post("https://search.htv-services.com/",{
      "search_text":text,
      "tags": [],
      "tags_mode": "AND",
      "brands": [],
      "blacklist": [],
      "order_by": "created_at_unix",
      "ordering": "desc",
      "page": 0
    }).subscribe((rez:any)=>{
      JSON.parse(rez.hits).forEach((element: { slug: any; }) => {
          this.hentai_list.push(element.slug)
      });
    })
  }
  streamEpisode(link:any)
  {
    document.body.style.background = "#202124"
    this.dialog.open(StreamComponent,{
      backdropClass:"stream-blur",
      data:{"stream_link":link},
      width:"900px",
      height:"400px"
    }).beforeClosed().subscribe(()=>{
      document.body.style.background = "transparent"
    })
  }
}
