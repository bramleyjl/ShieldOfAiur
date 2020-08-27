module.exports = {
  // addTimeQueueTask: function(targetClass, targetId, action, time) {
  //   var list = (Memory.timeQueue[time]) ? Memory.timeQueue[time] : {};
  //   list[targetId] = {
  //     class: targetClass,
  //     action: action
  //   };
  //   Memory.timeQueue[time] = list;
  // },
  checkObjectSafe: function (objMemory) {
    if (objMemory.safe === false && objMemory.safeCheck === Game.time) {
      objMemory.safe = true;
      objMemory.safeCheck = "";
    }
  },
  getMemoryFieldClass: function (field) {
    const fieldMap = {
      target: "RoomObject",
    };
    return fieldMap[field];
  },
  handleTimeQueueList: function (time, list) {
    Object.keys(list).forEach((key) => {
      handleTimeQueueListItem(key, list[key]);
    });
    delete Memory.timeQueue[time];
  },
  transformToId: function (obj) {
    return obj.id;
  },
  transformToIds: function (objs) {
    return objs.map((obj) => {
      return obj.id;
    });
  },
};

//function handleTimeQueueListItem(id, listItem) {}
