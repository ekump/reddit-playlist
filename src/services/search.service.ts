import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/merge';
import { SpotifyTrack } from '../models';
import { SpotifyService } from '../services/spotify.service';

const Rx = require('rxjs');

@Injectable()
export class SearchService {
  searchObservables: any = [];
  songs: any = [];
  constructor(private spotifyService: SpotifyService) {}

  searchForSongs(posts: Array<string>): Observable<Array<SpotifyTrack>> {
    posts.forEach(function(post) {
      let searchObservable = this.spotifyService.search(post)
      .map( resp => {
        let results: Array<SpotifyTrack> = resp;
        return this.matchSearchResults(post, results);
      });
    this.searchObservables.push(searchObservable);
    }.bind(this));
    return Rx.Observable.merge(...this.searchObservables);
  }

  matchSearchResults(post: string, spotifyTracks: Array<SpotifyTrack>): Array<SpotifyTrack> {
    let splitPost = post.split('-');
    let matchedSpotifyTracks: Array<SpotifyTrack> = [];
    spotifyTracks.forEach(function(spotifyTrack) {
      if (splitPost[1].trim().toLowerCase().indexOf(spotifyTrack.name.toLowerCase()) > -1) {
          if (spotifyTrack.artists.filter((artist) => {
            return artist.name.toLowerCase() === splitPost[0].trim().toLowerCase();
        }).length > 0) {
          matchedSpotifyTracks.push(spotifyTrack);
        }
      }
    });
    return matchedSpotifyTracks;
  }
}
