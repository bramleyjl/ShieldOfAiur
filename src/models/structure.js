module.exports = {
  extendStructure: function() {
    addMethods();
  }
}

function addMethods() {
  Structure.prototype.canStoreResource = function(resource) {
    if (this.store === undefined) {
      return false;
    }
    return ((this.structureType == STRUCTURE_EXTENSION ||
        this.structureType == STRUCTURE_SPAWN ||
        this.structureType == STRUCTURE_TOWER) &&
        this.store.getFreeCapacity(resource) > 0);
  };
  Structure.prototype.hasResource = function(resource) {
    if (this.store === undefined) {
      return false;
    }
    return ((this.structureType == STRUCTURE_EXTENSION ||
      this.structureType == STRUCTURE_SPAWN ||
      this.structureType == STRUCTURE_TOWER) &&
      this.store.getUsedCapacity(resource) > 0);
  };
}