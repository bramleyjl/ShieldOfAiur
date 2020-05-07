var lib = require('lib_lib');
var workforceLib = require('lib_workforce_lib');

module.exports = {
  run: function() {
    var currentRoom = lib.getCurrentRoom();
    var roomLevel = currentRoom.controller.level;
    calculatePriorities(currentRoom, roomLevel);
  }
}

function calculatePriorities(room, roomLevel) {
  var builders = room.workforce.roster.builder;
  var constructionTargets = calculateConstructionTargets(room, roomLevel);
  switch (roomLevel) {
    case 0:
    case 1:
      //arbitrary condition of "enough resource gathering to warrant upgrading"
      if (room.workforce.energyTeamCount >= (room.resources.energy.length / 2)) {
        var upgradeTeam = room.reinforceRosterActionGroup('builder', 'upgrade', 2, 'harvest');
        dispatchUpgradeOrders(upgradeTeam, room, 'builder');
        dispatchFarmOrders(room.workforce.roster.builder, room, 'builder');
      } else {
        dispatchFarmOrders(builders, room, 'builder');
      }
      break;
    case 2:
      if (room.workforce.energyTeamCount >= room.resources.energy.length) {
        var upgradeTeam = room.reinforceRosterActionGroup('builder', 'upgrade', 2, 'harvest');
        dispatchUpgradeOrders(upgradeTeam, room, 'builder');
        //replace with construction logic
        dispatchFarmOrders(room.workforce.roster.builder, room, 'builder');
        //dispatchConstructOrders(room.workforce.roster.builder, constructionTargets, room, 'builder');
      } else {
        dispatchFarmOrders(builders, room, 'builder');
      }
      break;
    default:
      builders.forEach(creepId => {
        Game.creeps[creepId].farmAndTransport(room.resources['energy']);
      });
      break;
  }
}

function calculateConstructionTargets(room, roomLevel) {

}

function dispatchConstructOrders(team, targets, room, roster) {
  team.forEach(creepId => {
    Game.creeps[creepId].construct();
  });
  workforceLib.removeFromRoster(room, roster, team);
}

function dispatchFarmOrders(team, room, roster) {
  team.forEach(creepId => {
    Game.creeps[creepId].farmAndTransport(room.resources['energy']);
  });
  workforceLib.removeFromRoster(room, roster, team);
}

function dispatchUpgradeOrders(team, room, roster) {
  team.forEach(creepId => {
    var creep = Game.creeps[creepId];
    if (creep.store.getFreeCapacity() === 0 || creep.memory.action === 'upgrade') {
      var enoughWork = room.controller.checkIncomingWork();
      if (!enoughWork) {
        creep.upgrade(room.controller, room.resources['energy']);
        room.controller.incomingWork += creep.store.getUsedCapacity(RESOURCE_ENERGY);
      }
    }
    if (!creep.dispatched) {
      creep.farmAndTransport(room.resources['energy']);
    }
  });
  workforceLib.removeFromRoster(room, roster, team);
}