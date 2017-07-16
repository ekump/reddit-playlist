import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { AuthService, SpotifyService } from '../services';
import { HomeComponent } from './home.component';

const SpotifyUserFactory = require('../../factories/spotify_user_factory').SpotifyUserFactory;

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;
  let validLogin: boolean = false;

  let mockedAuthService = {
    isLoggedInToSpotify() {
      return Observable.from([validLogin]);
    }
  };
  let mockedSpotifyService = {
    getMe(): Observable<SpotifyUser> {
      return Observable.from([ SpotifyUserFactory.build() ]);
    };
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent
      ],
      imports: [
        HttpModule
      ],
      providers: [
        { provide: AuthService, useValue: mockedAuthService },
        { provide: SpotifyService, useValue: mockedSpotifyService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
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
  });

  describe('#ngOnInit', () => {
    it('should set spotifyUser', () => {
      component.isSpotifyAuthenticated = true;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.spotifyUser).toBeDefined();
    });
  });

});
