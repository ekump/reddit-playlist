import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { AuthService, SpotifyService } from '../services';
import { SpotifyTrack, SpotifyPlaylist, SpotifyUser } from '../models';
import { AppHeaderComponent } from './app-header.component';

const SpotifyUserFactory = require('../../factories/spotify_user_factory')
  .SpotifyUserFactory;
const SpotifyTrackFactory = require('../../factories/spotify_track_factory')
  .SpotifyTrackFactory;

const SpotifyPlaylistFactory = require('../../factories/spotify_playlist_factory')
  .SpotifyPlaylistFactory;

describe('AppHeaderComponent', () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;
  let debugElement: DebugElement;
  let injectedSpotifyService: any;
  let injectedAuthService: any;

  let mockedAuthService = {
    isLoggedInToSpotify () {
      return Observable.of(true);
    },
    redirectForSpotifyLogin () {},
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
      declarations: [ AppHeaderComponent ],
      imports: [ HttpModule, FormsModule ],
      providers: [
        { provide: AuthService, useValue: mockedAuthService },
        { provide: SpotifyService, useValue: mockedSpotifyService },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    });

    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    injectedSpotifyService = TestBed.get(SpotifyService);
    injectedAuthService = TestBed.get(AuthService);
    authServiceSpy = spyOn(
      injectedAuthService,
      'isLoggedInToSpotify'
    ).and.returnValue(Observable.of(true));
  });

  describe('template', () => {
    it('has the correct heading', () => {
      debugElement = fixture.debugElement.query(By.css('.app-heading'));

      expect(debugElement.nativeElement.textContent).toContain(
        'Reddit Playlist Generator'
      );
    });

    it('displays the spotify user display name when logged in', done => {
      component.spotifyUser = SpotifyUserFactory.build();
      fixture.detectChanges();
      debugElement = fixture.debugElement.query(
        By.css('.spotify-logged-in-status')
      );

      expect(debugElement.nativeElement.textContent).toContain(
        'William de Fault'
      );
      done();
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
});
