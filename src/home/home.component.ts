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
  subredditList: Array<string>;
  subreddit: string;
  category: string;
  subredditCategories: Array<string> = [ 'Hot', 'Top', 'New', 'Rising' ];
  subredditPostCount: number;
  subredditPostCounts: Array<number> = [ 20, 50, 100 ];
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
        this.subredditList = result;
      });
  }

  getPostsFromSubReddit (): void {
    if (this.subreddit) {
      this.showProgressBar = true;
      this.getPostsFromSubRedditObserver = this.redditService
        .getPostsFromSubReddit(
          this.subreddit,
          this.category || 'hot',
          this.subredditPostCount || 20
        )
        .subscribe(result => {
          this.showProgressBar = false;
          this.posts = result;
          this.searchSpotifyForSongs();
        });
    }
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

  onChange () {
    this.posts = [];
    this.songs = [];
    //if(this.subreddit) {
    this.getPostsFromSubReddit();
    //}
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
