var lib = require('lib_lib');

module.exports = {
  run: function() {
    var currentRoom = lib.getCurrentRoom();
    var roomLevel = currentRoom.controller.level;
    calculateUpgradePriorities(currentRoom, roomLevel);
    calculateBuildPriorities(currentRoom, roomLevel);
  }
}

function calculateBuildPriorities(room, roomLevel) {
  switch (roomLevel) {
    case 0:
      dispatchBuildOrders(room);
      break;
    case 1:
      dispatchBuildOrders(room);
      break;
    default:
      dispatchBuildOrders(room);
      break;
  }
}

function calculateUpgradePriorities(room, roomLevel) {
  switch (roomLevel) {
    case 0:
      dispatchUpgradeOrders(room);
      break;
    case 1:
      dispatchUpgradeOrders(room);
      break;
    default:
      dispatchUpgradeOrders(room);
      break;
  }
}

function dispatchBuildOrders(room) {
  room.workforce.roster.builder.forEach(creepId => {
    //build text goes here
  });
}

function dispatchUpgradeOrders(room) {
  room.workforce.roster.builder.forEach(creepId => {
    Game.creeps[creepId].upgrade(room.controller, room.resources['energy']);
  });
}