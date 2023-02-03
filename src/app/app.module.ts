import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
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
import { MatProgressSpinnerModule} from "@angular/material/progress-spinner"
import { StreamComponent } from './stream/stream.component';
import { MatAutocompleteModule } from "@angular/material/autocomplete"
import { ScriptService } from 'ngx-script-loader';
import appRoutes from './app-routing.module';
import { MainComponent } from './main/main.component';
import { HentaiComponent } from './hentai/hentai.component';
//@ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    StreamComponent,
    MainComponent,
    HentaiComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    RouterModule.forRoot(appRoutes),
    MatDialogModule,
    MatProgressSpinnerModule,
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
