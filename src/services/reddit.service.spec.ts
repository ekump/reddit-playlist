import { Http, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Rx';
import { RedditService } from '../services';

let redditService: RedditService;
let backend = new MockBackend();
let requestOptions = new RequestOptions({});
let http: Http;

describe('RedditService', () => {
  describe('#getSubReddits', () => {
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

  describe('#getPostsFromSubReddit', () => {
    beforeEach(() => {
      http = new Http(backend, requestOptions);
    });

    it('returns an observable with an array of posts ', done => {
      let resp  = {
        json() {
          let data = {};
          data['data'] = {};
          data['data']['children'] = {};
          data['data']['children']['data'] = {};
          data['data']['children']['data']['title'] = 'Test Title';
          data['data']['children']['data']['media'] = 'Test Media';
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
});
