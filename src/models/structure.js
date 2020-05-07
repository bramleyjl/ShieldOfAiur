module.exports = {
  extendStructure: function() {
    Structure.prototype.canStoreResource = function(creep, resource) {
      if (this.store === undefined) {
        return false;
      }
      return ((this.structureType == STRUCTURE_EXTENSION ||
          this.structureType == STRUCTURE_SPAWN ||
          this.structureType == STRUCTURE_TOWER) &&
          this.store.getFreeCapacity(resource) > 0);
    }
  }
}