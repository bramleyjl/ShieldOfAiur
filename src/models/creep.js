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
    this.goDo(target, 'pickup', 'transportCollect');    
    this.dispatched = true;  
  };
  Creep.prototype.deposit = function (target, resource) {
    var depositAttempt = this.goDo(target, 'transfer', 'transportDeposit', { 
      actionArgs: {resource: resource}, 
      path: 'returnPath',
      preserveTarget: true 
    });
    //maybe rework to use checkIncomingWork feature for depositing energy?
    if (depositAttempt === OK || depositAttempt === ERR_FULL) {
      if (target.store.getFreeCapacity(resource) < this.store.getUsedCapacity(resource)) {
        this.memory.action = 'forceDeposit';
      } else {
        this.memory.action = 'transportDeposit';
        this.memory.target = undefined;
      }
    }
    this.dispatched = true;  
  };
  Creep.prototype.farm = function(target) {
    this.dispatched = true;
    return this.goDo(target, 'harvest', 'harvest');
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
  Creep.prototype.shouldDeposit = function(resource) {
    return (this.store.getFreeCapacity(resource) === 0 || this.memory.action === 'forceDeposit') ? true : false;
  };
  Creep.prototype.upgrade = function(controller, resourceNodes) {
    if (controller.isActive()) {
      var upgradeAttempt = this.goDo(controller, 'upgradeController', 'upgrade');
      this.dispatched = true;
    }
  };
}