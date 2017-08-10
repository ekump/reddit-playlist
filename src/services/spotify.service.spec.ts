import { Http, RequestOptions, Headers } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Rx';
import { SpotifyService } from '../services';

const SpotifyUserFactory = require('../../factories/spotify_user_factory').SpotifyUserFactory;

let spotifyService: SpotifyService;
let backend = new MockBackend();
let requestOptions = new RequestOptions({});
let http: Http;

describe('SpotifyService', () => {
  beforeEach(() => {
    http = new Http(backend, requestOptions);
    spotifyService = new SpotifyService(http);
  });

  describe('#getMe', () => {
    it('returns an observable with the spotify user', done => {
     let resp  = {
        json() {
          return [ SpotifyUserFactory.build() ];
        }
      };
      let observable = Observable.of(resp);
      spyOn(http, 'get').and.returnValue(observable);
      let getMeObservable = spotifyService.getMe();
      getMeObservable.subscribe((spotifyUser) => {
        expect(spotifyUser).toEqual(spotifyService.spotifyUser);
        done();
      });
    });
  });

  describe('#search', () => {
    it('should return empty observable if redditPost cannot be split', (done) => {
      let searchObservable = spotifyService.search('nosplithappening');
      searchObservable.subscribe((resp) => {
        expect(resp.length).toBe(0);
        done();
      });
    });

    it('should call the spotify search endpoint with the correct query params', (done) => {
      let resp  = {
        json() {
          return  { 'tracks': { 'items': [] }} ;
        }
      };

      let observable = Observable.of(resp);
      spyOn(http, 'get').and.returnValue(observable);
      let searchObservable = spotifyService.search('Fugazi - Merchandise');
      searchObservable.subscribe( () => {
        let headers = new Headers({
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': -1
        });
        let options = new RequestOptions({ headers: headers });
        expect(http.get).toHaveBeenCalledWith('/s/v1/search?q=Fugazi Merchandise&type=track', options);
        done();
      });
    });

    it('returns an observable with spotify tracks', done => {
      let resp  = {
        json() {
          return  { 'tracks': { 'items': [
            { 'album': {'name': 'Repeater' },
              'artists': [ { 'name': 'Fugazi' } ],
              'name': 'Merchandise',
              'external_urls': { 'spotify': 'spotify_external_url' }
            } ] }};
        }
      };

      let observable = Observable.of(resp);
      spyOn(http, 'get').and.returnValue(observable);
      let searchObservable = spotifyService.search('Fugazi - Merchandise');
      searchObservable.subscribe((resp) => {
        expect(resp[0].artists[0].name).toBe('Fugazi');
        expect(resp[0].album.name).toBe('Repeater');
        expect(resp[0].name).toBe('Merchandise');
        expect(resp[0].external_urls.spotify).toBe('spotify_external_url');
        done();
      });
    });
  });

  describe('#sanitizeSongTitle', () => {
    it('should strip out parenthesis', () => {
      let actualResult = spotifyService.sanitizeSongTitle('My Bloody Valentine - To Here Knows When (1991)');
      expect(actualResult).toBe('My Bloody Valentine - To Here Knows When');
    });

    it('should strip out brackets', () => {
      let actualResult = spotifyService.sanitizeSongTitle('My Bloody Valentine - To Here Knows When [shoegaze]');
      expect(actualResult).toBe('My Bloody Valentine - To Here Knows When');
    });

    it('should strip out both parenthesis and brackets', () => {
      let actualResult = spotifyService.sanitizeSongTitle('My Bloody Valentine - To Here Knows When (1991) [shoegaze]');
      expect(actualResult).toBe('My Bloody Valentine - To Here Knows When');
    });
  });
});
