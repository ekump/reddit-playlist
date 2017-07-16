import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

const CONFIG = require('../../config');

@Injectable()
export class AuthService {
  hasToken: boolean = false;
  authEndpoint: string = '/auth/spotify/logged-in';

  constructor(private http: Http ) {}

  isLoggedInToSpotify(): Observable<boolean> {
    let headers = new Headers({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': -1
    });
    let options = new RequestOptions({ headers: headers });

    let observable = Observable.create(observer => {
      this.http.get(this.authEndpoint, options).subscribe((resp) => {
        this.hasToken = resp.json();
        observer.next(this.hasToken);
        observer.complete();
      },
      (err) => {
        observer.next(false);
        observer.complete();
      });
    });
    return observable;
  }
}
