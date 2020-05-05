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
        roster: {
            basic: [],
            claimer: [],
            energyHarvester: [],
            transporter: [],
            builder: [],
        },
        actionCount: {},
        creepCount: 0
    };
    let creepCount = 0;
    for (var creepKey in Game.creeps) {
      var creep = Game.creeps[creepKey];
      var role = creep.memory.role;
      if (currentRoom.workforce.roster[role] === undefined) {
        currentRoom.workforce.roster[role] = [creepKey];
      } else {
        currentRoom.workforce.roster[role].push(creepKey);        
      }
      var action = creep.memory.action;
      if (currentRoom.workforce.actionCount[action]) {
        currentRoom.workforce.actionCount[action] += 1;
      } else {
        currentRoom.workforce.actionCount[action] = 1;
      }
      creepCount += 1;
    }
    currentRoom.workforce.energyTeamCount = currentRoom.workforce.roster.energyHarvester.length + currentRoom.workforce.roster.transporter.length;
    currentRoom.workforce.creepCount = creepCount;
}