module.exports = {
  addTimeQueueTask: function(targetClass, targetId, action, time) {
    var list = (Memory.timeQueue[time]) ? Memory.timeQueue[time] : {};
    list[targetId] = {
      class: targetClass,
      action: action
    };
    Memory.timeQueue[time] = list;
  },
  getMemoryFieldClass: function(field) {
    const fieldMap = {
      target: 'RoomObject',
    };
    return fieldMap[field]
  },
  handleTimeQueueList: function(time, list) {
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
    delete Memory.timeQueue[time];
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