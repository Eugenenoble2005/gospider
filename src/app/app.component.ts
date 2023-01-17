import { Component, OnInit,ViewChild } from '@angular/core';
import { ElectronService } from "ngx-electron"
import { MatTable } from '@angular/material/table';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSelect } from '@angular/material/select';
//https://v2.gogoanime.co.in/videos/kawaikereba-hentai-demo-suki-ni-natte-kuremasu-ka-dub-episode-12
//@ts-ignore
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  public auto_download:boolean = true
  ngOnInit(): void {
  
  }
  public driver = "chrome"
  public episodes:any = []
  @ViewChild(MatTable) public table!: MatTable<any>
  public scalping = false
  displayedColumns: string[] = ['episode', 'link'];
  constructor(public electronService:ElectronService){}
  deployScalper(data:any){
      this.scalping = true
      let self = this
     let url = data.url
     let end_episode = data.end_episode
     let start_episode = data.start_episode
     let episode_string_array = (url.split("/")[url.split("/").length-1]).split("-")
     episode_string_array.pop()
     //use recursion to scalp for individual links
     function getLink(episode:number){
      data.driver = self.driver
      if(episode-1 == end_episode){
        self.scalping = false
        return
      }
          data.url = "https://v2.gogoanime.co.in/videos/"+episode_string_array.join("-")+"-"+episode
          self.electronService.ipcRenderer.invoke("spider",data).then((result:any)=>{
            if(result){
              console.log(result)
              getLink(episode+1)
              self.episodes.push({"episode":episode,"link":result})
              //download automatically is needed
              if(self.auto_download){
                self.openInChrome(result)
              }
            }
            try{
            self.table.renderRows()
            }
            catch{}
          },(error:any)=>{
              //move to next episode and report failed if anything goes wrong
              self.episodes.push({"episode":episode,"link":"failed"})
              getLink(episode+1)
              try{
              self.table.renderRows()
              }
              catch{}
              console.log(JSON.stringify(error))
          })
     }
     getLink(start_episode)
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
      console.log("retry-reesult",result)
      //try to crawl episode again and display data on the table
      if(result){
        let data = [{"episode":episode,"link":result}]
        let newData = this.episodes.map((obj: { episode: number,"link":any })=>data.find(o=>o.episode === obj.episode) || obj);
        this.episodes = newData
        try{
          this.table.renderRows()
        }
        catch{}
      }
    },(error:any)=>{
      let data = [{"episode":episode,"link":"failed","driver":this.driver}]
      let newData = this.episodes.map((obj: { episode: number,"link":any })=>data.find(o=>o.episode === obj.episode) || obj);
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
