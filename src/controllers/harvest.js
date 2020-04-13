var lib = require('lib_lib');

module.exports = {
  run: function() {
    var currentRoom = lib.getCurrentRoom();
    dispatchResourceOrders(currentRoom);
  }
}

function dispatchResourceOrders(room) {
  room.workforce.roster.energyHarvester.forEach(creepId => {
    Game.creeps[creepId].farm(room.resources['energy']);
  });
  room.workforce.roster.transporter.forEach(creepId => {
    Game.creeps[creepId].transport(room.resources['dropped']);
  });
}