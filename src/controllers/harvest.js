var lib = require('lib_lib');

module.exports = {
  run: function() {
    var currentRoom = lib.getCurrentRoom();
    if (currentRoom.calculateEnergyPotential() >= 50) {
      dispatchHarvest(currentRoom);
    }
  }
}

function dispatchHarvest(room) {
  room.workforce.roster.forEach( creepId => {
    Game.creeps[creepId].farm();
  })
}