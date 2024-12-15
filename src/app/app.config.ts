import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';

import route from './app.route';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, BrowserAnimationsModule),
    provideRouter(route),
    provideHttpClient(),
  ],
};
