var lib = require("lib.lib");
var workforceLib = require("lib.workforce_lib");

module.exports = {
  run: function () {
    var currentRoom = lib.getCurrentRoom();
    calculatePriorities(currentRoom);
  },
  dispatchHarvestOrders: function (team, room, roster) {
    var resourceNodes = room.resources["energy"];
    team.forEach((creepId) => {
      var creep = Game.creeps[creepId];
      var target = creep.getMemoryObject("target");
      if (!target || target === undefined) {
        var target = creep.pos.findClosestByPath(resourceNodes, {
          filter: (source) => {
            return (
              source.freeSpaces > 0 &&
              room.memory.sources[source.id].safe === true
            );
          },
        });
      }
      if (target) {
        var attempt = creep.farm(target);
      }
    });
    workforceLib.removeFromRoster(room, roster, team);
  },
  dispatchTransportOrders: function (
    team,
    room,
    roster,
    command = "",
    resource = RESOURCE_ENERGY
  ) {
    team.forEach((creepId) => {
      var creep = Game.creeps[creepId];
      var target = creep.getMemoryObject("target");
      if (command === "refuel") {
        if (!target) {
          var refuelTargets = room.getRefuelTargets();
          target = creep.pos.findClosestByPath(refuelTargets);
        }
        if (target) {
          var attempt = creep.refuel(target, resource);
        }
      } else {
        var storageTargets = room.getStorageTargets();
        if (creep.shouldDeposit(resource)) {
          //deposit to structure
          if (!target || creep.memory.action !== "transportDeposit") {
            target = creep.pos.findClosestByPath(storageTargets);
          }
          if (target) {
            var attempt = creep.deposit(target, resource);
          }
        } else {
          //collect dropped energy
          if (!target) {
            target = creep.pos.findClosestByPath(room.resources["dropped"]);
          }
          if (target) {
            var attempt = creep.collect(target);
          } else {
            target = creep.pos.findClosestByPath(storageTargets);
            var attempt = creep.deposit(target, resource);
          }
        }
      }
    });
    workforceLib.removeFromRoster(room, roster, team);
  },
};

function calculatePriorities(room) {
  var harvesters = room.workforce.roster.harvester;
  module.exports.dispatchHarvestOrders(harvesters, room, "harvester");
  var transporters = room.workforce.roster.transporter;
  module.exports.dispatchTransportOrders(transporters, room, "transporter");
}
