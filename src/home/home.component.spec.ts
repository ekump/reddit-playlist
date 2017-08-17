import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { AuthService, RedditService, SpotifyService } from '../services';
import { SpotifyTrack, SpotifyPlaylist, SpotifyUser } from '../models';
import { HomeComponent } from './home.component';

const SpotifyUserFactory = require('../../factories/spotify_user_factory')
  .SpotifyUserFactory;
const SpotifyTrackFactory = require('../../factories/spotify_track_factory')
  .SpotifyTrackFactory;

const SpotifyPlaylistFactory = require('../../factories/spotify_playlist_factory')
  .SpotifyPlaylistFactory;

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;
  let validLogin: boolean = false;
  let subReddits: Array<string> = [ '/r/blackMetal', '/r/DSBM' ];
  let posts: Array<string> = [
    'Converge - Jane Doe',
    'Michael Jackson - Beat It',
  ];
  let injectedSpotifyService: any;

  let mockedAuthService = {
    isLoggedInToSpotify () {
      return Observable.of(validLogin);
    },
  };

  let mockedRedditService = {
    getPostsFromSubReddit () {
      return Observable.from([ posts ]);
    },
    getSubReddits (): Observable<Array<string>> {
      return Observable.from([ subReddits ]);
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
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    injectedSpotifyService = TestBed.get(SpotifyService);
  });

  describe('template', () => {
    it('has the correct heading', () => {
      debugElement = fixture.debugElement.query(By.css('.app-heading'));

      expect(debugElement.nativeElement.textContent).toContain(
        'Reddit Playlist Generator'
      );
    });

    it('displays the spotify user display name when logged in', () => {
      component.spotifyUser = SpotifyUserFactory.build();
      fixture.detectChanges();
      debugElement = fixture.debugElement.query(
        By.css('.spotify-logged-in-status')
      );

      expect(debugElement.nativeElement.textContent).toContain(
        'William de Fault'
      );
    });

    it('displays progress indicator', () => {
      component.showProgressBar = true;
      fixture.detectChanges();
      debugElement = fixture.debugElement.query(By.css('.app-progress'));

      expect(debugElement).not.toBeNull();

      component.showProgressBar = false;
      fixture.detectChanges();
      debugElement = fixture.debugElement.query(By.css('.app-progress'));

      expect(debugElement).toBeNull();
    });
  });

  describe('#ngOnInit', () => {
    it('should set spotifyUser', () => {
      validLogin = true;
      component.ngOnInit();

      expect(component.spotifyUser).toBeDefined();
    });

    it('should set isSpotifyAuthenticated to true when logged in', () => {
      validLogin = true;
      component.ngOnInit();

      expect(component.isSpotifyAuthenticated).toBe(true);
    });

    it('should set isSpotifyAuthenticated to false when logged out', () => {
      validLogin = false;
      component.ngOnInit();

      expect(component.isSpotifyAuthenticated).toBe(false);
    });

    it('should call #getSubReddits', () => {
      spyOn(component, 'getSubReddits').and.callThrough();
      component.ngOnInit();

      expect(component.getSubReddits).toHaveBeenCalled();
    });
  });
  describe('#onChange', () => {
    it('calls getPostsFromSubReddit', () => {
      spyOn(component, 'getPostsFromSubReddit').and.callThrough();
      component.onChange();

      expect(component.getPostsFromSubReddit).toHaveBeenCalled();
    });
    it('clears current posts', () => {
      component.posts = [ 'post 1', 'post 2' ];
      spyOn(component, 'getPostsFromSubReddit').and.returnValue(null);
      component.onChange();

      expect(component.posts).toEqual([]);
    });
    it('clears current songs', () => {
      component.songs = [ SpotifyTrackFactory.build() ];
      spyOn(component, 'getPostsFromSubReddit').and.returnValue(null);
      component.onChange();

      expect(component.songs).toEqual([]);
    });
  });

  describe('#searchSpotifyForSongs', () => {
    it('calls the search service and sets songs', () => {
      let returnArray: Array<SpotifyTrack> = [
        <SpotifyTrack>SpotifyTrackFactory.build(),
      ];
      let posts: Array<string> = [ 'post 1', 'post 2' ];

      spyOn(injectedSpotifyService, 'searchForSongs').and.returnValue(
        Observable.from([ returnArray ])
      );
      component.posts = posts;
      component.searchSpotifyForSongs();

      expect(injectedSpotifyService.searchForSongs).toHaveBeenCalled();
    });
  });

  describe('#getSubReddits', () => {
    it('sets list of subReddits', () => {
      component.getSubReddits();
      expect(component.subRedditList).toEqual(subReddits);
    });
  });

  describe('#getPostsFromSubReddit', () => {
    it('sets list of posts', () => {
      component.getPostsFromSubReddit();
      expect(component.posts).toEqual(posts);
    });
  });

  describe('#createPlaylist', () => {
    it('calls spotifyService.createPlaylist with correct parameters', () => {
      component.subReddit = 'r/BlackMetal';
      component.songs = [ SpotifyTrackFactory.build() ];
      let createPlaylistSpy = spyOn(
        injectedSpotifyService,
        'createPlaylist'
      ).and.returnValue(Observable.of(SpotifyPlaylistFactory.build()));
      component.createPlaylist();
      expect(createPlaylistSpy).toHaveBeenCalledWith(
        component.subReddit,
        component.songs
      );
    });
  });
});
