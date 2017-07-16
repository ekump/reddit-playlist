import { Component, OnInit } from '@angular/core';
import { AuthService, SpotifyService } from '../services';
import { SpotifyUser } from '../models';

@Component({
  template: require('./home.component.html')
})

export class HomeComponent implements OnInit  {
  isSpotifyAuthenticated: boolean = false;
  authObserver: any;
  spotifyObserver: any;
  spotifyUser: SpotifyUser;

  constructor(private authService: AuthService, private spotifyService: SpotifyService ) {}

  ngOnInit() {
    this.authObserver = this.authService.isLoggedInToSpotify().subscribe( result => {
      this.isSpotifyAuthenticated = result;
      if ( this.isSpotifyAuthenticated ) {
        this.spotifyObserver = this.spotifyService.getMe().subscribe( result => {
          this.spotifyUser = result;
        });
      }
    });
  }
}
