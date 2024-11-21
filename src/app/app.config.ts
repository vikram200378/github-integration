import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, BrowserModule } from '@angular/platform-browser';

import route from './app.route';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, BrowserAnimationsModule),
    provideRouter(route),
    provideHttpClient(),
  ],
};
