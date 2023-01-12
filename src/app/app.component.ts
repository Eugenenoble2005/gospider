import { Component, OnInit,ViewChild } from '@angular/core';
import { ElectronService } from "ngx-electron"
import { MatTable } from '@angular/material/table';
import { MatSlideToggle } from '@angular/material/slide-toggle';
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
      console.log(self.episodes)
      if(episode == end_episode){
        self.scalping = false
        return
      }
          data.url = "https://v2.gogoanime.co.in/videos/"+episode_string_array.join("-")+"-"+episode
          self.electronService.ipcRenderer.invoke("spider",data).then((result:any)=>{
            if(result){
              self.episodes.push({"episode":episode,"link":result})
              getLink(episode+1)
              //download automatically is needed
              if(self.auto_download){
                self.openInChrome(result)
              }
            }
            self.table.renderRows()
          },(error:any)=>{
              //move to next episode and report failed if anything goes wrong
              getLink(episode+1)

          })
     }
     getLink(start_episode)
  }
  openInChrome(link:any){
    this.electronService.ipcRenderer.invoke("openInChrome",link)
  }
  title = 'gospider';
}
