var lib = require('lib_lib');

module.exports = {
  run: function() {
    var currentRoom = lib.getCurrentRoom();
    dispatchResourceOrders(currentRoom);
  }
}

function dispatchResourceOrders(room) {
  if (room.workforce.energyTeamCount <= room.resources.energy.length) {
    room.workforce.roster.builder.forEach(creepId => {
        Game.creeps[creepId].farmAndTransport(room.resources['energy']);
    });
  }
  room.workforce.roster.energyHarvester.forEach(creepId => {
    Game.creeps[creepId].farm(room.resources['energy']);
  });
  room.workforce.roster.transporter.forEach(creepId => {
    Game.creeps[creepId].transport(room.resources['dropped']);
  });
}