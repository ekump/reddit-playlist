import { Component, OnInit } from '@angular/core';
import { AuthService, RedditService, SpotifyService } from '../services';
import { SpotifyUser } from '../models';

@Component({
  template: require('./home.component.html')
})

export class HomeComponent implements OnInit  {
  isSpotifyAuthenticated: boolean = false;
  authObserver: any;
  spotifyObserver: any;
  spotifyUser: SpotifyUser;
  subRedditList: Array<string>;
  subReddit: string;
  getSubRedditObserver: any;
  fetchFromRedditInProgress: boolean = false;
  posts: Array<string>;
  getPostsFromSubRedditObserver: any;

  constructor(private authService: AuthService, private redditService: RedditService, private spotifyService: SpotifyService ) {}

  ngOnInit() {
    this.authObserver = this.authService.isLoggedInToSpotify().subscribe( result => {
      this.isSpotifyAuthenticated = result;
      if ( this.isSpotifyAuthenticated ) {
        this.spotifyObserver = this.spotifyService.getMe().subscribe( result => {
          this.spotifyUser = result;
        });
      }
    });
    this.getSubReddits();
  }

  getSubReddits(): void {
    this.getSubRedditObserver = this.redditService.getSubReddits().subscribe( result => {
      this.subRedditList = result;
    });
  }

  getPostsFromSubReddit(): void {
    console.log('attempting to fetch');
    this.fetchFromRedditInProgress = true;
    this.getPostsFromSubRedditObserver = this.redditService.getPostsFromSubReddit(this.subReddit).subscribe( result => {
      this.fetchFromRedditInProgress = false;
      this.posts = result;
    });
  }

  onChange(newValue) {
    this.getPostsFromSubReddit();
  }
}
