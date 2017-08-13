import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { AuthService, RedditService, SpotifyService } from '../services';
import { SpotifyTrack, SpotifyUser } from '../models';
import { HomeComponent } from './home.component';

const SpotifyUserFactory = require('../../factories/spotify_user_factory').SpotifyUserFactory;
const SpotifyTrackFactory = require('../../factories/spotify_track_factory').SpotifyTrackFactory;

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;
  let validLogin: boolean = false;
  let subReddits: Array<string> =[ '/r/blackMetal', '/r/DSBM' ];
  let posts: Array<string> = [ 'Converge - Jane Doe', 'Michael Jackson - Beat It'];
  let injectedSpotifyService: any;


  let mockedAuthService = {
    isLoggedInToSpotify() {
      return Observable.of(validLogin);
    }
  };

  let mockedRedditService = {
    getPostsFromSubReddit() {
      return Observable.from([posts]);
    },
    getSubReddits(): Observable<Array<string>> {
      return Observable.from([subReddits]);
    }
  };

  let mockedSpotifyService = {
    getMe(): Observable<SpotifyUser> {
      return Observable.from([ SpotifyUserFactory.build() ]);
    },
    searchForSongs(): Observable<Array<SpotifyTrack>> {
      return Observable.from([ SpotifyTrackFactory.build() ]);
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent
      ],
      imports: [
        HttpModule,
        FormsModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockedAuthService },
        { provide: RedditService, useValue: mockedRedditService },
        { provide: SpotifyService, useValue: mockedSpotifyService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    injectedSpotifyService = TestBed.get(SpotifyService);
  });

  describe('template', () => {
    it('has the correct heading', () => {
      debugElement = fixture.debugElement.query(By.css('.redditPlaylist'));

      expect(debugElement.nativeElement.textContent).toContain('reddit playlist');
    });

    it('displays the spotify user display name when logged in', () => {
      component.spotifyUser = SpotifyUserFactory.build();
      fixture.detectChanges();
      debugElement = fixture.debugElement.query(By.css('.spotify-logged-in-status'));

      expect(debugElement.nativeElement.textContent).toContain('William de Fault');
    });

    it('displays correct satus when fetchFromRedditInProgress', () => {
      component.subReddit = '/r/test';
      component.fetchFromRedditInProgress = true;
      fixture.detectChanges();
      debugElement = fixture.debugElement.query(By.css('.current-status'));

      expect(debugElement.nativeElement.textContent).toContain('Attempting to fetch songs for /r/test');

      component.subReddit = '/r/test';
      component.fetchFromRedditInProgress = false;
      fixture.detectChanges();
      debugElement = fixture.debugElement.query(By.css('.current-status'));

      expect(debugElement).toBeNull();
    });

    it('displays correct status when searchSpotifyInProgress', () => {
      component.subReddit = '/r/test';
      component.searchSpotifyInProgress = true;
      fixture.detectChanges();
      debugElement = fixture.debugElement.query(By.css('.current-status'));

      expect(debugElement.nativeElement.textContent).toContain('Searching spotify for songs posted in /r/test');

      component.subReddit = '/r/test';
      component.searchSpotifyInProgress = false;
      fixture.detectChanges();
      debugElement = fixture.debugElement.query(By.css('.current-status'));

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
  });

  describe('#searchSpotifyForSongs', () => {
    it('calls the search service and sets songs', () => {
      let returnArray: Array<SpotifyTrack> = [new SpotifyTrack(SpotifyTrackFactory.build())];
      let posts: Array<string> = ['post 1', 'post 2'];

      spyOn(injectedSpotifyService, 'searchForSongs').and.returnValue(Observable.from([returnArray]));
      component.posts = posts;
      component.searchSpotifyForSongs();

      expect(injectedSpotifyService.searchForSongs).toHaveBeenCalled();
      //expect(component.songs).toEqual(returnArray);
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
});
