var lib = require('lib_lib');
var game = require('models_game');
var room = require('models_room');
var creep = require('models_creep');
var structure = require('models_structure');
var structureSpawn = require('models_structureSpawn');

var setup = {
  runConstructors: function() {
    extendClasses();
    buildWorkforce();
  }
}

module.exports = setup;

function extendClasses() {
    game.extendGame();
    room.extendRoom();
    creep.extendCreep();
    structure.extendStructure();
    structureSpawn.extendStructureSpawn();
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