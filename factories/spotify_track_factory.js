var Factory = require('rosie').Factory;

SpotifyExternalUrlsFactory = new Factory()
  .sequence('id')
  .attr('spotify', 'http://example.com/spotify_external_url');

SpotifyArtistFactory = new Factory()
  .sequence('id')
  .attr('name', 'Test Artist')
  .attr('href', 'http://example.com/artist_href')
  .attr('external_urls', function() { return SpotifyExternalUrlsFactory.build();});

SpotifyAlbumFactory = new Factory()
  .sequence('id')
  .attr('name', 'Test Album')
  .attr('href', 'http://example.com/album_href');

module.exports.SpotifyTrackFactory = new Factory()
  .sequence('id')
  .attr('artists', function() { return [SpotifyArtistFactory.build()];})
  .attr('album', function() { return SpotifyAlbumFactory.build();})
  .attr('external_urls', function() { return SpotifyExternalUrlsFactory.build();})
  .attr('name', 'Test Track')
  .attr('preview_url', 'http://example.com/preview_url')
  .attr('href', 'http://example.com/track_href');
