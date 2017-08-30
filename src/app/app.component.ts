import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { SubredditInfo } from '../models';
@Component({
  selector: 'reddit-playlist',
  template: require('./app.component.html'),
  styles: [ require('./app.component.scss') ],
})
export class AppComponent implements AfterViewChecked {
  title = 'Reddit Playlist';
  subredditInfo: SubredditInfo = { posts: [], name: '' };
  showProgressBar: boolean = false;
  _subredditInfo: SubredditInfo = { posts: [], name: '' };
  _showProgressBar: boolean = false;
  isSpotifyAuthenticated: boolean = false;
  constructor (private cdRef: ChangeDetectorRef) {}

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
