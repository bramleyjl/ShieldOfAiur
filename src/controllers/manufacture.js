var lib = require('lib_lib');

module.exports = {
  run: function() {
    var currentRoom = lib.getCurrentRoom();
    if (currentRoom.workforce.roster.length < 10) {
      var spawn = lib.getSpawn();
      spawn.buildCreep();
    }
  }
}
