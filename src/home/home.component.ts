import { Component, Input, OnInit, Optional } from '@angular/core';
import { AuthService, SpotifyService } from '../services';
import { SpotifyTrack, SpotifyUser } from '../models';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'home',
  template: require('./home.component.html'),
  styles: [ require('./home.component.scss') ],
})
export class HomeComponent implements OnInit {
  isSpotifyAuthenticated: boolean = false;
  authObserver: any;
  spotifyObserver: any;
  spotifyUser: SpotifyUser;
  showProgressBar: boolean = false;
  @Input() posts: Array<string>;
  @Input() subreddit: string;
  searchSpotifyForSongsObserver: any;
  songs: Array<SpotifyTrack> = [];
  constructor (
    private authService: AuthService,
    private spotifyService: SpotifyService,
    private _dialog: MdDialog
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

  searchSpotifyForSongs (): void {
    this.showProgressBar = true;
    this.searchSpotifyForSongsObserver = this.spotifyService
      .searchForSongs(this.posts)
      .subscribe(
        results => {
          this.songs = results;
          this.showProgressBar = false;
        },
        err => {
          if (err.status === 401) {
            this.openDialog();
          }
        }
      );
  }

  createPlaylist (): void {
    this.showProgressBar = true;
    this.spotifyService
      .createPlaylist(this.subreddit, this.songs)
      .subscribe(() => {
        this.showProgressBar = false;
      });
  }

  clearPostsAndSongs (): void {
    this.posts = [];
    this.songs = [];
  }

  onGenreChange () {
    this.clearPostsAndSongs();
  }

  onChange () {
    this.clearPostsAndSongs();
  }

  openDialog () {
    let dialogRef = this._dialog.open(DialogContent);

    dialogRef.afterClosed().subscribe(() => {
      this.authService.redirectForSpotifyLogin();
    });
  }
}

@Component({
  template: `
    <p>You have been logged out of spotify. Please try again<p>
    <p> <button md-button (click)="dialogRef.close()">CLOSE</button> </p>
  `,
})
export class DialogContent {
  constructor (@Optional() public dialogRef: MdDialogRef<DialogContent>) {}
}
