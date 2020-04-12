module.exports = {
  getCreepRoleAbilities: function(role) {
    var abilities = [];
    switch (role) {
      case 'energyHarvester':
        abilities = [WORK, CARRY, MOVE];
        break;
      case 'transporter':
        abilities = [WORK, CARRY, MOVE];
        break;
      default:
        abilities = [WORK, CARRY, MOVE];
        break;
    }
    return abilities;
  },
}