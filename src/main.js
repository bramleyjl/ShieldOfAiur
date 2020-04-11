var setup = require('setup');
var harvest = require('controllers_harvest');

module.exports.loop = function() {
  setup.runConstructors();

  harvest.run();
}
