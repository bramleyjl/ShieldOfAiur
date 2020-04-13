var lib = require('lib_lib');

module.exports = {
  run: function() {
    var currentRoom = lib.getCurrentRoom();
    dispatchUpgradeOrders(currentRoom);
  }
}

function dispatchUpgradeOrders(room) {
  room.workforce.roster.upgrader.forEach(creepId => {
    Game.creeps[creepId].upgrade(room.controller, room.resources['energy']);
  });
}