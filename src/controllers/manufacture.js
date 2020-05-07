var lib = require('lib_lib');
var workforceLib = require('lib_workforce_lib');

module.exports = {
  run: function() {
    var spawn = lib.getSpawn();
    var room = lib.getCurrentRoom();
    var role = chooseRoleType(room, spawn);
    var canBuild = spawn.canBuildCreep(role);
    if (canBuild === 0) {
      spawn.buildCreep(role);
    }
  }
}

function chooseRoleType(room, spawn) {
  var creepCount = room.workforce.creepCount;

  var harvesters = workforceLib.getRoleCount(room, 'harvester');
  var transporters = workforceLib.getRoleCount(room, 'transporter');
  var builders = workforceLib.getRoleCount(room, 'builder');

  if (creepCount === 0) {
    return 'builder';
  }
  if (room.workforce.energyTeamCount <= (creepCount / 2)) {
    if (harvesters > transporters) {
      return 'transporter';
    } else {
      return 'harvester';
    }
  }
  return 'builder';
}