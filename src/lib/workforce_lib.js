module.exports = {
  getRoleCount: function (room, role) {
    var roster = room.workforce.roster[role]
      ? room.workforce.roster[role].length
      : 0;
    var dispatched = room.workforce.dispatched[role]
      ? room.workforce.dispatched[role].length
      : 0;
    return roster + dispatched;
  },
  removeFromRoster: function (room, roster, creeps) {
    var purgedRoster = room.workforce.roster[roster].filter((creepKey) => {
      return creeps.indexOf(creepKey) < 0;
    });
    room.workforce.roster[roster] = purgedRoster.length > 0 ? purgedRoster : [];
    room.workforce.dispatched[roster] = room.workforce.dispatched[
      roster
    ].concat(creeps);
  },
};
