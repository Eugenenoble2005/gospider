import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScriptService } from 'ngx-script-loader';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit {
  video_source: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public scriptService:ScriptService) { }

  ngOnInit(): void {
    this.scriptService.runScript("assets/video.min.js").subscribe((result)=>{
      console.log(result)
     },(error)=>{
      console.log(error)
     })
  }

}
