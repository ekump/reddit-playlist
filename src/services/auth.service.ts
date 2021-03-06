import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { WindowService } from '../services/window.service';

@Injectable()
export class AuthService {
  authEndpoint: string = '/auth/spotify/logged-in';

  constructor (private http: Http, private windowService: WindowService) {}

  isLoggedInToSpotify (): Observable<boolean> {
    let headers = new Headers({
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: -1,
    });
    let options = new RequestOptions({ headers: headers });
    let observable = this.http.get(this.authEndpoint, options).map(resp => {
      return resp.json() as boolean;
    });
    return observable;
  }
  redirectForSpotifyLogin (): void {
    this.windowService.getWindow().location.href = '/auth/spotify';
  }
}
