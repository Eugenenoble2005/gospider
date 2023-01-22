import { Component, OnInit,ViewChild } from '@angular/core';
import { ElectronService } from "ngx-electron"
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSelect } from '@angular/material/select';
import { DialogComponent } from './dialog/dialog.component';
import { HttpClient } from "@angular/common/http"
import { MatSort } from '@angular/material/sort';
const axios = require('axios').default;
//https://v2.gogoanime.co.in/videos/kawaikereba-hentai-demo-suki-ni-natte-kuremasu-ka-dub-episode-12
//@ts-ignore
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  public auto_download:boolean = true
  download_paths: Array<any> = [];
  ngOnInit(): void {
  
  }
  public driver = "chrome"
  public episodes:any = []
  public data_source = new MatTableDataSource(this.episodes)
  @ViewChild(MatTable) public table!: MatTable<any>
  @ViewChild(MatSort) sort!: MatSort;
  public scalping = false
  displayedColumns: string[] = ['episode', 'link',"stream"];
  constructor(public electronService:ElectronService,public dialog:MatDialog,public http:HttpClient){}
  async deployScalper(data:any){
      this.scalping = true
      let self = this
      //validate domain in url
      let domain = new URL(data.url)
      let accepted_hostnames = ["gogoanime.co.in","v2.gogoanime.co.in","www.gogoanime.co.in","www.v2.gogoanime.co.in"]
      if(!accepted_hostnames.includes(domain.hostname)){
        const dialog = this.dialog.open(DialogComponent,{
          data:{message:"The url is not from the domain 'gogoanime.co.in' or 'v2.gogoanime.co.in' and will not work. Please get your link from 'gogoanime.com.in' or 'v2.gogoanime.co.in'"}
        })
        this.scalping = false
        //halt execution
        return
      }
     let url = data.url
     let end_episode = data.end_episode
     let start_episode = data.start_episode
     let episode_string_array = (url.split("/")[url.split("/").length-1]).split("-")
     episode_string_array.pop()
     let x1 = episode_string_array.join("-").split("-") //we must not link episode_string_array directly for this to work, we must either deep copy or recreate the object
     x1.pop()
     let anime_id = x1.join("-")
     let download_paths:Array<any> = []
     //asynchronously query anime data
     this.http.get(`https://api.consumet.org/anime/gogoanime/info/${anime_id}`).subscribe(async (rez:any)=>{
      (<HTMLTableElement>document.getElementById("main")).style.backgroundImage = `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url(${rez.image})`
      //get streaming links first
      for(var x=start_episode-1; x<=end_episode-1;x++){
        let episode = rez.episodes[x]
        let url = `https://api.consumet.org/anime/gogoanime/watch/${episode?.id}`
         this.http.get(url).subscribe(async (rez:any)=>{
          let result = {"episode":episode.number,"error":"scalping","stream_link":rez.sources[data.quality]?.url,"status":false}
          this.episodes.push(result)
          download_paths.push(rez.download)
          this.data_source.sort = this.sort
          if(this.episodes.length == end_episode){
            //run the following after loop is done
            //sort table data by clicking on sort button
            (<HTMLTableRowElement><any>document.getElementById("episode_bar")?.click());

            //get download links with getLink() function
            console.log(download_paths)
            getLink(1,download_paths)
          }
          try{
            this.table.renderRows()
          }
          catch{}
        })
      }
     },(error:any)=>{
      this.dialog.open(DialogComponent,{
        data:{message:"Something went wrong, Please Try Again"}
      })
      this.scalping = false
     })
   //  use recursion to scalp for download links
     function getLink(episode:number,paths:Array<any>){
      data.driver = self.driver
      if(episode == end_episode){
        self.scalping = false
        return
      }
          data.url = paths[episode]
          self.electronService.ipcRenderer.invoke("spider",data).then(async (result:any)=>{
            if(result){
              result.episode = episode
              //get streaming link
              //download automatically is needed+
              if(self.auto_download){
                self.openInChrome(result.link)
              }
              let data = [result]
              let newData = self.episodes.map((obj: { episode: number})=>data.find(o=>o.episode === obj.episode) || obj);
              self.episodes = newData
              console.log(self.episodes)
              getLink(episode+1,paths)
              try{
                self.table.renderRows()
                }
                catch{}
            }
            //idk this thing throws errors for some reason
            try{
            self.table.renderRows()
            }
            catch{}
          },async (error:any)=>{
            let data = [{"episode":episode,"status":false,"error":"any"}]
            let newData = self.episodes.map((obj: { episode: number})=>data.find(o=>o.episode === obj.episode) || obj);
            self.data_source = newData
            getLink(episode+1,paths)
              try{
              self.table.renderRows()
              }
              catch{}
          })
     }
    //  getLink(start_episode)
  }
  retryCrawl(episode:number,$event:any){
    $event.target.disabled = true;
    $event.target.innerHTML = "Retrying"
    let url = (<HTMLInputElement>document.getElementById("url")).value;
    let episode_string_array = (url.split("/")[url.split("/").length-1]).split("-")
    episode_string_array.pop()
    url = "https://v2.gogoanime.co.in/videos/"+episode_string_array.join("-")+"-"+episode
    let data = {"url":url,"driver":this.driver,"quality":2}
    this.electronService.ipcRenderer.invoke("spider",data).then((result:any)=>{
      //try to crawl episode again and display data on the table
      if(result){
        result.episode = episode
        let data = [result]
        let newData = this.episodes.map((obj: { episode: number})=>data.find(o=>o.episode === obj.episode) || obj);
        this.episodes = newData
        try{
          this.table.renderRows()
        }
        catch{}
      }
    },(error:any)=>{
      let data = [{"episode":episode,"status":false,"error":"any"}]
        let newData = this.episodes.map((obj: { episode: number})=>data.find(o=>o.episode === obj.episode) || obj);
        this.episodes = newData
        try{
          this.table.renderRows() 
        }
      catch{}
    })

  }
  openInChrome(link:any){
    this.electronService.ipcRenderer.invoke("openInChrome",link)
  }
  title = 'gospider';
}
