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
  Room.prototype.reinforceRosterActionGroup = function(role, action, count) {
    var actionGroup = this.workforce.roster[role].filter(creepKey => {
      var creep = Game.creeps[creepKey];
      if (creep.memory.action === action) {
        return true;
      }
    });
    return actionGroup;
  };
}