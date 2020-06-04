var lib = require('lib.lib');
var creepLib = require('lib.creep_lib');

module.exports = {
  extendStructureSpawn: function() {
    StructureSpawn.prototype.buildCreep = function(role, traits = {}) {
      var parts = creepLib.getCreepRoleParts(role);
      var creepId = lib.generateId(role);
      if (traits.memory === undefined || lib.isEmpty(traits.memory)) {
        traits.memory = {
          role: role
        };
      } else {
        traits.memory.role = role;
      }
      return this.spawnCreep(parts, creepId, traits);
    };
    StructureSpawn.prototype.canBuildCreep = function(role) {
      if (!role) {
        return -1;
      }
      return this.buildCreep(role, { dryRun: true });
    };
  }
}