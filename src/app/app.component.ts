import { Component, OnInit,ViewChild } from '@angular/core';

//https://v2.gogoanime.co.in/videos/kawaikereba-hentai-demo-suki-ni-natte-kuremasu-ka-dub-episode-12
//@ts-ignore
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public auto_download:boolean = true
  public platform = document.body.classList[1]
  download_paths: Array<any> = [];
  ngOnInit(): void {
  }
  
  title = 'gospider';
}