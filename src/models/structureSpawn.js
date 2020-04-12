var lib = require('lib_lib');
var creepLib = require('lib_creep_lib');

module.exports = {
  extendStructureSpawn: function() {
    StructureSpawn.prototype.buildCreep = function(role) {
      var abilities = creepLib.getCreepRoleAbilities(role);
      var creepId = lib.generateId(role);
      var traits = {
        memory: {
          role: role
        }
      };
      this.spawnCreep(abilities, creepId, traits);
    }
  }
}