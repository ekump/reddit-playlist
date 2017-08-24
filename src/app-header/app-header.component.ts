import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SpotifyUser } from '../models';
import { AuthService, SpotifyService } from '../services';

@Component({
  selector: 'app-header',
  template: require('./app-header.component.html'),
  styles: [ require('./app-header.component.scss') ],
})
export class AppHeaderComponent implements OnInit {
  isSpotifyAuthenticated: boolean = false;
  authObserver: any;
  spotifyObserver: any;
  spotifyUser: SpotifyUser;
  showProgressBar: boolean = false;
  constructor (
    private authService: AuthService,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit () {
    this.authObserver = this.authService
      .isLoggedInToSpotify()
      .subscribe(result => {
        this.isSpotifyAuthenticated = result;
        if (this.isSpotifyAuthenticated) {
          this.spotifyObserver = this.spotifyService
            .getMe()
            .subscribe(result => {
              this.spotifyUser = result;
            });
        }
      });
  }
}
