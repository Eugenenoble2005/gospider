import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HentaiComponent } from './hentai/hentai.component';
import { MainComponent } from './main/main.component';

const appRoutes: Routes = [
  { path: '', 
    component: MainComponent 
  },
  {
    path:"hentai",
    component:HentaiComponent
  }
];
export default appRoutes;