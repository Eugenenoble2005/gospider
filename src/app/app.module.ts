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
//@ts-ignore
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatTableModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatProgressBarModule,
    NgScrollbarModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent]
})
export class AppModule { }