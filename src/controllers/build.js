var lib = require('lib_lib');

module.exports = {
  run: function() {
    var currentRoom = lib.getCurrentRoom();
    var roomLevel = currentRoom.controller.level;
    calculateUpgradePriorities(currentRoom, roomLevel);
    calculateConstructPriorities(currentRoom, roomLevel);
  }
}

function calculateConstructPriorities(room, roomLevel) {
  switch (roomLevel) {
    case 0:
      // dispatchConstructOrders(room);
      break;
    case 1:
      // dispatchConstructOrders(room);
      break;
    default:
      // dispatchConstructOrders(room);
      break;
  }
}

function calculateUpgradePriorities(room, roomLevel) {
  switch (roomLevel) {
    case 0:
    case 1:
      //arbitrary condition of "enough resource gathering to warrant upgrading"
      if (room.workforce.energyTeamCount >= room.resources.energy.length) {
        dispatchUpgradeOrders(room);
      }
      break;
    default:
      //dispatchUpgradeOrders(room);
      break;
  }
}

function dispatchConstructOrders(room) {
  var roster = room.workforce.roster;
  var buildCreeps = roster.builder ? roster.builder : roster.basic;
  buildCreeps.forEach(creepId => {
    Game.creeps[creepId].construct(room.controller, room.resources['energy']);
  });
}

function dispatchUpgradeOrders(room) {
  var roster = room.workforce.roster;
  var upgradeCreeps = roster.builder ? roster.builder : roster.basic;
  upgradeCreeps.forEach(creepId => {
    Game.creeps[creepId].upgrade(room.controller, room.resources['energy']);
  });
}