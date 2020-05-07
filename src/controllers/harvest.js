var lib = require('lib_lib');
var workforceLib = require('lib_workforce_lib');

module.exports = {
  run: function() {
    var currentRoom = lib.getCurrentRoom();
    calculatePriorities(currentRoom);
  },
  dispatchHarvestOrders: function(team, room, roster) {
    var resourceNodes = room.resources['energy'];
    team.forEach(creepId => {
      var creep = Game.creeps[creepId];
      var target = creep.getMemoryObject('target');
      if (!target) {
        var target = creep.pos.findClosestByPath(resourceNodes, {
          filter: (source) => {
            return source.freeSpaces > 0;
          }
        });
      }
      if (target) {
        creep.farm(target);
      }
    });
    workforceLib.removeFromRoster(room, roster, team);
  },
  dispatchTransportOrders: function(team, room, roster) {
    var storageTargets = room.getStorageTargets();
    team.forEach(creepId => {
      var creep = Game.creeps[creepId];
      var target = creep.getMemoryObject('target');
      if (creep.shouldDeposit(RESOURCE_ENERGY)) {
        //deposit to structure
        if (!target || creep.memory.action !== 'transportDeposit') {
          target = creep.pos.findClosestByPath(storageTargets);
        }
        if (target) {
          creep.deposit(target, RESOURCE_ENERGY);
        }
      } else {      
        //collect dropped energy
        if (!target) {
          target = creep.pos.findClosestByPath(room.resources['dropped']);
        }
        if (target) {
          creep.collect(target);
        } else {
          target = creep.pos.findClosestByPath(storageTargets);
          creep.deposit(target, RESOURCE_ENERGY);        
        }
      }
    });
    workforceLib.removeFromRoster(room, roster, team);
  }
}

function calculatePriorities(room) {
  var harvesters = room.workforce.roster.harvester;
  module.exports.dispatchHarvestOrders(harvesters, room, 'harvester');
  var transporters = room.workforce.roster.transporter;
  module.exports.dispatchTransportOrders(transporters, room, 'transporter');
}