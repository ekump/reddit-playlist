import { MockBackend } from '@angular/http/testing';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SearchService, SpotifyService } from '../services';
import { SpotifyTrack } from '../models';

const SpotifyTrackFactory = require('../../factories/spotify_track_factory').SpotifyTrackFactory;

let posts: Array<string> = [ 'Converge - Jane Doe', 'Michael Jackson - Beat It'];
let http: Http;
let requestOptions = new RequestOptions({});
let backend = new MockBackend();
let spotifyService: SpotifyService;
let searchService: SearchService;

describe('SearchService', () => {
  beforeEach(() => {
    http = new Http(backend, requestOptions);
    spotifyService = new SpotifyService(http);
    searchService = new SearchService(spotifyService);
  });
  describe('searchForSongs', () => {
    it('calls the spotify service for each post', done => {
      let spotifySearchSpy = spyOn(spotifyService, 'search').and.returnValue(Observable.from([[new SpotifyTrack(SpotifyTrackFactory.build())]]));
      searchService.searchForSongs(posts);
      expect(spotifySearchSpy.calls.count()).toBe(2);
      done();
    });
  });
});
