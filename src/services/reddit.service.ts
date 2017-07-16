import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RedditService {
  subReddits: any;
  observable: Observable<any> = null;
  subRedditListEndpoint: string = '/r/r/music/wiki/musicsubreddits.json';
  constructor(private http: Http) {}

  getSubReddits(): Observable<any> {
    if (this.subReddits) {
      return Observable.from([this.subReddits]);
    } else if (this.observable) {
      return this.observable;
    } else {
      let headers = new Headers({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': -1
      });

      let options = new RequestOptions({ headers: headers });

      this.observable = this.http.get(this.subRedditListEndpoint, options)
        .map( resp => {
          this.subReddits = this.parseSubReddits(resp.json());
          return this.subReddits;
        });
      return this.observable;
    }
  };

  parseSubReddits( redditResponse: any): Array<string> {
    let parsedResponse: Array<string> = [];
    let currentGenre: string;
    for (let line of redditResponse.data.content_md.split('\n')) {
      let genreIndex = line.indexOf('##');
      if ( genreIndex === 0 ) {
        currentGenre = line.substring(genreIndex + 2).trim();
      } else if ( currentGenre === 'Rock/Metal') {
        let rIndex = line.indexOf('\/r\/');
        let starIndex = line.indexOf('\*');
        if ((starIndex === 0) && (rIndex > 0)) {
          let parsedLine = line.substring(rIndex).split(' ')[0];
          parsedResponse.push(parsedLine);
        }
      }
    }
    return parsedResponse;
  }
}
