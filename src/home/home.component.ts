import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Optional,
  Output,
} from '@angular/core';
import { AuthService, SpotifyService } from '../services';
import { SpotifyTrack, SpotifyUser, SubredditInfo } from '../models';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'home',
  template: require('./home.component.html'),
  styles: [ require('./home.component.scss') ],
})
export class HomeComponent implements OnChanges {
  @Output()
  progressBarStatusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  isSpotifyAuthenticated: boolean = false;
  authObserver: any;
  spotifyObserver: any;
  spotifyUser: SpotifyUser;
  @Input() subredditInfo: SubredditInfo;
  searchSpotifyForSongsObserver: any;
  songs: Array<SpotifyTrack> = [];
  constructor (
    private authService: AuthService,
    private spotifyService: SpotifyService,
    private _dialog: MdDialog
  ) {}

  ngOnChanges () {
    if (this.subredditInfo.posts && this.subredditInfo.posts.length > 0) {
      this.searchSpotifyForSongs();
    }
  }

  searchSpotifyForSongs (): void {
    this.progressBarStatusChange.emit(true);
    this.searchSpotifyForSongsObserver = this.spotifyService
      .searchForSongs(this.subredditInfo.posts)
      .subscribe(
        results => {
          this.songs = results;
          this.progressBarStatusChange.emit(false);
        },
        err => {
          if (err.status === 401) {
            this.openDialog();
          }
        }
      );
  }

  createPlaylist (): void {
    this.progressBarStatusChange.emit(true);
    this.spotifyService
      .createPlaylist(this.subredditInfo.name, this.songs)
      .subscribe(() => {
        this.progressBarStatusChange.emit(false);
      });
  }

  clearSongs (): void {
    this.songs = [];
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
