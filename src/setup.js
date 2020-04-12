var lib = require('lib_lib');
var game = require('models_game');
var room = require('models_room');
var roomObject = require('models_roomObject');
var creep = require('models_creep');
var structure = require('models_structure');
var structureSpawn = require('models_structureSpawn');

PathFinder.use(true);

var setup = {
  runConstructors: function() {
    extendClasses();
    buildRoom();
  }
}

module.exports = setup;

function extendClasses() {
    game.extendGame();
    room.extendRoom();
    roomObject.extendRoomObject();
    creep.extendCreep();
    structure.extendStructure();
    structureSpawn.extendStructureSpawn();
}

function buildRoom() {
    var currentRoom = lib.getCurrentRoom();
    currentRoom.resources = {
        energy: currentRoom.find(FIND_SOURCES_ACTIVE),
        dropped: currentRoom.find(FIND_DROPPED_RESOURCES),
        minerals: currentRoom.find(FIND_MINERALS)
    };
    currentRoom.workforce = {
        roster: []
    };
    for (var creepKey in Game.creeps) {
      currentRoom.workforce.roster.push(creepKey);
    }
}