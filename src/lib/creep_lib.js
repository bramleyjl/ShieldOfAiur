module.exports = {
  getCreepRoleAbilities: function(role) {
    var abilities = [];
    switch (role) {
      case 'energyHarvester':
        abilities = [WORK, WORK, MOVE];
        break;
      case 'transporter':
        abilities = [CARRY, CARRY, MOVE];
        break;
      default:
        abilities = [WORK, CARRY, MOVE];
        break;
    }
    return abilities;
  },
}