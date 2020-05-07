var memoryLib = require('lib_memory_lib');

module.exports = {
  extendRoomObject: function() {
    Object.defineProperty(RoomObject.prototype, 'freeSpaces', {
      get: function () {
        if (this._freeSpaces == undefined) {
          const terrain = this.room.getTerrain();
          let freeSpaceCount = 0;
          [this.pos.x - 1, this.pos.x, this.pos.x + 1].forEach(x => {
              [this.pos.y - 1, this.pos.y, this.pos.y + 1].forEach(y => {
                if (terrain.get(x, y) != TERRAIN_MASK_WALL) { 
                  freeSpaceCount++ 
                };
              }, this);
            }, this);
          this._freeSpaces = freeSpaceCount;
        }
        return this._freeSpaces;
      },
      set: function(newVal) { this._freeSpaces = newVal },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(RoomObject.prototype, 'incomingWork', {
      get: function() { return this._incomingWork },
      set: function(newVal) { this._incomingWork = newVal },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(RoomObject.prototype, 'workRemaining', {
      get: function() { return this._workRemaining },
      set: function(newVal) { this._workRemaining = newVal },
      enumerable: false,
      configurable: true
    });    
    addMethods();
  }
}

function addMethods() {
  RoomObject.prototype.getMemoryObject = function(field) {
    if (this.memory.field) {
      return Game.getObjectById(this.memory.field);
    }
  }
  RoomObject.prototype.checkIncomingWork = function() {
    return (this.incomingWork >= this.workRemaining) ? true : false;
  }
}