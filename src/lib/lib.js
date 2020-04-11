module.exports = {
  //works with just one room, need to add mulit-room functionality
  getCurrentRoom: function() {
    for (var name in Game.rooms) {
      return Game.rooms[name];
    }
  }
}