import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';
import 'rxjs/add/operator/map';
import { SpotifyAuthComponent } from './spotify-auth/spotify-auth.component';
import { SpotifyService } from './spotify.service';

@NgModule({
  declarations: [
    AppComponent,
    SpotifyAuthComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [
    { provide: SpotifyService , useClass: SpotifyService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
