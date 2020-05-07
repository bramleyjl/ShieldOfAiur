var lib = require('lib_lib');

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
  var roster = room.workforce.roster;
  var creepCount = room.workforce.creepCount;
  //sets better roster variables
  var basics = (roster.basic) ? roster.basic.length : 0;
  var claimers = (roster.claimer) ? roster.claimer.length : 0;
  var harvesters = (roster.harvester) ? roster.harvester.length : 0;
  var transporters = (roster.transporter) ? roster.transporter.length : 0;
  var builders = (roster.builder) ? roster.builder.length : 0;

  if (room.workforce.energyTeamCount < (creepCount / 2)) {
    if (harvesters > transporters) {
      return 'transporter';
    } else {
      return 'harvester';
    }
  }
  return 'builder';
}