import { Http, RequestOptions, Headers } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Rx';

import { AuthService, WindowService } from '../services';

let service: AuthService;
let backend = new MockBackend();
let requestOptions = new RequestOptions({});
let http: Http;
let windowService: WindowService;

class MockWindowService {
  mockWindow = {
    location: {
      href: '',
    },
  };

  getWindow () {
    return this.mockWindow;
  }
}

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
      service = new AuthService(http, windowService);

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
      service = new AuthService(http, windowService);

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
  describe('redirectForSpotifyLogin', () => {
    it('sets the window location to the auth endpoint for re-auth with spotify', () => {
      let mockWindowService: MockWindowService = new MockWindowService();
      spyOn(mockWindowService, 'getWindow').and.callThrough();
      service = new AuthService(http, mockWindowService);
      service.redirectForSpotifyLogin();
      expect(mockWindowService.getWindow).toHaveBeenCalled();

      let expectedRedirect: string = '/auth/spotify';

      expect(mockWindowService.mockWindow.location.href).toBe(expectedRedirect);
    });
  });
});
