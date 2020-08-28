var config = require("config");
var workforceLib = require("lib.workforce_lib");

module.exports = {
  extendCreep: function () {
    Object.defineProperty(Creep.prototype, "dispatched", {
      get: function () {
        return this._dispatched;
      },
      set: function (newVal) {
        this._dispatched = newVal;
      },
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(Creep.prototype, "lifeLeft", {
      get: function () {
        return Math.round((this.ticksToLive * 100) / 1500);
      },
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(Creep.prototype, "missingHP", {
      get: function () {
        return this.hitsMax - this.hits;
      },
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(Creep.prototype, "percentHP", {
      get: function () {
        return Math.round((this.hits * 100) / this.hitsMax);
      },
      enumerable: false,
      configurable: true,
    });
    addMethods();
  },
};

function addMethods() {
  Creep.prototype.checkStatus = function () {
    if (this.missingHP > 0) {
      var oldHP = this.memory.hp;
      if (oldHP === undefined || oldHP > this.hits) {
        this.room.handleAttack(this);
      } else {
        if (this.memory.action === "retreat") {
          this.retreat(this.getMemoryObject("target"));
        }
        console.log(this.room.memory.creepHeal);
        if (
          this.room.memory.creepHeal.indexOf(creep.id) < 0 &&
          this.shouldRepair()
        ) {
          this.memory.needsRepair = true;
          this.room.memory.creepHeal.push(creep.id);
        }
      }
      this.memory.hp = this.hits;
    }
  };
  Creep.prototype.collect = function (target) {
    var attempt = this.goDo(target, "pickup", "transportCollect");
    return attempt;
  };
  Creep.prototype.construct = function (target) {
    var attempt = this.goDo(target, "build", "build");
    return attempt;
  };
  Creep.prototype.deposit = function (target, resource) {
    var attempt = this.goDo(target, "transfer", "transportDeposit", {
      actionArgs: { resource: resource },
      path: "returnPath",
      preserveTarget: true,
    });
    //maybe rework to use checkIncomingWork feature for depositing energy?
    if (attempt === OK || attempt === ERR_FULL) {
      if (
        target.store.getFreeCapacity(resource) <
        this.store.getUsedCapacity(resource)
      ) {
        this.memory.action = "forceDeposit";
      } else {
        this.memory.action = "transportDeposit";
        this.memory.target = undefined;
      }
    }
    return attempt;
  };
  Creep.prototype.farm = function (target) {
    var attempt = this.goDo(target, "harvest", "harvest");
    return attempt;
  };
  Creep.prototype.goDo = function (
    target,
    command = "move",
    action,
    args = { path: "movePath" }
  ) {
    if (!target) {
      console.log(
        `ERROR: Null target for creep ${this.name} attempting ${command}: ${action}`
      );
      return;
    }
    switch (command) {
      case "build":
        var attempt = this.build(target);
        break;
      case "harvest":
        var attempt = this.harvest(target);
        break;
      case "pickup":
        var attempt = this.pickup(target);
        break;
      case "transfer":
        var attempt = this.transfer(target, args.actionArgs.resource);
        break;
      case "upgradeController":
        var attempt = this.upgradeController(target);
        break;
      case "withdraw":
        var attempt = this.withdraw(target, args.actionArgs.resource);
        break;
      case "move":
      default:
        var attempt = this.moveTo(target, {
          visualizePathStyle: { stroke: config.styling[args.path].stroke },
        });
        break;
    }
    target.freeSpaces = target.freeSpaces - 1;
    this.memory.action = action;
    if (attempt === ERR_NOT_IN_RANGE || args["preserveTarget"] === true) {
      this.moveTo(target, {
        visualizePathStyle: { stroke: config.styling[args.path].stroke },
      });
      this.memory.target = target.id;
    } else if (attempt === OK && !args["preserveTarget"]) {
      this.memory.target = undefined;
    }
    return attempt;
  };
  Creep.prototype.shouldRepair = function () {
    if (this.memory.needsRepair === true) {
      return true;
    } else {
      if (this.percentHP > 90) return false;
      if (this.lifeLeft < 50 && this.percentHP > 50) return false;
      return true;
    }
  };
  Creep.prototype.refuel = function (target, resource) {
    var attempt = this.goDo(target, "withdraw", "refuel", {
      actionArgs: {
        resource: resource,
      },
      path: "returnPath",
      preserveTarget: true,
    });
    if (attempt === ERR_FULL) {
      this.memory.action = "";
      this.memory.target = undefined;
    } else {
      this.memory.action = "waitRefuel";
    }
    return attempt;
  };
  Creep.prototype.retreat = function (target = undefined) {
    if (target === undefined) {
      var spawn = this.room.memory.spawn;
      target = Game.spawns[spawn];
    }
    if (this.pos.getRangeTo(target) > 1) {
      var attempt = this.goDo(target, "move", "retreat", {
        path: "returnPath",
        preserveTarget: true,
      });
      workforceLib.removeFromRoster(this.room, this.memory.role, [this.name]);
    } else {
      this.memory.action = "";
      this.memory.target = undefined;
    }
  };
  Creep.prototype.shouldDeposit = function (resource) {
    return this.store.getFreeCapacity(resource) === 0 ||
      this.memory.action === "forceDeposit"
      ? true
      : false;
  };
  Creep.prototype.shouldRefuel = function (resource) {
    return this.store.getFreeCapacity(resource) > 0 ||
      this.memory.action === "forceRefuel"
      ? true
      : false;
  };
  Creep.prototype.upgrade = function (controller, resourceNodes) {
    if (controller.isActive()) {
      var attempt = this.goDo(controller, "upgradeController", "upgrade");
      return attempt;
    }
  };
}
