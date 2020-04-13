var setup = require('setup');
var harvest = require('controllers_harvest');
var manufacture = require('controllers_manufacture');
var upgrade = require('controllers_upgrade');

module.exports.loop = function() {
  setup.runConstructors();

  harvest.run();
  manufacture.run();
  upgrade.run();
}
