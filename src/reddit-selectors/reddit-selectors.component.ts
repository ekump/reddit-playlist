import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RedditService } from '../services';
import { SubredditInfo, SpotifyTrack, SpotifyUser } from '../models';

@Component({
  selector: 'reddit-selectors',
  template: require('./reddit-selectors.component.html'),
  styles: [ require('./reddit-selectors.component.scss') ],
})
export class RedditSelectorsComponent implements OnInit {
  @Output()
  subredditPostChange: EventEmitter<SubredditInfo> = new EventEmitter<
    SubredditInfo
  >();

  @Output()
  progressBarStatusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() isSpotifyAuthenticated: boolean;

  spotifyObserver: any;
  spotifyUser: SpotifyUser;
  genre: string = 'Rock/Metal';
  genres: Array<string>;
  fullSubCollection: Map<string, Array<string>>;
  subredditList: Array<string>;
  subreddit: string;
  category: string;
  subredditCategories: Array<string> = [
    'Hot',
    'New',
    'Rising',
    'Controversial',
    'Top',
    'Gilded',
  ];
  subredditPostCount: number;
  subredditPostCounts: Array<number> = [ 20, 30, 40, 50 ];
  getSubRedditObserver: any;
  getPostsFromSubredditObserver: any;
  songs: Array<SpotifyTrack> = [];
  constructor (private redditService: RedditService) {}

  ngOnInit () {
    this.getSubReddits();
  }

  getSubReddits (): void {
    this.getSubRedditObserver = this.redditService
      .getSubReddits()
      .subscribe(result => {
        this.subredditList = result[this.genre];
        this.fullSubCollection = result;
        this.genres = Object.keys(result);
      });
  }

  getPostsFromSubreddit (): void {
    if (this.subreddit) {
      this.progressBarStatusChange.emit(true);
      this.getPostsFromSubredditObserver = this.redditService
        .getPostsFromSubreddit(
          this.subreddit,
          this.category || 'hot',
          this.subredditPostCount || 20
        )
        .subscribe(result => {
          this.subredditPostChange.emit({
            posts: result,
            name: this.subreddit,
          });
          this.progressBarStatusChange.emit(false);
        });
    }
  }

  clearPosts (): void {
    this.subredditPostChange.emit({ posts: [], name: '' });
  }

  onGenreChange () {
    this.clearPosts();
    this.subredditList = this.fullSubCollection[this.genre];
  }

  onChange () {
    console.log('we are in on change for some reason');
    this.clearPosts();
    this.getPostsFromSubreddit();
  }
}
