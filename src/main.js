var setup = require('setup');
var harvest = require('controllers_harvest');
var manufacture = require('controllers_manufacture');
var build = require('controllers_build');

module.exports.loop = function() {
  setup.runConstructors();

  harvest.run();
  manufacture.run();
  build.run();
}
