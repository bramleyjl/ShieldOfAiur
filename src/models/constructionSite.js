module.exports = {
  extendConstructionSite: function () {
    Object.defineProperty(ConstructionSite.prototype, "manual", {
      get: function () {
        return this._manual;
      },
      set: function (newVal) {
        this._manual = newVal;
      },
      enumerable: false,
      configurable: true,
    });
  },
};
