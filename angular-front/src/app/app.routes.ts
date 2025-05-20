// src/app/app.routes.ts
import { Route }         from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';

export const routes: Route[] = [
  { path: '', component: MainPageComponent },
  { path: '**', redirectTo: '' }
];
