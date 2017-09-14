import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RedditService {
  subReddits: any;
  observable: Observable<any>;
  subRedditListEndpoint: string = '/r/r/music/wiki/musicsubreddits.json';
  songs: any;
  constructor (private http: Http) {}

  getSubReddits (): Observable<any> {
    if (this.subReddits) {
      return Observable.from([ this.subReddits ]);
    } else if (this.observable) {
      return this.observable;
    } else {
      let headers = new Headers({
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: -1,
      });

      let options = new RequestOptions({ headers: headers });

      this.observable = this.http
        .get(this.subRedditListEndpoint, options)
        .map(resp => {
          this.subReddits = this.parseSubReddits(resp.json());
          return this.subReddits;
        });
      return this.observable;
    }
  }

  getPostsFromSubreddit (
    subReddit: string,
    category: string,
    count: number
  ): Observable<any> {
    let headers = new Headers({
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: -1,
    });

    let options = new RequestOptions({ headers: headers });

    this.observable = this.http
      .get(
        '/r' +
          subReddit +
          '/' +
          category.toLowerCase() +
          '/.json?limit=' +
          count,
        options
      )
      .map(resp => {
        console.log('resp.json: ', resp.json());
        this.songs = this.parsePosts(resp.json());
        return this.songs;
      });
    return this.observable;
  }

  parsePosts (redditResponse: any): Array<string> {
    let parsedResponse: Array<string> = [];
    for (let post of redditResponse.data.children) {
      if (post.data && post.data.title && post.data.media) {
        parsedResponse.push(post.data.title);
      }
    }
    return parsedResponse;
  }

  parseSubReddits (redditResponse: any): Map<string, Array<string>> {
    let genreWhiteList: Array<string> = [
      'Classical music',
      'Electronic music',
      'Rock/Metal',
      'Indie',
      'Other',
      'Hip-hop',
      'Some decades',
      'By country/region/culture',
      'Any genre',
      'Redditor-made music',
      'Single artist/band subreddits',
    ];
    let parsedResponse: Map<string, Array<string>> = new Map<
      string,
      Array<string>
    >();
    let currentGenre: string = '';
    for (let line of redditResponse.data.content_md.split('\n')) {
      let genreIndex = line.indexOf('##');
      if (genreIndex === 0) {
        currentGenre = line.substring(genreIndex + 2).trim();
        if (genreWhiteList.indexOf(currentGenre) >= 0) {
          parsedResponse[currentGenre] = new Array<string>();
        }
      } else if (genreWhiteList.indexOf(currentGenre) >= 0) {
        let rIndex = line.indexOf('/r/');
        let starIndex = line.indexOf('*');
        if (starIndex === 0 && rIndex > 0) {
          let parsedLine = line.substring(rIndex).split(' ')[0];
          parsedResponse[currentGenre].push(parsedLine);
        }
      }
    }
    return parsedResponse;
  }
}
