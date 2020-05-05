module.exports = {
  extendRoom: function() {
    addMethods();
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
  }
}

function addMethods() {
  Room.prototype.getRosterActionGroup = function(role, action) {
    var actionGroup = this.workforce.roster[role].filter(creepKey => {
      var creep = Game.creeps[creepKey];
      if (creep.memory.action === action) {
        return true;
      }
    });
    return actionGroup;
  };
  Room.prototype.reinforceRosterActionGroup = function(role, action, count, conscriptAction) {
    //come up with better method of determining which farming builder should be assigned to which task
    var actionGroup = this.getRosterActionGroup(role, action);
    var conscriptGroup = this.getRosterActionGroup(role, conscriptAction)
    var creepDiff = count - actionGroup.length;
    if (creepDiff > 0 && conscriptGroup.length > 0) {
      var conscripts = selectBestConscript(conscriptGroup, conscriptAction, creepDiff);
      return actionGroup.concat(conscripts);
    }
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