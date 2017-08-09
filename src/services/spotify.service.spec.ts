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
      spotifyService = new SpotifyService(http);
    });

    it('returns an observable with the spotify user', done => {
     let resp  = {
        json() {
          return [ SpotifyUserFactory.build() ];
        }
      };
      let observable = Observable.from([resp]);
      spyOn(http, 'get').and.returnValue(observable);
      let getMeObservable = spotifyService.getMe();
      getMeObservable.subscribe((spotifyUser) => {
        expect(spotifyUser).toEqual(spotifyService.spotifyUser);
        done();
      });
    });
  });

  describe('#sanitizeSongTitle', () => {

    it('should strip out parenthesis', () => {
      spotifyService = new SpotifyService(http);
      let actualResult = spotifyService.sanitizeSongTitle('My Bloody Valentine - To Here Knows When (1991)');
      expect(actualResult).toBe('My Bloody Valentine - To Here Knows When');
    });

    it('should strip out brackets', () => {
      spotifyService = new SpotifyService(http);
      let actualResult = spotifyService.sanitizeSongTitle('My Bloody Valentine - To Here Knows When [shoegaze]');
      expect(actualResult).toBe('My Bloody Valentine - To Here Knows When');
    });

    it('should strip out both parenthesis and brackets', () => {
      spotifyService = new SpotifyService(http);
      let actualResult = spotifyService.sanitizeSongTitle('My Bloody Valentine - To Here Knows When (1991) [shoegaze]');
      expect(actualResult).toBe('My Bloody Valentine - To Here Knows When');
    });
  });
});
