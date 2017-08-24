import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { AuthService, RedditService, SpotifyService } from '../services';
import { SpotifyTrack, SpotifyPlaylist, SpotifyUser } from '../models';
import { HomeComponent, DialogContent } from './home.component';

import { MdDialog } from '@angular/material';

const SpotifyUserFactory = require('../../factories/spotify_user_factory')
  .SpotifyUserFactory;
const SpotifyTrackFactory = require('../../factories/spotify_track_factory')
  .SpotifyTrackFactory;

const SpotifyPlaylistFactory = require('../../factories/spotify_playlist_factory')
  .SpotifyPlaylistFactory;

fdescribe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;
  let rockMetalSubreddits: Array<string> = [ '/r/blackMetal', '/r/DSBM' ];
  let electronicMusicSubreddits: Array<string> = [ '/r/triphop' ];

  let posts: Array<string> = [
    'Converge - Jane Doe',
    'Michael Jackson - Beat It',
  ];

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

  let authServiceSpy;
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
    authServiceSpy = spyOn(
      injectedAuthService,
      'isLoggedInToSpotify'
    ).and.returnValue(Observable.of(true));
  });

  //describe('template', () => {
  //});

  describe('#ngOnInit', () => {
    it('should set spotifyUser', () => {
      component.ngOnInit();

      expect(component.spotifyUser).toBeDefined();
    });

    it('should set isSpotifyAuthenticated to true when logged in', () => {
      component.ngOnInit();

      expect(component.isSpotifyAuthenticated).toBe(true);
    });

    it('should set isSpotifyAuthenticated to false when logged out', () => {
      authServiceSpy.and.returnValue(Observable.of(false));
      component.ngOnInit();

      expect(component.isSpotifyAuthenticated).toBe(false);
    });
  });

  //describe('clearPostsAndSongs', () => {
  //it('clears current posts', () => {
  //component.posts = [ 'post 1', 'post 2' ];
  //spyOn(component, 'getPostsFromSubreddit').and.returnValue(null);
  //component.clearPostsAndSongs();

  //expect(component.posts).toEqual([]);
  //});
  //it('clears current songs', () => {
  //component.songs = [ SpotifyTrackFactory.build() ];
  //spyOn(component, 'getPostsFromSubreddit').and.returnValue(null);
  //component.clearPostsAndSongs();

  //expect(component.songs).toEqual([]);
  //});
  //});

  describe('#onChange', () => {
    it('calls clearPostsAndSongs', () => {
      spyOn(component, 'clearPostsAndSongs').and.callThrough();
      component.onChange();

      expect(component.clearPostsAndSongs).toHaveBeenCalled();
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
      component.posts = posts;
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
      component.subreddit = 'r/BlackMetal';
      component.songs = [ SpotifyTrackFactory.build() ];
      let createPlaylistSpy = spyOn(
        injectedSpotifyService,
        'createPlaylist'
      ).and.returnValue(Observable.of(SpotifyPlaylistFactory.build()));
      component.createPlaylist();

      expect(createPlaylistSpy).toHaveBeenCalledWith(
        component.subreddit,
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
