import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { SpotifyUser } from '../models';

@Injectable()
export class SpotifyService {
  spotifyUser: SpotifyUser;
  observable: Observable<SpotifyUser>;
  meEndpoint: string = '/s/v1/me';
  constructor(private http: Http) {}

  getMe(): Observable<SpotifyUser> {
    if (this.spotifyUser) {
      return Observable.from([this.spotifyUser]);
    } else if (this.observable) {
      return this.observable;
    } else {
      let headers = new Headers({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': -1
      });

      let options = new RequestOptions({ headers: headers });

      this.observable = this.http.get(this.meEndpoint, options)
        .map( resp => {
          this.spotifyUser = resp.json();
          return this.spotifyUser;
        });
      return this.observable;
    }
  }
}
