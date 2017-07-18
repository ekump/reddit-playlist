import { Http, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Rx';
import { RedditService } from '../services';

let redditService: RedditService;
let backend = new MockBackend();
let requestOptions = new RequestOptions({});
let http: Http;

describe('RedditService', () => {
  describe('getSubReddits', () => {
    beforeEach(() => {
      http = new Http(backend, requestOptions);
    });

    it('returns an observable with an array of subreddits ', done => {
      let resp  = {
        json() {
          let data = {};
          data['data'] = {};
          data['data']['content_md'] = "##Rock/Metal\n* /r/blackMetal";
          return data;
        }
      };
      let observable = Observable.from([resp]);
      spyOn(http, 'get').and.returnValue(observable);
      redditService = new RedditService(http);
      let getSubRedditsObservable = redditService.getSubReddits();
      getSubRedditsObservable.subscribe((response) => {
        expect(response).toEqual(redditService.subReddits);
        done();
      });
    });
  });

  describe('getPostsFromSubReddit', () => {
    beforeEach(() => {
      http = new Http(backend, requestOptions);
    });

    it('returns an observable with an array of posts ', done => {
      let resp  = {
        json() {
          let data = { 'data': { 'children': [{ 'data': { 'title': 'Test Title', 'media': 'Test Media' }}]}};
          return data;
        }
      };
      let observable = Observable.from([resp]);
      spyOn(http, 'get').and.returnValue(observable);
      redditService = new RedditService(http);
      let getPostsFromSubRedditObservable = redditService.getPostsFromSubReddit('/r/blackMetal');
      getPostsFromSubRedditObservable.subscribe((response) => {
        expect(response).toEqual(redditService.songs);
        done();
      });
    });
  });

  describe('parsePosts', () => {
    it('correctly parses subReddit for post title when media is present', () => {
      let data = { 'data': { 'children': [
        { 'data': { 'title': 'Trap Them - Slumcult & Gather', 'media': 'Test Media' }},
        { 'data': { 'title': 'Portishead - Roads', 'media': 'Also Test Media' }},
        { 'data': { 'title': 'Gorgoroth - Prayer' }}
        ]}};

      let actualResult = redditService.parsePosts(data);

      expect(actualResult).toBeDefined();
      expect(actualResult.length).toBe(2);
      expect(actualResult[0]).toEqual('Trap Them - Slumcult & Gather');
      expect(actualResult[1]).toEqual('Portishead - Roads');
    });
  });

  describe('parseSubReddits', () => {
    let data = { 'data': { 'content_md': '##Rock/Metal\n* /r/metal\n* /r/DSBM\n##Electronic\n* /r/triphop\nJust a genric message with a /r/flirpFlop in it' }};

    it('correctly parses subreddits (temporarily) limited to rock/metal', () => {
      let actualResult = redditService.parseSubReddits(data);

      expect(actualResult).toBeDefined();
      expect(actualResult.length).toBe(2);
      expect(actualResult[0]).toEqual('/r/metal');
      expect(actualResult[1]).toEqual('/r/DSBM');
    });
  });
});
