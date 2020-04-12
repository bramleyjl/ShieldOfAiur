module.exports = {
  generateId: function() {
    return Game.time + '_' + Math.floor(Math.random() * 100000);
  },

  //works with just one room, need to add multi-room functionality
  getCurrentRoom: function() {
    for (var name in Game.rooms) {
      return Game.rooms[name];
    }
  },

  //works with just spawn, need to add multi-spawn functionality
  getSpawn: function() {
    for (var name in Game.spawns) {
      return Game.spawns[name];
    }
  }
}