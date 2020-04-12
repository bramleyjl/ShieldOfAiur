var lib = require('lib_lib');

module.exports = {
  run: function() {
    var currentRoom = lib.getCurrentRoom();
    dispatchResourceOrders(currentRoom, 'energy');
  }
}

function dispatchResourceOrders(room, resourceType) {
  room.workforce.roster.energyHarvester.forEach(creepId => {
    Game.creeps[creepId].farm(room.resources[resourceType]);
  });
  room.workforce.roster.transporter.forEach(creepId => {
    Game.creeps[creepId].farm(room.resources[resourceType]);
  });
}