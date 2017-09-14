import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService, RedditService, SpotifyService } from '../services';
import {
  SpotifyTrack,
  SpotifyPlaylist,
  SpotifyUser,
  SubredditInfo,
} from '../models';
import { HomeComponent, DialogContent } from './home.component';

import { MdDialog } from '@angular/material';

const SpotifyUserFactory = require('../../factories/spotify_user_factory')
  .SpotifyUserFactory;
const SpotifyTrackFactory = require('../../factories/spotify_track_factory')
  .SpotifyTrackFactory;

const SpotifyPlaylistFactory = require('../../factories/spotify_playlist_factory')
  .SpotifyPlaylistFactory;

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let rockMetalSubreddits: Array<string> = [ '/r/blackMetal', '/r/DSBM' ];
  let electronicMusicSubreddits: Array<string> = [ '/r/triphop' ];

  let posts: Array<string> = [
    'Converge - Jane Doe',
    'Michael Jackson - Beat It',
  ];
  let subredditInfo: SubredditInfo = { name: '/r/le_test', posts: posts };
  let fullSubCollection: Map<string, Array<string>> = new Map<
    string,
    Array<string>
  >();
  fullSubCollection['Rock/Metal'] = rockMetalSubreddits;
  fullSubCollection['Electronic music'] = electronicMusicSubreddits;

  let injectedSpotifyService: any;
  let injectedAuthService: any;
  let injectedRedditService: any;

  let mockedAuthService = {
    isLoggedInToSpotify () {
      return Observable.of(true);
    },
    redirectForSpotifyLogin () {},
  };

  let mockedRedditService = {
    getPostsFromSubreddit () {
      return Observable.of(posts);
    },
    getSubReddits (): Observable<Map<string, Array<string>>> {
      return Observable.of(fullSubCollection);
    },
  };

  let mockedMdDialog = {
    open (dialogContent: DialogContent) {
      return {
        afterClosed: function (){
          return Observable.of(dialogContent);
        },
      };
    },
  };

  let mockedSpotifyService = {
    getMe (): Observable<SpotifyUser> {
      return Observable.of(SpotifyUserFactory.build());
    },
    searchForSongs (): Observable<Array<SpotifyTrack>> {
      return Observable.of(SpotifyTrackFactory.build());
    },
    createPlaylist (): Observable<SpotifyPlaylist> {
      return Observable.of(SpotifyPlaylistFactory.build());
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [ HttpModule, FormsModule ],
      providers: [
        { provide: AuthService, useValue: mockedAuthService },
        { provide: RedditService, useValue: mockedRedditService },
        { provide: SpotifyService, useValue: mockedSpotifyService },
        { provide: MdDialog, useValue: mockedMdDialog },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    injectedSpotifyService = TestBed.get(SpotifyService);
    injectedAuthService = TestBed.get(AuthService);
    injectedRedditService = TestBed.get(RedditService);
  });

  describe('#ngOnChanges', () => {
    it('calls searchSpotifyForSongs when subreddit post info updates', () => {
      component.subredditInfo = subredditInfo;
      spyOn(component, 'searchSpotifyForSongs').and.returnValue([]);
      component.ngOnChanges();

      expect(component.searchSpotifyForSongs).toHaveBeenCalled();
    });

    it('does not call searchSpotifyForSongs when subreddit post is empty', () => {
      component.subredditInfo = { name: '', posts: [] };
      spyOn(component, 'searchSpotifyForSongs').and.returnValue([]);
      component.ngOnChanges();

      expect(component.searchSpotifyForSongs).not.toHaveBeenCalled();
    });
  });

  describe('clearSongs', () => {
    it('clears current songs', () => {
      component.songs = [ SpotifyTrackFactory.build() ];
      component.clearSongs();

      expect(component.songs).toEqual([]);
    });
  });

  describe('#searchSpotifyForSongs', () => {
    let searchForSongsSpy;
    let posts;
    beforeEach(() => {
      let returnArray: Array<SpotifyTrack> = [
        <SpotifyTrack>SpotifyTrackFactory.build(),
      ];
      posts = [ 'post 1', 'post 2' ];

      searchForSongsSpy = spyOn(
        injectedSpotifyService,
        'searchForSongs'
      ).and.returnValue(Observable.of(returnArray));
      spyOn(component, 'openDialog').and.callThrough();
      component.subredditInfo = subredditInfo;
    });

    it('calls the search service and sets songs', () => {
      component.searchSpotifyForSongs();

      expect(injectedSpotifyService.searchForSongs).toHaveBeenCalled();
    });

    it('alerts the user to login to spotify if a 401 error is received', () => {
      searchForSongsSpy.and.returnValue(Observable.throw({ status: 401 }));
      component.searchSpotifyForSongs();

      expect(component.openDialog).toHaveBeenCalled();
    });

    it('does not alert the user to login to spotify if other error is received', () => {
      searchForSongsSpy.and.returnValue(Observable.throw({ status: 501 }));
      component.searchSpotifyForSongs();

      expect(component.openDialog).not.toHaveBeenCalled();
    });
  });

  describe('#createPlaylist', () => {
    it('calls spotifyService.createPlaylist with correct parameters', () => {
      component.subredditInfo = { posts: posts, name: 'r/BlackMetal' };
      component.songs = [ SpotifyTrackFactory.build() ];
      let createPlaylistSpy = spyOn(
        injectedSpotifyService,
        'createPlaylist'
      ).and.returnValue(Observable.of(SpotifyPlaylistFactory.build()));
      component.createPlaylist();

      expect(createPlaylistSpy).toHaveBeenCalledWith(
        component.subredditInfo.name,
        component.songs
      );
    });
  });
  describe('openDialog', () => {
    it('calls authService.redirectForSpotifyLogin method', () => {
      let authServiceSpy = spyOn(
        injectedAuthService,
        'redirectForSpotifyLogin'
      ).and.callThrough();
      component.openDialog();

      expect(authServiceSpy).toHaveBeenCalled();
    });
  });
});

describe('DialogContent', () => {
  it('has a constructor', () => {
    let param: any;
    let dialog = new DialogContent(param);

    expect(dialog).not.toBeNull();
  });
});
