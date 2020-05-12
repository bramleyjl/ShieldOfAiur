var setup = require('setup');
var harvest = require('controllers_harvest');
var manufacture = require('controllers_manufacture');
var build = require('controllers_build');
var cleanup = require('cleanup');
var defense = require('controllers_defense');

module.exports.loop = function() {
  setup.runConstructors();
  defense.run();
  harvest.run();
  manufacture.run();
  build.run();
  cleanup.run();
}
