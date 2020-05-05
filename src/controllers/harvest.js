var lib = require('lib_lib');
var workforceLib = require('lib_workforce_lib');

module.exports = {
  run: function() {
    var currentRoom = lib.getCurrentRoom();
    calculatePriorities(currentRoom);
  }
}

function calculatePriorities(room) {
  var harvesters = room.workforce.roster.energyHarvester;
  dispatchHarvestOrders(harvesters, room, 'energyHarvester');
  var transporters = room.workforce.roster.transporter;
  dispatchHarvestOrders(transporters, room, 'transporter');
}

function dispatchHarvestOrders(team, room, roster) {
  team.forEach(creepId => {
    Game.creeps[creepId].farm(room.resources['energy']);
  });
  workforceLib.removeFromRoster(room, roster, team);
}

function dispatchTransportOrders(team, room, roster) {
  team.forEach(creepId => {
    Game.creeps[creepId].transport(room.resources['dropped']);
  });
  workforceLib.removeFromRoster(room, roster, team);
}