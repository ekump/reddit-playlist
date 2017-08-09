import { Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Rx';
import { SpotifyService } from '../services';

const SpotifyUserFactory = require('../../factories/spotify_user_factory').SpotifyUserFactory;

let spotifyService: SpotifyService;
let backend = new MockBackend();
let requestOptions = new RequestOptions({});
let http: Http;

describe('SpotifyService', () => {
  describe('#getMe', () => {
    beforeEach(() => {
      http = new Http(backend, requestOptions);
    });

    it('returns an observable with the spotify user', done => {
     let resp  = {
        json() {
          return [ SpotifyUserFactory.build() ];
        }
      };
      let observable = Observable.from([resp]);
      spyOn(http, 'get').and.returnValue(observable);
      spotifyService = new SpotifyService(http);
      let getMeObservable = spotifyService.getMe();
      getMeObservable.subscribe((spotifyUser) => {
        expect(spotifyUser).toEqual(spotifyService.spotifyUser);
        done();
      });
    });
  });
});
