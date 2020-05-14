var lib = require('lib_lib');
var creep = require('models_creep');
var game = require('models_game');
var room = require('models_room');
var roomObject = require('models_roomObject');
var source = require('models_source');
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
    source.extendSource();
    structure.extendStructure();
    structureSpawn.extendStructureSpawn();
}

function buildRoom() {
    var room = lib.getCurrentRoom();
    room.buildResources();
    room.workforce = {
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
      if (room.workforce.roster[role] === undefined) {
        room.workforce.roster[role] = [creepKey];
      } else {
        room.workforce.roster[role].push(creepKey);        
      }
      var action = creep.memory.action;
      if (room.workforce.actionCount[action]) {
        room.workforce.actionCount[action] += 1;
      } else {
        room.workforce.actionCount[action] = 1;
      }
      creepCount += 1;
    }
    room.workforce.energyTeamCount = room.workforce.roster.harvester.length + room.workforce.roster.transporter.length;
    room.workforce.creepCount = creepCount;
    //set controller upgrade deficit and incoming work
    room.controller.incomingWork = 0;
    room.controller.workRemaining = room.controller.progressTotal - room.controller.progress;
    //initial room memory structure setup, only runs once
    if (!room.memory.memorySetup) {
      room.buildMemory();
    }
}