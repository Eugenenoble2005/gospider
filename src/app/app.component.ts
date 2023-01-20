import { Component, OnInit,ViewChild } from '@angular/core';
import { ElectronService } from "ngx-electron"
import { MatTable } from '@angular/material/table';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSelect } from '@angular/material/select';
import { DialogComponent } from './dialog/dialog.component';
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
  constructor(public electronService:ElectronService,public dialog:MatDialog){}
  deployScalper(data:any){
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
              getLink(episode+1)
              result.episode = episode
              self.episodes.push(result)
              //download automatically is needed
              if(self.auto_download){
                self.openInChrome(result)
              }
            }
            //idk this thing throws errors for some reason
            try{
            self.table.renderRows()
            }
            catch{}
          },(error:any)=>{
              //move to next episode and report failed if anything goes wrong
              self.episodes.push({"episode":episode,"status":false,"error":"any"})
              getLink(episode+1)
              try{
              self.table.renderRows()
              }
              catch{}
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
