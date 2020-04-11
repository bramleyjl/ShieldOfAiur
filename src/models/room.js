module.exports = {
  extendRoom: function() {
    Object.defineProperty(Room, 'workforce', {
      get() { return this.workforce; },
      set(newValue) { this.workforce = newValue; },
      enumerable: false,
      configurable: true
    });
    Room.prototype.calculateEnergyPotential = function() {
      return (this.energyAvailable > this.energyCapacityAvailable) ? this.energyCapacityAvailable : this.energyAvailable;
    }
  }
}