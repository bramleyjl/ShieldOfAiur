module.exports = {
  getCreepRoleAbilities: function(role) {
    var abilities = [];
    switch (role) {
      case 'energyHarvester':
        abilities = [WORK, WORK, MOVE];
        break;
      case 'transporter':
        abilities = [CARRY, CARRY, CARRY, MOVE, MOVE];
        break;
      case 'claimer':
        abilities = [CLAIM, CARRY, WORK, MOVE];
        break;
      case 'upgrader':
        abilities = [WORK, CARRY, CARRY, MOVE];
        break;
      case 'basic':
      default:
        abilities = [CARRY, WORK, MOVE];
        break;
    }
    return abilities;
  },
}