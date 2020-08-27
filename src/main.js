var setup = require("setup");
var harvest = require("controllers.harvest");
var manufacture = require("controllers.manufacture");
var build = require("controllers.build");
var cleanup = require("cleanup");
var defense = require("controllers.defense");

module.exports.loop = function () {
  setup.runConstructors();
  defense.run();
  harvest.run();
  manufacture.run();
  build.run();
  cleanup.run();
};
