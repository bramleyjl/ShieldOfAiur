var lib = require("lib.lib");
var memoryLib = require("lib.memory_lib");
var constructionSite = require("models.constructionSite");
var creep = require("models.creep");
var game = require("models.game");
var room = require("models.room");
var roomObject = require("models.roomObject");
var source = require("models.source");
var structure = require("models.structure");
var structureSpawn = require("models.structureSpawn");

PathFinder.use(true);

var setup = {
  runConstructors: function () {
    extendClasses();
    buildRoom();
    checkTimeQueue();
  },
};

module.exports = setup;

function extendClasses() {
  game.extendGame();
  room.extendRoom();
  roomObject.extendRoomObject();
  constructionSite.extendConstructionSite();
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
    creepCount: 0,
  };
  buildWorkforce(room);
  room.controller.incomingWork = 0;
  room.controller.workRemaining =
    room.controller.progressTotal - room.controller.progress;
  //initial room memory structure setup, only runs once
  if (!room.memory.memorySetup) {
    room.buildMemory();
  }
}

function checkTimeQueue() {
  if (!Memory.timeQueue) {
    Memory.timeQueue = {};
  }
  var now = Game.time;
  var timeQueueList = Memory.timeQueue[now];
  if (timeQueueList) {
    memoryLib.handleTimeQueueList(now, timeQueueList);
  }
}

function buildWorkforce(room) {
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
    if (action) {
      if (room.workforce.actionCount[action]) {
        room.workforce.actionCount[action] += 1;
      } else {
        room.workforce.actionCount[action] = 1;
      }
    }
    creep.checkStatus();
    creepCount += 1;
  }
  room.workforce.energyTeamCount =
    room.workforce.roster.harvester.length +
    room.workforce.roster.transporter.length;
  room.workforce.creepCount = creepCount;
}
