module.exports = {
  extendSource: function () {
    Object.defineProperty(RoomObject.prototype, "energyDeficit", {
      get: function () {
        return this.energyCapacity - this.energy;
      },
      enumerable: false,
      configurable: true,
    });
  },
};
