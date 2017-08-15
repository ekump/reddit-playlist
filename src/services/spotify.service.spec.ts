import { Http, RequestOptions, Headers } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Rx';
import { SpotifyService } from '../services';
import { SpotifyTrack, SpotifyPlaylist } from '../models';

const SpotifyUserFactory = require('../../factories/spotify_user_factory')
  .SpotifyUserFactory;
const SpotifyTrackFactory = require('../../factories/spotify_track_factory')
  .SpotifyTrackFactory;

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
      let resp = {
        json () {
          return [ SpotifyUserFactory.build() ];
        },
      };
      let observable = Observable.of(resp);
      spyOn(http, 'get').and.returnValue(observable);
      let getMeObservable = spotifyService.getMe();
      getMeObservable.subscribe(spotifyUser => {
        expect(spotifyUser).toEqual(spotifyService.spotifyUser);
        done();
      });
    });
    it('returns an observable with a cached spotify user', done => {
      spyOn(http, 'get').and.callThrough();
      spotifyService.spotifyUser = SpotifyUserFactory.build();
      let getMeObservable = spotifyService.getMe();
      getMeObservable.subscribe(spotifyUser => {
        expect(spotifyUser).toEqual(spotifyService.spotifyUser);
        expect(http.get).not.toHaveBeenCalled();
        done();
      });
    });
    it('returns an observable with an existing observable if request already in progress', done => {
      spyOn(http, 'get').and.callThrough();
      spotifyService.meObservable = Observable.of(SpotifyUserFactory.build());
      let getMeObservable = spotifyService.getMe();
      getMeObservable.subscribe(() => {
        expect(http.get).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('#createPlaylist', () => {
    let createObservable: Observable<SpotifyPlaylist>;
    let createPlaylistSpy;
    let headers: Headers;
    let options: RequestOptions;
    let spotifyTracks: Array<SpotifyTrack>;
    beforeEach(() => {
      let resp = {
        json () {
          return {
            id: '123',
            name: 'created_playlist',
            uri: 'a_test_uri',
            snapshot_id: 'snapshot123',
          };
        },
      };

      let observable = Observable.of(resp);
      createPlaylistSpy = spyOn(http, 'post').and.returnValue(observable);
      spotifyService.spotifyUser = SpotifyUserFactory.build({ id: 'meUser' });
      spotifyTracks = [
        SpotifyTrackFactory.build({ uri: '123' }),
        SpotifyTrackFactory.build({ uri: '456' }),
      ];
      createObservable = spotifyService.createPlaylist(
        'r/blackMetal',
        spotifyTracks
      );
      headers = new Headers({
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: -1,
        'content-type': 'application/json',
      });
      options = new RequestOptions({ headers: headers });
    });
    it('should call the spotify create playlist endpoint with the correct parameters', done => {
      let createRequestBody = { name: 'Reddit Playlist - r/blackMetal' };
      let addTracksRequestBody = {
        uris: spotifyTracks.map(function (s){
          return s.uri;
        }),
      };
      console.log('addTracksRequestBody: ', addTracksRequestBody);
      createObservable.subscribe(() => {
        expect(createPlaylistSpy.calls.count()).toBe(2);
        expect(createPlaylistSpy).toHaveBeenCalledWith(
          '/s/v1/users/meUser/playlists',
          createRequestBody,
          options
        );
        expect(createPlaylistSpy.calls.mostRecent().args).toEqual([
          '/s/v1/users/meUser/playlists/123/tracks',
          addTracksRequestBody,
          options,
        ]);
        done();
      });
    });
  });

  describe('#searchForSongs', () => {
    let posts: Array<string> = [
      'Converge - Jane Doe',
      'Michael Jackson - Beat It',
    ];

    it('calls the spotify service for each post', done => {
      let spotifySearchSpy = spyOn(spotifyService, 'search').and.returnValue(
        Observable.of([ <SpotifyTrack>SpotifyTrackFactory.build() ])
      );
      let searchObservable = spotifyService.searchForSongs(posts);
      searchObservable.subscribe(() => {
        expect(spotifySearchSpy.calls.count()).toBe(2);
        done();
      });
    });
  });

  describe('#search', () => {
    it('should return empty observable if redditPost cannot be split', done => {
      let searchObservable = spotifyService.search('nosplithappening');
      searchObservable.subscribe(resp => {
        expect(resp.length).toBe(0);
        done();
      });
    });

    it('should call the spotify search endpoint with the correct query params', done => {
      let resp = {
        json () {
          return { tracks: { items: [] } };
        },
      };

      let observable = Observable.of(resp);
      spyOn(http, 'get').and.returnValue(observable);
      let searchObservable = spotifyService.search('Fugazi - Merchandise');
      searchObservable.subscribe(() => {
        let headers = new Headers({
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: -1,
        });
        let options = new RequestOptions({ headers: headers });
        expect(http.get).toHaveBeenCalledWith(
          '/s/v1/search?q=Fugazi Merchandise&type=track',
          options
        );
        done();
      });
    });

    it('returns an observable with spotify tracks', done => {
      let resp = {
        json () {
          return {
            tracks: {
              items: [
                {
                  album: { name: 'Repeater' },
                  artists: [ { name: 'Fugazi' } ],
                  name: 'Merchandise',
                  external_urls: { spotify: 'spotify_external_url' },
                },
              ],
            },
          };
        },
      };

      let observable = Observable.of(resp);
      spyOn(http, 'get').and.returnValue(observable);
      let searchObservable = spotifyService.search('Fugazi - Merchandise');
      searchObservable.subscribe(resp => {
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
      let actualResult = spotifyService.sanitizeSongTitle(
        'My Bloody Valentine - To Here Knows When (1991)'
      );
      expect(actualResult).toBe('My Bloody Valentine - To Here Knows When');
    });

    it('should strip out brackets', () => {
      let actualResult = spotifyService.sanitizeSongTitle(
        'My Bloody Valentine - To Here Knows When [shoegaze]'
      );
      expect(actualResult).toBe('My Bloody Valentine - To Here Knows When');
    });

    it('should strip out both parenthesis and brackets', () => {
      let actualResult = spotifyService.sanitizeSongTitle(
        'My Bloody Valentine - To Here Knows When (1991) [shoegaze]'
      );
      expect(actualResult).toBe('My Bloody Valentine - To Here Knows When');
    });
  });

  describe('#matchSearchResults', () => {
    it('matches a post to a spotify track that has been returned as part of the search', done => {
      let spotifyTracks = [ <SpotifyTrack>SpotifyTrackFactory.build() ];
      let post = 'Test Artist - Test Track';
      let actualSpotifyTracks = spotifyService.matchSearchResults(
        post,
        spotifyTracks
      );

      expect(actualSpotifyTracks.length).toBe(1);
      expect(actualSpotifyTracks[0].name).toBe(spotifyTracks[0].name);
      done();
    });

    it('matches when post has spaces or different capitalization', done => {
      let spotifyTracks = [ <SpotifyTrack>SpotifyTrackFactory.build() ];
      let post = 'Test arTist - Test TRAck   ';
      let actualSpotifyTracks = spotifyService.matchSearchResults(
        post,
        spotifyTracks
      );

      expect(actualSpotifyTracks.length).toBe(1);
      expect(actualSpotifyTracks[0].name).toBe(spotifyTracks[0].name);
      done();
    });

    it('rejects tracks where song title matches but artist does not', done => {
      let spotifyTracks = [ <SpotifyTrack>SpotifyTrackFactory.build() ];
      let post = 'Galaxie 500 - Test Track';
      let actualSpotifyTracks = spotifyService.matchSearchResults(
        post,
        spotifyTracks
      );

      expect(actualSpotifyTracks.length).toBe(0);
      done();
    });
  });
});
