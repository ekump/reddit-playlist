var Factory = require('rosie').Factory;

module.exports.SpotifyUserFactory = new Factory()
  .sequence('id')
  .attr('display_name', 'William de Fault');
