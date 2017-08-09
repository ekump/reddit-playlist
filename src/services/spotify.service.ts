import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { SpotifyTrack, SpotifyUser } from '../models';

@Injectable()
export class SpotifyService {
  spotifyUser: SpotifyUser;
  meObservable: Observable<SpotifyUser>;
  searchObservable: Observable<Array<SpotifyTrack>>;
  meEndpoint: string = '/s/v1/me';
  searchEndpoint: string = '/s/v1/search';
  constructor(private http: Http) {}

  getMe(): Observable<SpotifyUser> {
    if (this.spotifyUser) {
      return Observable.from([this.spotifyUser]);
    } else if (this.meObservable) {
      return this.meObservable;
    } else {
      let headers = new Headers({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': -1
      });

      let options = new RequestOptions({ headers: headers });

      this.meObservable = this.http.get(this.meEndpoint, options)
        .map( resp => {
          this.spotifyUser = resp.json();
          return this.spotifyUser;
        });
      return this.meObservable;
    }
  }

  search(redditPost: string): Observable<Array<SpotifyTrack>> {
    let headers = new Headers({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': -1
    });
    let spotifyTracks: Array<SpotifyTrack> = [];
    let searchStrings = redditPost.split('-');
    if (searchStrings.length < 2) {
      return Observable.from([[]]);
    }
    let options = new RequestOptions({ headers: headers });
    let url = this.searchEndpoint + '?q=' + searchStrings[0] + this.sanitizeSongTitle(searchStrings[1]) + '&type=track';
    this.searchObservable = this.http.get(url, options)
      .map( resp => {
        resp.json().tracks.items.forEach( function(item) {
          spotifyTracks.push(new SpotifyTrack(item));
        });
        return spotifyTracks;
      });
    return this.searchObservable;
  }

  sanitizeSongTitle(songTitle: string): string {
    let sanitizedString: string = songTitle
      .replace(/\[.*?\]/g, '')
      .replace(/\(.*?\)/g, '');
    return sanitizedString;
  }
}
