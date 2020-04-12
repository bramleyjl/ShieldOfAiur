var lib = require('lib_lib');

module.exports = {
  run: function() {
    var currentRoom = lib.getCurrentRoom();
    dispatchResourceOrders(currentRoom, 'energy');
  }
}

function dispatchResourceOrders(room, resourceType) {
  room.workforce.roster.forEach(creepId => {
    Game.creeps[creepId].farm(room.resources[resourceType]);
  })
}