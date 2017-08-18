var Factory = require('rosie').Factory;

SpotifyImageFactory = new Factory()
  .sequence('id')
  .attr('href', 'http://example.com/image');

module.exports.SpotifyUserFactory = new Factory()
  .sequence('id')
  .attr('display_name', 'William de Fault')
  .attr('images', function() { return [ SpotifyImageFactory.build() ];});
