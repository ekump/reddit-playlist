import { Component, OnInit } from '@angular/core';
import { AuthService, RedditService, SpotifyService } from '../services';
import { SpotifyTrack, SpotifyUser } from '../models';

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
  fetchFromRedditInProgress: boolean = false;
  searchSpotifyInProgress: boolean = false;
  posts: Array<string>;
  getPostsFromSubRedditObserver: any;
  searchSpotifyForSongsObserver: any;
  songs: Array<SpotifyTrack> = [];
  constructor (
    private authService: AuthService,
    private redditService: RedditService,
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
    this.fetchFromRedditInProgress = true;
    this.getPostsFromSubRedditObserver = this.redditService
      .getPostsFromSubReddit(this.subReddit)
      .subscribe(result => {
        this.fetchFromRedditInProgress = false;
        this.posts = result;
        this.searchSpotifyForSongs();
      });
  }
  searchSpotifyForSongs (): void {
    this.searchSpotifyForSongsObserver = this.spotifyService
      .searchForSongs(this.posts)
      .subscribe(results => {
        this.songs = this.songs.concat(results);
      });
  }

  createPlaylist (): void {
    this.spotifyService
      .createPlaylist(this.subReddit, this.songs)
      .subscribe(() => {});
  }

  onChange () {
    this.posts = [];
    this.songs = [];
    this.getPostsFromSubReddit();
  }
}
