var config = require('config');

module.exports = {
  extendCreep: function() {
    Object.defineProperty(Creep.prototype, 'dispatched', {
      get: function() { return this._dispatched },
      set: function(newVal) { this._dispatched = newVal },
      enumerable: false,
      configurable: true
    });
    addMethods();
  }
}

function addMethods() {
  Creep.prototype.construct = function(target) {
    this.dispatched = true;  
  };
  Creep.prototype.collect = function (target) {
    var attempt = this.goDo(target, 'pickup', 'transportCollect');
    return attempt;
  };
  Creep.prototype.deposit = function (target, resource) {
    var attempt = this.goDo(target, 'transfer', 'transportDeposit', { 
      actionArgs: {resource: resource}, 
      path: 'returnPath',
      preserveTarget: true 
    });
    //maybe rework to use checkIncomingWork feature for depositing energy?
    if (attempt === OK || attempt === ERR_FULL) {
      if (target.store.getFreeCapacity(resource) < this.store.getUsedCapacity(resource)) {
        this.memory.action = 'forceDeposit';
      } else {
        this.memory.action = 'transportDeposit';
        this.memory.target = undefined;
      }
    }
    return attempt;
  };
  Creep.prototype.farm = function(target) {
    var attempt = this.goDo(target, 'harvest', 'harvest');
    return attempt;
  };
  Creep.prototype.goDo = function(target, command, action, args = { path: 'movePath' }) {
      if (!target) {
        console.log(`ERROR: Null target for creep ${this.name} attempting ${command}: ${action}`);
        return;
      }
      switch (command) {
        case 'harvest':
          var attempt = this.harvest(target);
          break;
        case 'pickup':
          var attempt = this.pickup(target);
          break;
        case 'transfer':
          var attempt = this.transfer(target, args.actionArgs.resource);
          break;
        case 'upgradeController':
          var attempt = this.upgradeController(target);
          break;
        case 'withdraw':
          var attempt = this.withdraw(target, args.actionArgs.resource);
          break;
        default:
          var attempt = ERR_NOT_IN_RANGE;
          break;
      }
      target.freeSpaces = target.freeSpaces - 1;
      this.memory.action = action;
      if (attempt === ERR_NOT_IN_RANGE) {
        this.moveTo(target, {visualizePathStyle: {stroke: config.styling[args.path].stroke}});
        this.memory.target = target.id;
      } else if (attempt === OK && !args['preserveTarget']) {
        this.memory.target = undefined;
      }
      return attempt;
  };
  Creep.prototype.refuel = function(target, resource) {
    var attempt = this.goDo(target, 'withdraw', 'refuel', {
      actionArgs: {
        resource: resource
      },
      path: 'returnPath',
      preserveTarget: true 
    });
    if (attempt === ERR_FULL) {
      this.memory.action = '';
      this.memory.target = undefined;
    } else {
      this.memory.action = 'waitRefuel';
    }
    return attempt;
  };
  Creep.prototype.shouldDeposit = function(resource) {
    return (this.store.getFreeCapacity(resource) === 0 || this.memory.action === 'forceDeposit') ? true : false;
  };
  Creep.prototype.shouldRefuel = function(resource) {
    return (this.store.getFreeCapacity(resource) > 0 || this.memory.action === 'forceRefuel') ? true : false;
  };
  Creep.prototype.upgrade = function(controller, resourceNodes) {
    if (controller.isActive()) {
      var attempt = this.goDo(controller, 'upgradeController', 'upgrade');
      return attempt;
    }
  };
}