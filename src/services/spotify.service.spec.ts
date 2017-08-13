import { Http, RequestOptions, Headers } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Rx';
import { SpotifyService } from '../services';
import { SpotifyTrack } from '../models';

const SpotifyUserFactory = require('../../factories/spotify_user_factory').SpotifyUserFactory;
const SpotifyTrackFactory = require('../../factories/spotify_track_factory').SpotifyTrackFactory;

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
    it('returns an observable with a cached spotify user', (done) => {
      spyOn(http, 'get').and.callThrough();
      spotifyService.spotifyUser = SpotifyUserFactory.build();
      let getMeObservable = spotifyService.getMe();
      getMeObservable.subscribe((spotifyUser) => {
        expect(spotifyUser).toEqual(spotifyService.spotifyUser);
        expect(http.get).not.toHaveBeenCalled();
        done();
      });
    });
    it('returns an observable with an existing observable if request already in progress ', (done) => {
      spyOn(http, 'get').and.callThrough();
      spotifyService.meObservable = Observable.of(SpotifyUserFactory.build());
      let getMeObservable = spotifyService.getMe();
      getMeObservable.subscribe( () => {
        expect(http.get).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('#searchForSongs', () => {
    let posts: Array<string> = [ 'Converge - Jane Doe', 'Michael Jackson - Beat It'];

    it('calls the spotify service for each post', (done) => {
      let spotifySearchSpy = spyOn(spotifyService, 'search').and.returnValue(Observable.of([new SpotifyTrack(SpotifyTrackFactory.build())]));
      let searchObservable = spotifyService.searchForSongs(posts);
      searchObservable.subscribe( () => {
        expect(spotifySearchSpy.calls.count()).toBe(2);
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

  describe('#matchSearchResults', () => {
    it('matches a post to a spotify track that has been returned as part of the search', done => {
      let spotifyTracks = [new SpotifyTrack(SpotifyTrackFactory.build())];
      let post = 'Test Artist - Test Track'
      let actualSpotifyTracks = spotifyService.matchSearchResults(post, spotifyTracks);

      expect(actualSpotifyTracks.length).toBe(1);
      expect(actualSpotifyTracks[0].name).toBe(spotifyTracks[0].name);
      done();
    });

    it('matches when post has spaces or different capitalization', done => {
      let spotifyTracks = [new SpotifyTrack(SpotifyTrackFactory.build())];
      let post = 'Test arTist - Test TRAck   '
      let actualSpotifyTracks = spotifyService.matchSearchResults(post, spotifyTracks);

      expect(actualSpotifyTracks.length).toBe(1);
      expect(actualSpotifyTracks[0].name).toBe(spotifyTracks[0].name);
      done();
    });

    it('rejects tracks where song title matches but artist does not', done => {
      let spotifyTracks = [new SpotifyTrack(SpotifyTrackFactory.build())];
      let post = 'Galaxie 500 - Test Track'
      let actualSpotifyTracks = spotifyService.matchSearchResults(post, spotifyTracks);

      expect(actualSpotifyTracks.length).toBe(0);
      done();
    });
  });
});
