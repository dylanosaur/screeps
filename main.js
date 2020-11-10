var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

//let gcl_2 = () = {
//
//}

const get_controller_level = (Game) => {
    spawns = Object.keys(Game.spawns)
    primary_room = Game.spawns[spawns[0]].room
    var controller = primary_room.controller
    var control_level = controller.level
    return control_level
}

const count_creeps = () => {
    ncreeps = 0;
    nroles = [0, 0, 0];
    for (const i in all_creeps) {
        ncreeps += 1;
        creep = Game.creeps[i].memory;
        //console.log(creep.role, i);
        if (creep.role == 'harvester') {nroles[0] += 1;}
        if (creep.role == 'builder') {nroles[1] += 1;}
        if (creep.role == 'upgrader') {nroles[2] += 1;}
    }
    //console.log(ncreeps);
    console.log('harvesters', nroles[0], 'builders', nroles[1], 'upgraders', nroles[2]);
    nharvesters = nroles[0]; nbuilders = nroles[1]; nupgraders = nroles[2];
    return nroles
}

const spawn_creeps = (nroles, desired_creep_count) => {
    nharvesters = nroles[0]; nbuilders = nroles[1]; nupgraders = nroles[2];
    if (nharvesters < desired_creep_count[0]) {
        name = 'Worker'+Game.time%1000;
        Game.spawns['Primary'].spawnCreep([WORK, CARRY, MOVE], name, {memory: {role: 'harvester'} });
    }
    return
}
module.exports.loop = function () {

    all_creeps = Game.creeps;
    spawns = Object.keys(Game.spawns)
    control_level = get_controller_level(Game)
    if (control_level == 1) {
        nroles = count_creeps()
        nharvesters = nroles[0]; nbuilders = nroles[1]; nupgraders = nroles[2];
        spawn_creeps(nroles, [4,0,0])
    }


//    if (nbuilders<5) {
//        name = 'Worker'+Game.time%1000;
//        Game.spawns['Primary'].spawnCreep([WORK, CARRY, CARRY, MOVE], name, {memory: {role: 'builder'} });
//    }
//    if (nupgraders<5) {
//        name = 'Worker'+Game.time%1000;
//        Game.spawns['Primary'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE], name, {memory: {role: 'upgrader'} });
//    }
    

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
