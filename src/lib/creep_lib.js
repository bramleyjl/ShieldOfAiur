module.exports = {
  getCreepRoleParts: function(role) {
    var parts = [];
    switch (role) {
      case 'builder':
        parts = [WORK, CARRY, CARRY, MOVE, MOVE];
        break;
      case 'energyHarvester':
        parts = [WORK, WORK, MOVE];
        break;
      case 'transporter':
        parts = [CARRY, CARRY, CARRY, MOVE, MOVE];
        break;
      case 'claimer':
        parts = [CLAIM, CARRY, WORK, MOVE];
        break;
      case 'basic':
      default:
        parts = [WORK, CARRY, MOVE];
        break;
    }
    return parts;
  },
}