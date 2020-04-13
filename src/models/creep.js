var config = require('config');

module.exports = {
  extendCreep: function() {
    addMethods();
  }
}

function addMethods() {
  Creep.prototype.farmAndTransport = function(resourceNodes) {
    if (this.store.getFreeCapacity() > 0) {
      this.farm(resourceNodes);
    } else {
      this.transport();
    } 
  };
  Creep.prototype.farm = function(resourceNodes) {
    var target = this.getMemoryObject('target');
    if (!target) {
      var target = this.pos.findClosestByPath(resourceNodes, {
        filter: (source) => {
          return source.freeSpaces > 0;
        }
      });
    }
    this.goDo(target, 'harvest', {}, 'harvest');
  };
  Creep.prototype.goDo = function(target, action, actionArgs, currentAction, path = 'movePath') {
      switch (action) {
        case 'harvest':
          var attempt = this.harvest(target);
          break;
        case 'pickup':
          var attempt = this.pickup(target);
          break;
        case 'transfer':
          var attempt = this.transfer(target, actionArgs.resource);
          break;
        case 'upgradeController':
          var attempt = this.upgradeController(target);
        default:
          var attempt = ERR_NOT_IN_RANGE;
          break;
      }
      target.freeSpaces -= 1;
      this.memory.action = currentAction;
      if (attempt == ERR_NOT_IN_RANGE) {
        this.moveTo(target, {visualizePathStyle: {stroke: config.styling[path].stroke}});
        this.memory.target = target.id;
      } else {
        this.memory.target = undefined;
      }
      return attempt;
  };
  Creep.prototype.transport = function(resourceNodes = '') {
    var target = this.getMemoryObject('target');
    if (this.store.getFreeCapacity() > 0) {
      if (!target || this.memory.action != 'transportCollect') {
        var target = this.pos.findClosestByPath(resourceNodes);
      }
      if (target) {
        this.goDo(target, 'pickup', {}, 'transportCollect');
      }
    } else {
      if (!target || this.memory.action != 'transportDeposit') {
        var target = this.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return structure.canStoreResource(this, RESOURCE_ENERGY);
          }
        })[0];
      }
      if (target) {
        this.goDo(target, 'transfer', {resource: RESOURCE_ENERGY}, 'transportDeposit', 'returnPath');
      }
    }
  };
  Creep.prototype.upgrade = function(controller, resourceNodes) {
    if (controller.isActive()) {
      if (this.store.getUsedCapacity() === 0) {
        this.farm(resourceNodes);
      } else if (this.store.getFreeCapacity() === 0) {
        this.goDo(controller, 'upgradeController', {}, 'upgrade');
      } else {
        if (this.memory.action === 'harvest') {
          this.farm(resourceNodes);
        } else {
          this.goDo(controller, 'upgradeController', {}, 'upgrade');          
        }
      }
    } else {
      this.farmAndTransport(resourceNodes);
    }
  };
}