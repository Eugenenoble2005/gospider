import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElectronService } from "ngx-electron"
@Component({
  selector: 'app-hentai',
  templateUrl: './hentai.component.html',
  styleUrls: ['./hentai.component.scss']
})
export class HentaiComponent implements OnInit {
  hentai_list:Array<any> = []
  constructor(public http:HttpClient,public electronService:ElectronService) { }
  public scalping:boolean = false
  public driver = "chrome"
  ngOnInit(): void {
  }
  findWank(data:any){
    this.scalping = true
    data.driver = this.driver
      //cors blocks wonte let me scrape manually. Gotta bust out puppetter
      this.electronService.ipcRenderer.invoke("hanime",data).then((result:any)=>{
        console.log(result)
      })
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
}
