import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { HomeComponent } from '../home/home.component';
import { AuthService, RedditService, SpotifyService } from '../services';
import { routing } from './app.routing';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    HttpModule
  ],
  declarations: [
    AppComponent,
    HomeComponent
  ],
  providers: [
    AuthService,
    RedditService,
    SpotifyService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule { }
