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
    var currRoom = lib.getCurrentRoom();
    currRoom.buildResources();
    currRoom.workforce = {
        roster: {
            basic: [],
            claimer: [],
            harvester: [],
            transporter: [],
            builder: [],
        },
        dispatched: {
            basic: [],
            claimer: [],
            harvester: [],
            transporter: [],
            builder: [],
        },
        actionCount: {},
        creepCount: 0
    };
    let creepCount = 0;
    for (var creepKey in Game.creeps) {
      var creep = Game.creeps[creepKey];
      creep.dispatched = false;
      var role = creep.memory.role;
      if (currRoom.workforce.roster[role] === undefined) {
        currRoom.workforce.roster[role] = [creepKey];
      } else {
        currRoom.workforce.roster[role].push(creepKey);        
      }
      var action = creep.memory.action;
      if (currRoom.workforce.actionCount[action]) {
        currRoom.workforce.actionCount[action] += 1;
      } else {
        currRoom.workforce.actionCount[action] = 1;
      }
      creepCount += 1;
    }
    currRoom.workforce.energyTeamCount = currRoom.workforce.roster.harvester.length + currRoom.workforce.roster.transporter.length;
    currRoom.workforce.creepCount = creepCount;
    //set controller upgrade deficit and incoming work
    currRoom.controller.incomingWork = 0;
    currRoom.controller.workRemaining = currRoom.controller.progressTotal - currRoom.controller.progress;
}