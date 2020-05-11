module.exports = {
  extendRoom: function() {
    Object.defineProperty(Room, 'workforce', {
      get() { return this._workforce; },
      set(newValue) { this._workforce = newValue; },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Room, 'resources', {
      get() { return this._resources; },
      set(newValue) { this._resources = newValue; },
      enumerable: false,
      configurable: true,
    });
    addMethods();
  }
}

function addMethods() {
  Room.prototype.buildResources = function() {
    this.resources = {
      energy: this.find(FIND_SOURCES_ACTIVE),
      dropped: this.find(FIND_DROPPED_RESOURCES),
      minerals: this.find(FIND_MINERALS),
      totalHarvestSpaces: 0
    };
    this.resources.energy.forEach(source => {
      this.resources.totalHarvestSpaces += source.freeSpaces;
    });
  };
  Room.prototype.getOpenHarvestSpaces = function() {
    var openSpaces = 0;
    this.resources.energy.forEach(source => {
      openSpaces += source.freeSpaces;
    });
    return openSpaces;
  }
  Room.prototype.getRefuelTargets = function(resource = RESOURCE_ENERGY) {
    var refuelTargets = this.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.hasResource(resource);
      }
    });
    return refuelTargets;
  }
  Room.prototype.getRosterActionGroup = function(role, action) {
    var actionGroup = this.workforce.roster[role].filter(creepKey => {
      var creep = Game.creeps[creepKey];
      if (creep.memory.action === action) {
        return true;
      }
    });
    return actionGroup;
  };
  Room.prototype.getStorageTargets = function(resource = RESOURCE_ENERGY) {
    var storageTargets = this.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.canStoreResource(resource);
      }
    });
    return storageTargets;
  }
  Room.prototype.reinforceRosterActionGroup = function(role, action, count, conscriptActions) {
    //come up with better method of determining which farming builder should be assigned to which task
    var actionGroup = this.getRosterActionGroup(role, action);
    var creepDiff = count - actionGroup.length;
    conscriptActions.forEach(action => {
      if (creepDiff > 0 ) {
      var conscriptGroup = this.getRosterActionGroup(role, action);
        if (conscriptGroup) {
          var conscripts = selectBestConscript(conscriptGroup, action, creepDiff);
          actionGroup = actionGroup.concat(conscripts);
        }
      }
    });
    return actionGroup;
  };
}

function selectBestConscript(group, action, count) {
  if (count >= group.length) {
    return group;
  }
  var sortedGroup = group.sort((a,b) => {
    switch (action) {
      case 'harvest':
      default:
        return Game.creeps[a].store.getFreeCapacity() < Game.creeps[b].store.getFreeCapacity();
        break;
    }
  });
  return sortedGroup.slice(0, count);
}