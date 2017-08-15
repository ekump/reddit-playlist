import { Http, RequestOptions, Headers } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../services';

let service: AuthService;
let backend = new MockBackend();
let requestOptions = new RequestOptions({});
let http: Http;

describe('AuthService', () => {
  describe('isLoggedInToSpotify', () => {
    beforeEach(() => {
      http = new Http(backend, requestOptions);
    });

    it('makes an http call to the auth spotify logged-in endpoint when user is logged in to spotify', done => {
      let resp = {
        json () {
          return true;
        },
      };
      let observable = Observable.from([ resp ]);
      spyOn(http, 'get').and.returnValue(observable);
      service = new AuthService(http);

      let authObservable = service.isLoggedInToSpotify();

      authObservable.subscribe(resp => {
        let headers = new Headers({
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: -1,
        });
        let options = new RequestOptions({ headers: headers });

        expect(http.get).toHaveBeenCalledWith(
          '/auth/spotify/logged-in',
          options
        );
        expect(resp).toBe(true);
        done();
      });
    });

    it('makes an http call to the auth logged-in endpoint when user is not logged in', done => {
      let resp = {
        json () {
          return false;
        },
      };
      let observable = Observable.from([ resp ]);
      spyOn(http, 'get').and.returnValue(observable);
      service = new AuthService(http);

      let authObservable = service.isLoggedInToSpotify();

      authObservable.subscribe(resp => {
        let headers = new Headers({
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: -1,
        });
        let options = new RequestOptions({ headers: headers });

        expect(http.get).toHaveBeenCalledWith(
          '/auth/spotify/logged-in',
          options
        );
        expect(resp).toBe(false);
        done();
      });
    });
  });
});
