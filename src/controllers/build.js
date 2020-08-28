var lib = require("lib.lib");
var workforceLib = require("lib.workforce_lib");
var harvestController = require("controllers.harvest");

module.exports = {
  run: function () {
    var currentRoom = lib.getCurrentRoom();
    var roomLevel = currentRoom.controller.level;
    calculatePriorities(currentRoom, roomLevel);
  },
};

function calculatePriorities(room, roomLevel) {
  var builders = room.workforce.roster.builder;
  if (!room.memory.projects) {
    var constructionTargets = calculateConstructionTargets(room, roomLevel);
  } else {
    var constructionTargets = calculateConstructionTargets(
      room,
      roomLevel,
      true
    );
  }
  var repairTargets = calculateRepairTargets(room, roomLevel);
  var openHarvestSpaces = room.getOpenHarvestSpaces();
  var canHarvest = openHarvestSpaces > 0 ? true : false;
  switch (roomLevel) {
    case 0:
    case 1:
      //arbitrary condition of "enough resource gathering to warrant upgrading"
      if (room.workforce.energyTeamCount >= room.resources.energy.length / 2) {
        var upgradeTeam = room.reinforceRosterActionGroup(
          "builder",
          "upgrade",
          ["transportDeposit", "forceDeposit"],
          2
        );
        dispatchUpgradeOrders(upgradeTeam, room, "builder", canHarvest);
      }
      break;
    case 2:
      if (room.workforce.energyTeamCount >= room.resources.energy.length) {
        //level 2 condition not yet defined, focus on construction first
        if (1 === 2) {
          var upgradeTeam = room.reinforceRosterActionGroup(
            "builder",
            "upgrade",
            ["transportDeposit", "forceDeposit"],
            2
          );
          dispatchUpgradeOrders(upgradeTeam, room, "builder", canHarvest);
        }
        var constructionTeam = room.reinforceRosterActionGroup(
          "builder",
          "build",
          ["transportDeposit", "forceDeposit"]
        );
        dispatchConstructOrders(
          constructionTeam,
          room,
          "builder",
          constructionTargets
        );
      }
      break;
    default:
      //no default, extra builders sent to farm below
      break;
  }
  //cleanup for any unused builders
  var cleanupBuilders = room.workforce.roster.builder;
  if (cleanupBuilders.length > 0) {
    if (canHarvest) {
      dispatchFarmOrders(cleanupBuilders, room, "builder");
    } else {
      harvestController.dispatchTransportOrders(
        cleanupBuilders,
        room,
        "builder",
        "refuel"
      );
    }
  }
}

function calculateConstructionTargets(room, roomLevel, update = false) {
  var projects = update ? room.memory.projects : [];
  calculateRoadTargets(room, projects, update);
  // calculateWallTargets(start, end);
  room.memory.projects = projects;
  return projects;
}

function calculateRepairTargets(room, roomLevel) {}

function calculateRoadTargets(room, projects, update) {
  //calculate which sources are getting farmed and build roads to them
  var sources = room.resources.energy;
  var builtSources = 0;
  if (update) {
    sources = sources.filter((source) => {
      if (room.memory.sources[source.id].developed === false) {
        return true;
      } else {
        builtSources += 1;
        return false;
      }
    });
    var sourceRoadProjects = room.memory.projects.filter((project) => {
      return project.targetClass === "source";
    });
    sourceRoadProjects.forEach((project) => {
      for (var i = sources.length - 1; i >= 0; i--) {
        if (project.targetId === sources[i].id) {
          sources.splice(i, 1);
          break;
        }
      }
    });
  }
  //maybe change to range from spawn instead of energyDeficit??
  if (sources.length > 0) {
    sources.sort(function compare(a, b) {
      return a.energyDeficit < b.energyDeficit;
    });
    var source = sources[0];
    var target = source.pos.findClosestByPath(
      room.getStorageTargets(RESOURCE_ENERGY, true)
    );
    var roadArgs = {
      targetId: source.id,
      targetClass: "source",
      structure: STRUCTURE_ROAD,
    };
    var projectCount = sourceRoadProjects ? sourceRoadProjects.length : 0;
    switch (builtSources + projectCount) {
      //high prio for # 1 & 2, lower for rest
      case 0:
        roadArgs.priority = 1000;
        break;
      case 1:
        roadArgs.priority = 800;
        break;
      default:
        roadArgs.priority = 500;
        break;
    }
    var roadJob = queueLongStructure(source, target, roadArgs);
    projects.push(roadJob);
  }
}

function dispatchConstructOrders(team, room, roster, targets) {
  if (Object.keys(Game.constructionSites).length === 0) {
    startNewConstructionProject(room, targets);
  }
  var builderIndex = 0;
  for (var siteKey in Game.constructionSites) {
    var site = Game.constructionSites[siteKey];
    var builder = Game.creeps[team[builderIndex]];
    if (builder) {
      if (
        builder.store.getUsedCapacity() > 0 &&
        (builder.store.getFreeCapacity() === 0 ||
          builder.memory.action === "build")
      ) {
        var enoughWork = site.checkIncomingWork();
        if (!enoughWork) {
          //add else condition to go check next construction site instead of doing nothing
          var attempt = builder.construct(site);
          room.controller.incomingWork += builder.store.getUsedCapacity(
            RESOURCE_ENERGY
          );
        }
        workforceLib.removeFromRoster(room, roster, [team[builderIndex]]);
      }
      builderIndex += 1;
    } else {
      break;
    }
  }
}

function startNewConstructionProject(room, targets) {
  var startedTarget = targets.filter((target) => {
    return target.started;
  });
  if (startedTarget.length > 0) {
    var target = startedTarget[0];
  } else {
    targets = targets.sort((a, b) => {
      return a.priority < b.priority;
    });
    var target = targets[0];
  }
  target.sites.forEach((site) => {
    room.createConstructionSite(site.pos.x, site.pos.y, site.type);
    var constructionSite = room.lookForAt(
      LOOK_CONSTRUCTION_SITES,
      site.pos.x,
      site.pos.y
    );
    console.log(constructionSite);
  });
  target.started = true;
}

function dispatchFarmOrders(team, room, roster) {
  var storageTargets = room.getStorageTargets();
  var depositors = team.filter((creepId) => {
    var creep = Game.creeps[creepId];
    return creep.shouldDeposit(RESOURCE_ENERGY);
  });
  var harvesters = team.filter((creepId) => {
    return depositors.indexOf(creepId) < 0;
  });
  harvestController.dispatchHarvestOrders(harvesters, room, "builder");
  harvestController.dispatchTransportOrders(depositors, room, "builder");
}

function dispatchUpgradeOrders(team, room, roster, canHarvest) {
  var farmers = [];
  team.forEach((creepId) => {
    var creep = Game.creeps[creepId];
    if (
      creep.store.getUsedCapacity() > 0 &&
      (creep.store.getFreeCapacity() === 0 || creep.memory.action === "upgrade")
    ) {
      var enoughWork = room.controller.checkIncomingWork();
      if (!enoughWork) {
        creep.upgrade(room.controller, room.resources["energy"]);
        room.controller.incomingWork += creep.store.getUsedCapacity(
          RESOURCE_ENERGY
        );
      }
      workforceLib.removeFromRoster(room, roster, [creepId]);
    }
  });
}

function calculateWallTargets(start, end) {
  return queueLongStructure(start, end);
}

function queueLongStructure(start, end, structureArgs) {
  var job = {
    targetId: structureArgs.targetId,
    targetClass: structureArgs.targetClass,
    priority: structureArgs.priority,
    started: false,
    sites: [],
  };
  var jobPath = start.pos.findPathTo(end);
  jobPath.forEach((pos) => {
    var consTask = {
      type: structureArgs.structure,
      pos: pos,
      //add width, rampart length here
    };
    job.sites.push(consTask);
    //push is append on arrays <- for pfitsches
  });
  return job;
}
