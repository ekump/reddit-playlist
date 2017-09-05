import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { RedditService } from '../services';
import { RedditSelectorsComponent } from './reddit-selectors.component';

describe('RedditSelectorsComponent', () => {
  let component: RedditSelectorsComponent;
  let fixture: ComponentFixture<RedditSelectorsComponent>;
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

  let injectedRedditService: any;

  let mockedRedditService = {
    getPostsFromSubreddit () {
      return Observable.of(posts);
    },
    getSubReddits (): Observable<Map<string, Array<string>>> {
      return Observable.of(fullSubCollection);
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ RedditSelectorsComponent ],
      imports: [ HttpModule, FormsModule ],
      providers: [ { provide: RedditService, useValue: mockedRedditService } ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    });

    fixture = TestBed.createComponent(RedditSelectorsComponent);
    component = fixture.componentInstance;
    injectedRedditService = TestBed.get(RedditService);
  });

  //describe('template', () => {
  //it('displays the subreddit category select', () => {
  //fixture.detectChanges();
  //debugElement = fixture.debugElement.query(
  //By.css('.subreddit-select.post-category-select')
  //);
  //let placeholder = debugElement.nativeElement.getAttribute('placeholder');

  //expect(placeholder).toBe('Choose Category');
  //});

  //it('displays the subreddit post count select', () => {
  //fixture.detectChanges();
  //debugElement = fixture.debugElement.query(
  //By.css('.subreddit-select.post-count-select')
  //);
  //let placeholder = debugElement.nativeElement.getAttribute('placeholder');

  //expect(placeholder).toBe('Choose Size');
  //});
  //});

  describe('#ngOnInit', () => {
    it('should call #getSubReddits', () => {
      spyOn(component, 'getSubReddits').and.callThrough();
      component.ngOnInit();

      expect(component.getSubReddits).toHaveBeenCalled();
    });
  });

  describe('#onGenreChange', () => {
    beforeEach(() => {
      component.fullSubCollection = fullSubCollection;
    });
    it('calls clearPosts', () => {
      spyOn(component, 'clearPosts').and.callThrough();
      component.onGenreChange();

      expect(component.clearPosts).toHaveBeenCalled();
    });

    it('sets subredditList to the correct genre list', () => {
      component.genre = 'Electronic music';
      component.onGenreChange();

      expect(component.subredditList).toEqual(electronicMusicSubreddits);
    });
  });

  describe('clearPosts', () => {
    it('clears current posts', () => {
      spyOn(component.subredditPostChange, 'emit').and.callThrough();
      component.clearPosts();

      expect(component.subredditPostChange.emit).toHaveBeenCalledWith({
        posts: [],
        name: '',
      });
    });
  });

  describe('#onChange', () => {
    it('calls getPostsFromSubreddit', () => {
      spyOn(component, 'getPostsFromSubreddit').and.callThrough();
      component.onChange();

      expect(component.getPostsFromSubreddit).toHaveBeenCalled();
    });

    it('calls clearPosts', () => {
      spyOn(component, 'clearPosts').and.callThrough();
      component.onChange();

      expect(component.clearPosts).toHaveBeenCalled();
    });
  });

  describe('#getSubReddits', () => {
    it('sets list of subreddits, defaulted to rock/metal', () => {
      component.getSubReddits();
      expect(component.subredditList).toEqual(rockMetalSubreddits);
    });

    it('sets list of subreddits, for genre', () => {
      component.genre = 'Electronic music';
      component.getSubReddits();

      expect(component.subredditList).toEqual(electronicMusicSubreddits);
    });

    it('populates genres', () => {
      component.getSubReddits();

      expect(component.genres).toEqual([ 'Rock/Metal', 'Electronic music' ]);
    });
  });

  describe('#getPostsFromSubreddit', () => {
    let getPostsFromSubredditSpy;
    beforeEach(() => {
      getPostsFromSubredditSpy = spyOn(
        injectedRedditService,
        'getPostsFromSubreddit'
      ).and.callThrough();
    });

    it('sets list of posts', () => {
      spyOn(component.subredditPostChange, 'emit').and.callThrough();
      component.subreddit = '/r/hardcore';
      component.getPostsFromSubreddit();
      expect(component.subredditPostChange.emit).toHaveBeenCalledWith({
        name: '/r/hardcore',
        posts: posts,
      });
    });

    it('does not sets list of posts when sub not selected', () => {
      spyOn(component.subredditPostChange, 'emit').and.callThrough();

      component.getPostsFromSubreddit();

      expect(component.subredditPostChange.emit).not.toHaveBeenCalled();
    });

    it('sets defaults for category and count if none provided by user', () => {
      component.subreddit = '/r/hardcore';
      component.getPostsFromSubreddit();

      expect(getPostsFromSubredditSpy).toHaveBeenCalledWith(
        '/r/hardcore',
        'hot',
        20
      );
    });

    it('sets category and count if provided', () => {
      component.subreddit = '/r/hardcore';
      component.subredditPostCount = 50;
      component.category = 'rising';
      component.getPostsFromSubreddit();

      expect(getPostsFromSubredditSpy).toHaveBeenCalledWith(
        '/r/hardcore',
        'rising',
        50
      );
    });
  });
});
