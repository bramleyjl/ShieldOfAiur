module.exports = {
  addToDo: function(targetClass, targetId, action, time) {
    var timeToDo = (Memory.toDo[time]) ? Memory.toDo[time] : {};
    timeToDo[targetId] = {
      class: targetClass,
      action: action
    };
    Memory.toDo[time] = timeToDo;
  },
  getMemoryFieldClass: function(field) {
    const fieldMap = {
      target: 'RoomObject',
    };
    return fieldMap[field]
  },
  handleToDoList: function(time, list) {
    Object.keys(list).forEach(key => {
      var targetClass = list[key].class;
      var action = list[key].action;
      switch (action) {
        case 'markSafe':
          if (targetClass === 'source') {
            //instantiate source object
            //get room from source object, instantiate room object
            // use room.js new markTargetSafe method
            // update markTargetUnsafeMethod to not include
          }
          var attempt = this.build(target);
          break;
      }
    });
    delete Memory.toDo[time];
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