import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'reddit-playlist',
  template: require('./app.component.html'),
  styles: [ require('./app.component.scss') ],
})
export class AppComponent implements AfterViewChecked {
  title = 'Reddit Playlist';
  posts: Array<string>;
  showProgressBar: boolean = false;
  _posts: Array<string>;
  _showProgressBar: boolean = false;
  constructor (private cdRef: ChangeDetectorRef) {}

  ngAfterViewChecked () {
    if (this.posts != this._posts) {
      this.posts = this._posts;
    }

    if (this.showProgressBar != this._showProgressBar) {
      this.showProgressBar = this._showProgressBar;
    }
    this.cdRef.detectChanges();
  }

  onSubredditPostsChange (event) {
    this._posts = event;
  }

  onProgressBarStatusChange (event) {
    this._showProgressBar = event;
  }
}
