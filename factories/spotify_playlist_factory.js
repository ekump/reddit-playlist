var Factory = require('rosie').Factory;

module.exports.SpotifyPlaylistFactory = new Factory()
.attr('id', '123')
.attr('name', 'test_playlist_name')
.attr('uri', 'test_playlist_uri')
.attr('snapshort_id', 'test_playlist_snapshot_id');
