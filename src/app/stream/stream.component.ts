import { Component, Inject, OnInit,OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScriptService } from 'ngx-script-loader';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit {
  loaded = false
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public scriptService:ScriptService,public changeDetector:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.scriptService.runScript("assets/video.min.js").subscribe((result)=>{
      this.loaded = true
      this.changeDetector.detectChanges()
     })
  }
}
