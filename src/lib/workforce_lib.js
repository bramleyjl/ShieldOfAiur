module.exports = {
  removeFromRoster: function(room, roster, creeps) {
    var purgedRoster = room.workforce.roster[roster].filter(creepKey => {
      return creeps.indexOf(creepKey) < 0;
    });
    room.workforce.roster[roster] = (purgedRoster.length > 0) ? purgedRoster : [];
    room.workforce.dispatched[roster] = room.workforce.dispatched[roster].concat(creeps);
  }
}