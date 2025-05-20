import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { MainPage } from './app/pages/main-page/main-page.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(MainPage, {
  providers: [
    importProvidersFrom(HttpClientModule),
    ...appConfig.providers
  ]
})
.catch(err => console.error(err));