var config = require('config');
var workforceLib = require('lib.workforce_lib');

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
  Creep.prototype.checkHP = function() {
    if (this.getMissingHP() > 0) {
    // if (1 === 1) {
      this.memory.needsRepair = true;
      var oldHP = this.memory.hp;
      if (oldHP === undefined || oldHP > this.hits) {
      // if (1 === 1) {
        this.room.handleAttack(this);
      }
    }
  };
  Creep.prototype.collect = function(target) {
    var attempt = this.goDo(target, 'pickup', 'transportCollect');
    return attempt;
  };
  Creep.prototype.construct = function(target) {
    var attempt = this.goDo(target, 'build', 'build');
    return attempt;
  };
  Creep.prototype.deposit = function(target, resource) {
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
  Creep.prototype.getMissingHP = function() {
    return this.hitsMax - this.hits;
  }
  Creep.prototype.goDo = function(target, command = 'move', action, args = { path: 'movePath' }) {
      if (!target) {
        console.log(`ERROR: Null target for creep ${this.name} attempting ${command}: ${action}`);
        return;
      }
      switch (command) {
        case 'build':
          var attempt = this.build(target);
          break;
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
        case 'move':
        default:
          var attempt = this.moveTo(target, {visualizePathStyle: {stroke: config.styling[args.path].stroke}});
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
  Creep.prototype.retreat = function(target = undefined) {
    if (target === undefined) {
      var spawn = this.room.memory.spawn;
      target = Game.spawns[spawn];
    }
    var attempt = this.goDo(target);
    workforceLib.removeFromRoster(this.room, this.memory.role, [this.name]);
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