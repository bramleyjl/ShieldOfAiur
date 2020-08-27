module.exports = {
  generateId: function (role = "") {
    return role + "_" + Math.floor(Math.random() * 1000000);
  },
  //works with just one room, need to add multi-room functionality
  getCurrentRoom: function () {
    for (var name in Game.rooms) {
      return Game.rooms[name];
    }
  },
  //works with just spawn, need to add multi-spawn functionality
  getSpawn: function () {
    for (var name in Game.spawns) {
      return Game.spawns[name];
    }
  },
  //checks if object is empty or not
  isEmpty: function (obj) {
    return Object.keys(obj).length === 0;
  },
};
