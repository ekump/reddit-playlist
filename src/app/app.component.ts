import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SpotifyUser, SubredditInfo } from '../models';
import { AuthService, SpotifyService } from '../services';
@Component({
  selector: 'reddit-playlist',
  template: require('./app.component.html'),
  styles: [ require('./app.component.scss') ],
})
export class AppComponent implements AfterViewChecked, OnInit {
  title = 'Reddit Playlist';
  subredditInfo: SubredditInfo = { posts: [], name: '' };
  showProgressBar: boolean = false;
  _subredditInfo: SubredditInfo = { posts: [], name: '' };
  _showProgressBar: boolean = false;
  isSpotifyAuthenticated: boolean = false;
  spotifyUser: SpotifyUser;
  constructor (
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit () {
    this.authService.isLoggedInToSpotify().subscribe(result => {
      this.isSpotifyAuthenticated = result;
      if (this.isSpotifyAuthenticated) {
        this.spotifyService.getMe().subscribe(result => {
          this.spotifyUser = result;
        });
      }
    });
  }

  ngAfterViewChecked () {
    if (this.subredditInfo.posts !== this._subredditInfo.posts) {
      this.subredditInfo = this._subredditInfo;
    }

    if (this.showProgressBar !== this._showProgressBar) {
      this.showProgressBar = this._showProgressBar;
    }
    this.cdRef.detectChanges();
  }

  onSubredditPostsChange (event) {
    this._subredditInfo = event;
  }

  onProgressBarStatusChange (event) {
    this._showProgressBar = event;
  }
}
