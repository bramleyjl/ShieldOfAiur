module.exports = {
  getMemoryFieldClass: function(field) {
    const fieldMap = {
      target: 'RoomObject',
    };
    return fieldMap[field]
  },
  transformToId: function(obj) {
    return obj.id;
  },
  transformToIds: function(objs) {
    return objs.map(obj => {
      return obj.id;
    });
  }
}