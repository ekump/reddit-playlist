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
  describe('#searchForSongs', () => {
    it('calls the spotify service for each post', done => {
      let spotifySearchSpy = spyOn(spotifyService, 'search').and.returnValue(Observable.of([new SpotifyTrack(SpotifyTrackFactory.build())]));
      searchService.searchForSongs(posts);
      expect(spotifySearchSpy.calls.count()).toBe(2);
      done();
    });
  });

  describe('#matchSearchResults', () => {
    it('matches a post to a spotify track that has been returned as part of the search', done => {
      let spotifyTracks = [new SpotifyTrack(SpotifyTrackFactory.build())];
      let post = 'Test Artist - Test Track'
      let actualSpotifyTracks = searchService.matchSearchResults(post, spotifyTracks);

      expect(actualSpotifyTracks.length).toBe(1);
      expect(actualSpotifyTracks[0].name).toBe(spotifyTracks[0].name);
      done();
    });

    it('matches when post has spaces or different capitalization', done => {
      let spotifyTracks = [new SpotifyTrack(SpotifyTrackFactory.build())];
      let post = 'Test arTist - Test TRAck   '
      let actualSpotifyTracks = searchService.matchSearchResults(post, spotifyTracks);

      expect(actualSpotifyTracks.length).toBe(1);
      expect(actualSpotifyTracks[0].name).toBe(spotifyTracks[0].name);
      done();
    });

    it('rejects tracks where song title matches but artist does not', done => {
      let spotifyTracks = [new SpotifyTrack(SpotifyTrackFactory.build())];
      let post = 'Galaxie 500 - Test Track'
      let actualSpotifyTracks = searchService.matchSearchResults(post, spotifyTracks);

      expect(actualSpotifyTracks.length).toBe(0);
      done();
    });
  });
});
