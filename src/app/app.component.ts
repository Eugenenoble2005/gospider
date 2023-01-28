import { Component, OnInit,ViewChild } from '@angular/core';
import { ElectronService } from "ngx-electron"
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSelect } from '@angular/material/select';
import { DialogComponent } from './dialog/dialog.component';
import { HttpClient } from "@angular/common/http"
import { MatSort } from '@angular/material/sort';
import { StreamComponent } from './stream/stream.component';
import { ScriptService } from 'ngx-script-loader';
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
  public animes:Array<any> = []
  public data_source = new MatTableDataSource(this.episodes)
  @ViewChild(MatTable) public table!: MatTable<any>
  @ViewChild(MatSort) sort!: MatSort;
  public scalping = false
  displayedColumns: string[] = ['episode', 'link',"stream","secondary_download"];
  constructor(public electronService:ElectronService,public dialog:MatDialog,public http:HttpClient,public scriptService:ScriptService){}
  async deployScalper(data:any){
      this.scalping = true
      let self = this
     let anime_id = data.anime_id
     let end_episode = data.end_episode
     let start_episode = data.start_episode
     let download_paths:Array<any> = []
     let stream_paths:Array<any> = []
     //asynchronously query anime data
     this.http.get(`https://api.consumet.org/anime/gogoanime/info/${anime_id}`).subscribe(async (rez:any)=>{
      (<HTMLTableElement>document.getElementById("main")).style.backgroundImage = `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url(${rez.image})`
      getStreamingLinks(rez,start_episode-1)
     },(error:any)=>{
      //change in background color is to allow blur effect to work in windows acrylic window
      document.body.style.background = "#202124"
      if(error.status == 404){
        this.dialog.open(DialogComponent,{
          data:{message:"Anime not found, Please use the suggestions provided in the search bar"},
          backdropClass:"stream-blur",
        }).beforeClosed().subscribe(()=>{
          document.body.style.background = "transparent"
        })
      }
      else if(error.status == 429){
        this.dialog.open(DialogComponent,{
          data:{message:"Slow down cowboy, You've crawled alot in such a short while. Try again in some minutes"},
          backdropClass:"stream-blur",
        }).beforeClosed().subscribe(()=>{
          document.body.style.background = "transparent"
        })
      }
      else{
        //agnostic
        this.dialog.open(DialogComponent,{
          data:{message:"Something went wrong. Please retry again later"},
          backdropClass:"stream-blur",
        }).beforeClosed().subscribe(()=>{
          document.body.style.background = "transparent"
        })
      }
      this.scalping = false
     })
      //get streaming links with recursion
      function getStreamingLinks(rez:any,count:number){
        if(count == end_episode){
          getLink(1,download_paths,stream_paths)
          return
        }
      let episode = rez?.episodes[count]
      let url = `https://api.consumet.org/anime/gogoanime/watch/${episode?.id}`
      self.http.get(url).subscribe(async (res:any)=>{
        let result = {"episode":episode.number,"error":"scalping","stream_link":res.sources[data.quality]?.url,"status":false,"secondary_download":res.download}
        self.episodes.push(result)
        try{
            self.table.renderRows()
           }
          catch{}
        download_paths.push(res.download)
        stream_paths.push(res.sources[data.quality]?.url)
        getStreamingLinks(rez,count+1)
       
      },(error)=>{
        //move to next episode on failure
        getStreamingLinks(rez,count+1)
      })
    }
   //  use recursion to scalp for download links
     function getLink(episode:number,paths:Array<any>,stream_paths:Array<any>){
      data.driver = self.driver
      if(episode-1 == end_episode){
        console.log(episode)
        console.log(end_episode)
        self.scalping = false
        return
      }
          data.url = paths[episode-1]
          self.electronService.ipcRenderer.invoke("spider",data).then(async (result:any)=>{
            if(result){
              result.episode = episode
              result.secondary_download = paths[episode-1]
              result.stream_link = stream_paths[episode-1]
              //get streaming link
              //download automatically is needed+
              if(self.auto_download){
                self.openInChrome(result.link)
              }
              let data = [result]
              let newData = self.episodes.map((obj: { episode: number})=>data.find(o=>o.episode === obj.episode) || obj);
              self.episodes = newData
              console.log(self.episodes)
              getLink(episode+1,paths,stream_paths)
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
            /**
             * THIS IS THERE YOU STOPPED, YOU WERE TRYING TO FIGURE OUT WHY IT WASNT GETTING DOWNLAOD LINKS FOR EVERYTHING
             */
            console.log(episode)
            let data = [{"episode":episode,"status":false,"error":"any","stream_link":stream_paths[episode-1],"secondary_download":paths[episode-1]}]
            let newData = self.episodes.map((obj: { episode: number})=>data.find(o=>o.episode === obj.episode) || obj);
            self.episodes = newData
            getLink(episode+1,paths,stream_paths)
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
  searchAnime($event:any){
    this.animes = []
    let text = $event.target.value;
    this.http.get(`https://api.consumet.org/anime/gogoanime/${text}`).subscribe((rez:any)=>{
      rez.results.forEach((element: { id: any; }) => {
        this.animes.push(element.id)
      });
    })
  }
  title = 'gospider';
}