var lib = require('lib_lib');

module.exports = {
  run: function() {
    var room = lib.getCurrentRoom();
    announceWorkforce(room);
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