var lib = require('lib_lib');
var room = require('models_room');
var creep = require('models_creep');

var setup = {
  runConstructors: function() {
    extendClasses();
    buildWorkforce();
  }
}

module.exports = setup;

function extendClasses() {
    room.extendRoom();
    creep.extendCreep();
}

function buildWorkforce() {
    var currentRoom = lib.getCurrentRoom();
    currentRoom.workforce = {
        roster: []
    };
    for (var creepKey in Game.creeps) {
      currentRoom.workforce.roster.push(creepKey);
    }
}