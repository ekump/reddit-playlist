import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeComponent, DialogContent } from '../home/home.component';
import { AuthService, SpotifyService } from '../services';
import { SpotifyTrack, SpotifyPlaylist, SpotifyUser } from '../models';
import { MdDialog } from '@angular/material';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let homeFixture: ComponentFixture<HomeComponent>;

  let posts: Array<string> = [
    'Converge - Jane Doe',
    'Michael Jackson - Beat It',
  ];

  const SpotifyUserFactory = require('../../factories/spotify_user_factory')
    .SpotifyUserFactory;
  const SpotifyTrackFactory = require('../../factories/spotify_track_factory')
    .SpotifyTrackFactory;

  const SpotifyPlaylistFactory = require('../../factories/spotify_playlist_factory')
    .SpotifyPlaylistFactory;

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

  let mockedMdDialog = {
    open (dialogContent: DialogContent) {
      return {
        afterClosed: function (){
          return Observable.of(dialogContent);
        },
      };
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent, HomeComponent ],
      imports: [ HttpModule, FormsModule ],
      providers: [
        { provide: AuthService, useValue: mockedAuthService },
        { provide: SpotifyService, useValue: mockedSpotifyService },
        { provide: MdDialog, useValue: mockedMdDialog },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    });
    homeFixture = TestBed.createComponent(HomeComponent);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  describe('#ngOnInit', () => {
    it('should set posts', () => {});
  });
});
