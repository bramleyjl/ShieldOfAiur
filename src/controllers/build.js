var lib = require('lib_lib');
var workforceLib = require('lib_workforce_lib');
var harvestController = require('controllers_harvest');

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
  var openHarvestSpaces = room.getOpenHarvestSpaces();
  var canHarvest = (openHarvestSpaces > 0) ? true : false;
  switch (roomLevel) {
    case 0:
    case 1:
      //arbitrary condition of "enough resource gathering to warrant upgrading"
      if (room.workforce.energyTeamCount >= (room.resources.energy.length / 2)) {
        var upgradeTeam = room.reinforceRosterActionGroup('builder', 'upgrade', 2, ['harvest', 'refuel']);
        dispatchUpgradeOrders(upgradeTeam, room, 'builder', canHarvest);
      }
      break;
    case 2:
      if (room.workforce.energyTeamCount >= room.resources.energy.length) {
        var upgradeTeam = room.reinforceRosterActionGroup('builder', 'upgrade', 2, ['harvest', 'refuel']);
        dispatchUpgradeOrders(upgradeTeam, room, 'builder', canHarvest);
        //dispatchConstructOrders(room.workforce.roster.builder, constructionTargets, room, 'builder');
      }
      break;
    default:
      //no default, extra builders sent to farm below
      break;
  }
  //cleanup for any unused builders
  var cleanupBuilders = room.workforce.roster.builder;
  if (cleanupBuilders.length > 0) {
    if (canHarvest) {
      dispatchFarmOrders(cleanupBuilders, room, 'builder');
    } else {
      harvestController.dispatchTransportOrders(cleanupBuilders, room, 'builder', 'refuel');
    }
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
  var storageTargets = room.getStorageTargets();
  var depositors = team.filter(creepId => {
    var creep = Game.creeps[creepId];
    return creep.shouldDeposit(RESOURCE_ENERGY);
  });
  var harvesters = team.filter(creepId => {
    return depositors.indexOf(creepId) < 0;
  })
  harvestController.dispatchHarvestOrders(harvesters, room, 'builder');
  harvestController.dispatchTransportOrders(depositors, room, 'builder');
}

function dispatchUpgradeOrders(team, room, roster, canHarvest) {
  var farmers = [];
  team.forEach(creepId => {
    var creep = Game.creeps[creepId];
    if (creep.store.getUsedCapacity() > 0 && 
      (creep.store.getFreeCapacity() === 0 || creep.memory.action === 'upgrade')) {
      var enoughWork = room.controller.checkIncomingWork();
      if (!enoughWork) {
        creep.upgrade(room.controller, room.resources['energy']);
        room.controller.incomingWork += creep.store.getUsedCapacity(RESOURCE_ENERGY);
      }
      workforceLib.removeFromRoster(room, roster, team);
    }
  });
}