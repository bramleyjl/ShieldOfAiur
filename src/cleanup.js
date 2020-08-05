var lib = require('lib.lib');

module.exports = {
  run: function() {
    var room = lib.getCurrentRoom();
    announceWorkforce(room);
    for(let name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
      }
    }
  }
}

function announceWorkforce(room) {
  var idleCreeps = [];
  Object.values(room.workforce.roster).forEach(roster => {
    if (roster.length > 0) {
      idleCreeps = idleCreeps.concat(roster);
    }
  });
  if (idleCreeps.length > 0) {
    console.log('IDLE CREEPS: ' + idleCreeps);
  }
}