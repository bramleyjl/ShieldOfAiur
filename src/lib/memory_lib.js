module.exports = {
  getMemoryFieldClass: function(field) {
    const fieldMap = {
      target: 'RoomObject',
    };
    return fieldMap[field]
  }
}