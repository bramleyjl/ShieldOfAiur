var lib = require('lib_lib');

module.exports = {
  run: function() {
    var currentRoom = lib.getCurrentRoom();
    var roomLevel = currentRoom.controller.level;
    calculateConstructPriorities(currentRoom, roomLevel);
  }
}

function calculateConstructPriorities(room, roomLevel) {
  var roster = room.workforce.roster;
        var upgradeCreeps = room.reinforceRosterActionGroup('builder', 'harvest', 2);
        // console.log(upgradeCreeps);
  switch (roomLevel) {
    case 0:
    case 1:
      //arbitrary condition of "enough resource gathering to warrant upgrading"
      if (room.workforce.energyTeamCount >= (room.resources.energy.length / 2)) {
        dispatchUpgradeOrders(room, roster.builder);
      }
      break;
    case 2:
      if (room.workforce.energyTeamCount >= room.resources.energy.length) {
        var upgradeCreeps = room.reinforceRosterActionGroup('builder', 'upgrade', 2);
        // dispatchUpgradeOrders(room, roster);
      }
      break;
    default:
      // dispatchConstructOrders(room);
      break;
  }
}

function dispatchConstructOrders(room, roster) {
  var buildCreeps = roster.builder ? roster.builder : roster.basic;
  roster.forEach(creepId => {
    Game.creeps[creepId].construct(room.controller, room.resources['energy']);
  });
}

function dispatchUpgradeOrders(room, roster) {
  roster.forEach(creepId => {
    Game.creeps[creepId].upgrade(room.controller, room.resources['energy']);
  });
}