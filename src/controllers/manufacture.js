var lib = require('lib_lib');
var creepLib = require('lib_creep_lib');

module.exports = {
  run: function() {
    var currentRoom = lib.getCurrentRoom();
    var roster = currentRoom.workforce.roster;
    var role = chooseRoleType(currentRoom, roster);
    if (role) {
      var spawn = lib.getSpawn();
      spawn.buildCreep(role);
    }
  }
}

function chooseRoleType(currentRoom, roster) {
  //build roster counts for comparisons
  var [energyHarvesters, transporters, other] = [0, 0, 0];
  for (let role in roster) {
    switch (role) {
      case 'energyHarvester':
        energyHarvesters = (roster[role]) ? roster[role].length : 0;
        break;
      case 'transporter':
        transporters = (roster[role]) ? roster[role].length : 0;
        break;
      default:
        other = (roster[role]) ? roster[role].length : 0;
        break;
    }
  }
  if ((energyHarvesters + transporters + other) < 10) {
    if ((energyHarvesters / transporters) > 2) {
      return 'transporter';
    } else {
      return 'energyHarvester';
    }
  }
}