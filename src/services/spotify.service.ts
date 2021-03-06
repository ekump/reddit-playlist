import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { SpotifyTrack, SpotifyUser, SpotifyPlaylist } from '../models';

const Rx = require('rxjs');

@Injectable()
export class SpotifyService {
  spotifyUser: SpotifyUser;
  meObservable: Observable<SpotifyUser>;
  searchObservables: any = [];
  createPlaylistObservable: Observable<SpotifyPlaylist>;
  songs: Array<SpotifyTrack> = [];
  playlist: SpotifyPlaylist;
  meEndpoint: string = '/s/v1/me';
  searchEndpoint: string = '/s/v1/search';
  constructor (private http: Http) {}

  getMe (): Observable<SpotifyUser> {
    if (this.spotifyUser) {
      return Observable.of(this.spotifyUser);
    } else if (this.meObservable) {
      return this.meObservable;
    } else {
      let headers = new Headers({
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: -1,
      });

      let options = new RequestOptions({ headers: headers });

      this.meObservable = this.http.get(this.meEndpoint, options).map(resp => {
        this.spotifyUser = resp.json();
        return this.spotifyUser;
      });
      return this.meObservable;
    }
  }

  createPlaylist (
    subReddit: string,
    songs: Array<SpotifyTrack>
  ): Observable<SpotifyPlaylist> {
    let createPlaylistEndpoint: string = `/s/v1/users/${this.spotifyUser
      .id}/playlists`;
    let headers = new Headers({
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: -1,
      'content-type': 'application/json',
    });
    let requestBody = { name: `Reddit Playlist - ${subReddit}` };
    let options = new RequestOptions({ headers: headers });
    this.createPlaylistObservable = this.http
      .post(createPlaylistEndpoint, requestBody, options)
      .map(resp => {
        return resp.json();
      })
      .flatMap(resp => {
        let addSongsToPlaylistEndpoint: string = `${createPlaylistEndpoint}/${resp.id}/tracks`;
        let requestBody = {
          uris: songs.map(function (s){
            return s.uri;
          }),
        };
        return this.http
          .post(addSongsToPlaylistEndpoint, requestBody, options)
          .map(resp => {
            return resp.json();
          });
      });
    return this.createPlaylistObservable;
  }

  searchForSongs (posts: Array<string>): Observable<Array<SpotifyTrack>> {
    if (posts.length < 1) {
      return Observable.of([]);
    }
    this.searchObservables = [];
    posts.forEach(
      function (post){
        let searchObservable = this.search(post).map(resp => {
          let results: Array<SpotifyTrack> = resp;
          let matchedResults = this.matchSearchResults(post, results);
          if (matchedResults.length > 1) {
            return matchedResults.sort(function (a, b){
              return b.popularity - a.popularity;
            })[0];
          } else {
            return matchedResults[0];
          }
        });
        this.searchObservables.push(searchObservable);
      }.bind(this)
    );
    return Rx.Observable.forkJoin(this.searchObservables).map(resp => {
      return resp.filter(function (r){
        return r !== undefined;
      });
    });
  }

  search (redditPost: string): Observable<Array<SpotifyTrack>> {
    let headers = new Headers({
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: -1,
    });
    let spotifyTracks: Array<SpotifyTrack> = [];
    let searchStrings = redditPost.split('-');
    if (searchStrings.length < 2) {
      return Observable.of([]);
    }
    let options = new RequestOptions({ headers: headers });
    let url =
      this.searchEndpoint +
      '?q=' +
      searchStrings[0] +
      this.sanitizeSongTitle(searchStrings[1]) +
      '&type=track';
    let searchObservable = this.http.get(url, options).map(resp => {
      resp.json().tracks.items.forEach(function (item){
        spotifyTracks.push(item);
      });
      return spotifyTracks;
    });
    return searchObservable;
  }

  sanitizeSongTitle (songTitle: string): string {
    let sanitizedString: string = songTitle
      .replace(/\[.*?\]/g, '')
      .replace(/\(.*?\)/g, '');
    return sanitizedString.trim();
  }

  matchSearchResults (
    post: string,
    spotifyTracks: Array<SpotifyTrack>
  ): Array<SpotifyTrack> {
    let splitPost = post.split('-');
    let matchedSpotifyTracks: Array<SpotifyTrack> = [];
    spotifyTracks.forEach(function (spotifyTrack){
      if (
        splitPost[1]
          .trim()
          .toLowerCase()
          .indexOf(spotifyTrack.name.toLowerCase()) > -1
      ) {
        if (
          spotifyTrack.artists.filter(artist => {
            return (
              artist.name.toLowerCase() === splitPost[0].trim().toLowerCase()
            );
          }).length > 0
        ) {
          matchedSpotifyTracks.push(spotifyTrack);
        }
      }
    });
    return matchedSpotifyTracks;
  }
}
