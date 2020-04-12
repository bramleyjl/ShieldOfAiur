module.exports = {
  extendCreep: function() {
    addMethods();
  }
}

function addMethods() {
  Creep.prototype.farm = function(resourceNodes) {
    var target = this.getMemoryObject('target');
    if (this.store.getFreeCapacity() > 0) {
      if (!target || this.memory.role != 'harvestGather') {
        var target = this.pos.findClosestByPath(resourceNodes, {
          filter: (source) => {
            return source.freeSpaces > 0;
          }
        });
      }
      if (this.harvest(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});        
      }
      target.freeSpaces -= 1;
      this.memory.target = target.id;
      this.memory.role = 'harvestGather';
    } else {
      if (!target || this.memory.role != 'harvestDeposit') {
        var target = this.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return structure.canStoreResource(this, RESOURCE_ENERGY);
          }
        })[0];        
      }
      if (target) {
        if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        this.memory.target = target.id;
        this.memory.role = 'harvestDeposit';
      }
    }
  };
}

