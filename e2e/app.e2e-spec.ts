import { RedditPlaylistPage } from './app.po';

describe('reddit-playlist App', function() {
  let page: RedditPlaylistPage;

  beforeEach(() => {
    page = new RedditPlaylistPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
