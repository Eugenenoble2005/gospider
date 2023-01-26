import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormsModule } from "@angular/forms"
import { ElectronService } from 'ngx-electron';
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatTableModule } from "@angular/material/table"
import { MatSlideToggleModule } from "@angular/material/slide-toggle"
import { MatDialogModule } from "@angular/material/dialog"
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { StreamComponent } from './stream/stream.component';
import { ScriptService } from 'ngx-script-loader';
//@ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    StreamComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatDialogModule,
    HttpClientModule,
    MatTableModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatSortModule,
    MatProgressBarModule,
    NgScrollbarModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule
  ],
  providers: [ElectronService,ScriptService],
  bootstrap: [AppComponent]
})
export class AppModule { }
