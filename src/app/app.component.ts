import { Component } from '@angular/core';
import { SpotifyService } from './spotify.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tokenResponse: Observable<any>;
  answer: any;
  title = 'Reddit Playlist';
  constructor( private spotifyService: SpotifyService) {}

  authenticate() {
    console.log("AUTHENTICATNG");
    this.spotifyService.auth()
    .subscribe(foo => this.answer = foo);
  }
}
