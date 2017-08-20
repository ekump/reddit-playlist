import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent, DialogContent } from '../home/home.component';
import {
  AuthService,
  RedditService,
  SpotifyService,
  WindowService,
} from '../services';
import { routing } from './app.routing';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  declarations: [ AppComponent, HomeComponent, DialogContent ],
  entryComponents: [ DialogContent ],
  providers: [ AuthService, RedditService, SpotifyService, WindowService ],
  bootstrap: [ AppComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class AppModule {}
