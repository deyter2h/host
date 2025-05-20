// src/app/app.config.ts
import { importProvidersFrom } from '@angular/core';
import { provideRouter }       from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { routes }             from './app.routes';

export const appConfig = {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideHttpClient(),
    provideRouter(routes),
  ]
};
