var lib = require('lib_lib');
var creepLib = require('lib_creep_lib');

module.exports = {
  run: function() {
    var currentRoom = lib.getCurrentRoom();
    var roster = currentRoom.workforce.roster;
    var spawn = lib.getSpawn();
    var role = chooseRoleType(currentRoom, roster, spawn);
    if (role) {
      spawn.buildCreep(role);
    }
  }
}

function chooseRoleType(currentRoom, roster, spawn) {
  //build roster counts for comparisons
  var [energyHarvesters, transporters, basics, others] = [0, 0, 0, 0];
  for (let role in roster) {
    switch (role) {
      case 'basic':
        basics = (roster[role]) ? roster[role].length : 0;
        break;
      case 'energyHarvester':
        energyHarvesters = (roster[role]) ? roster[role].length : 0;
        break;
      case 'transporter':
        transporters = (roster[role]) ? roster[role].length : 0;
        break;
      default:
        others = (roster[role]) ? roster[role].length : 0;
        break;
    }
  }
  if (energyHarvesters > transporters) {
    return 'transporter';
  } else {
    return 'energyHarvester';
  }
}