module.exports = {
  extendCreep: function() {
    addMethods();
  }
}

function addMethods() {
  Creep.prototype.farm = function() {
    if (this.store.getFreeCapacity() > 0) {
      var sources = this.room.find(FIND_SOURCES);
      if(this.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          this.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
      }  
    } else {
      var targets = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return structure.canStoreResource(this, RESOURCE_ENERGY);
        }
      });
      if(targets.length > 0) {
        if(this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    }
  }
}