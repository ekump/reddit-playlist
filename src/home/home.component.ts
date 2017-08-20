import { Component, OnInit, Optional } from '@angular/core';
import { AuthService, RedditService, SpotifyService } from '../services';
import { SpotifyTrack, SpotifyUser } from '../models';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  template: require('./home.component.html'),
  styles: [ require('./home.component.scss') ],
})
export class HomeComponent implements OnInit {
  isSpotifyAuthenticated: boolean = false;
  authObserver: any;
  spotifyObserver: any;
  spotifyUser: SpotifyUser;
  subRedditList: Array<string>;
  subReddit: string;
  getSubRedditObserver: any;
  showProgressBar: boolean = false;
  posts: Array<string>;
  getPostsFromSubRedditObserver: any;
  searchSpotifyForSongsObserver: any;
  songs: Array<SpotifyTrack> = [];
  constructor (
    private authService: AuthService,
    private redditService: RedditService,
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
    this.getSubReddits();
  }

  getSubReddits (): void {
    this.getSubRedditObserver = this.redditService
      .getSubReddits()
      .subscribe(result => {
        this.subRedditList = result;
      });
  }

  getPostsFromSubReddit (): void {
    this.showProgressBar = true;
    this.getPostsFromSubRedditObserver = this.redditService
      .getPostsFromSubReddit(this.subReddit)
      .subscribe(result => {
        this.showProgressBar = false;
        this.posts = result;
        this.searchSpotifyForSongs();
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
          if (err.status === '401') {
            this.openDialog();
          }
        }
      );
  }

  createPlaylist (): void {
    this.showProgressBar = true;
    this.spotifyService
      .createPlaylist(this.subReddit, this.songs)
      .subscribe(() => {
        this.showProgressBar = false;
      });
  }

  onChange () {
    this.posts = [];
    this.songs = [];
    this.getPostsFromSubReddit();
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
