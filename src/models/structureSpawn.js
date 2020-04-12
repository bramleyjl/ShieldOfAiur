var lib = require('lib_lib');

module.exports = {
  extendStructureSpawn: function() {
    StructureSpawn.prototype.buildCreep = function() {
      var abilities = [WORK, CARRY, MOVE];
      var creepId = lib.generateId();
      var traits = {};
      this.spawnCreep([WORK, CARRY, MOVE], creepId, traits);
    }
  }
}