var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleExtractor = require('role.extractor');
var roleGuard = require('role.guard');
var roleTheif = require('role.theif');
var roleNurse = require('role.nurse');


const get_controller_level = (Game) => {
    spawns = Object.keys(Game.spawns)
    primary_room = Game.spawns[spawns[0]].room
    var controller = primary_room.controller
    var control_level = controller.level
    return control_level
}

function defendRoom(roomName) {
    var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
    if(hostiles.length > 0) {
        var username = hostiles[0].owner.username;
        Game.notify(`User ${username} spotted in room ${roomName}`);
        var towers = Game.rooms[roomName].find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => tower.attack(hostiles[0]));
    }
}

const count_creeps = () => {
    ncreeps = 0;
    nroles = {
        'extractor': 0,
        'harvester': 0,
        'builder': 0,
        'upgrader': 0,
        'guard': 0,
        'theif': 0,
        'nurse': 0,
    }
    for (const i in all_creeps) {
        creep = Game.creeps[i].memory;
        if (Game.creeps[i].ticksToLive < 80) {
            continue;
        }
        ncreeps += 1;
        nroles[creep.role] += 1;
    }
    // console.log(JSON.stringify(nroles));
    return nroles
}


// constants are built into game so that MOVE == "move"
BODYPART_COST = { "move": 50, "work": 100, "attack": 80, "carry": 50, "heal": 250, "ranged_attack": 150, "tough": 10, "claim": 600 }
const bodyCost = (body) => {
    var sum = 0;
    for (var i in body)
        sum += BODYPART_COST[body[i].type || body[i]];
    return sum;
}
const attack_body_sort = (a,b) => {
    priority = [TOUGH, MOVE, ATTACK, RANGED_ATTACK, HEAL]
    a_priority = priority.indexOf(a);
    b_priority = priority.indexOf(b);
    return a_priority - b_priority
}
const build_body = (required_parts, repeating_parts, available_energy, maximum_cost) => {
    creep_body = [];
    var req_part_cost = bodyCost(required_parts);
    var rep_part_cost = bodyCost(repeating_parts);
    base_cost = req_part_cost + rep_part_cost;
    creep_body.push(...required_parts);
    while(base_cost < available_energy && base_cost < maximum_cost) {
        creep_body.push(...repeating_parts);
        base_cost += rep_part_cost;
    }
    if (creep_body.indexOf("tough") >= 0) creep_body.sort((a,b) => attack_body_sort(a,b));
    return creep_body
}

const spawn_creeps = (nroles, desired_creep_count) => {
    bodies = {
        'nurse': {
            'required': [CARRY, MOVE],
            'repeating': [CARRY, MOVE],
            'maximum_cost': 400,
            'directions': [BOTTOM]
        },
        'extractor': {
            'required': [CARRY, MOVE],
            'repeating': [WORK, MOVE, CARRY],
            'maximum_cost': 1300,
            'directions': [TOP_LEFT, TOP, TOP_RIGHT]
        },
        'harvester': {
            'required': [CARRY, MOVE],
            'repeating': [CARRY, MOVE],
            'maximum_cost': 801,
            'directions': [TOP_LEFT, TOP, TOP_RIGHT]
        },
        'builder': {
            'required': [WORK, CARRY, MOVE],
            'repeating': [WORK, CARRY, MOVE],
            'maximum_cost': 300,
            'directions': [TOP_LEFT, TOP, TOP_RIGHT]
        },
        'upgrader': {
            'required': [WORK, WORK, CARRY, MOVE],
            'repeating': [WORK, WORK, CARRY],
            'maximum_cost': 1000,
            'directions': [TOP_LEFT, TOP, TOP_RIGHT]
        },
        'guard': {
            'required': [TOUGH, MOVE, HEAL, MOVE],
            'repeating': [TOUGH, ATTACK, MOVE, MOVE],
            'maximum_cost': 2000,
            'directions': [TOP_LEFT, TOP, TOP_RIGHT]
        },
        'theif': {
            'required': [CARRY, MOVE],
            'repeating': [CARRY, MOVE],
            'maximum_cost': 1600,
            'directions': [TOP_LEFT, TOP, TOP_RIGHT]
        }
    }
    var extensions = Game.rooms['E17S24'].find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION);
        }
    }).map(x => x.energy);
    var extension_energy = extensions.reduce(function(acc, val) { return acc + val; }, 0)
    var available_energy = Game.spawns['Spawn1'].store[RESOURCE_ENERGY] + extension_energy;
    // if (available_energy < 300) return

    creep_roles = Object.keys(bodies);
    var spawning = false;
    for (var role of creep_roles) {
        if (spawning) break
        current_count = nroles[role];
        desired_count = desired_creep_count[role];
        //console.log(current_count, desired_count, role);
        if (current_count < desired_count) {
            var name = role + Game.time;
            body = build_body(bodies[role]["required"], bodies[role]["repeating"], available_energy, bodies[role]["maximum_cost"]);
            //console.log(body);
            Game.spawns['Spawn1'].spawnCreep(creep_body, name, {memory: {role: role}, directions: bodies[role]["directions"]});
            console.log("spawning", role);
            spawning = true
            if (role == 'extractor') {
                Memory['extractor_index'] = (Memory['extractor_index']+1)%2;
            }
        }
    }
}

const manage_creep_counts = () => {
    all_creeps = Game.creeps;
    spawns = Object.keys(Game.spawns)
    control_level = get_controller_level(Game);
    var construction_sites = Game.rooms['E17S24'].find(FIND_CONSTRUCTION_SITES);
    if (control_level === 1) {
    }
    else if (control_level === 2) {
    }
    else if (control_level === 3) {
    }
    else if (control_level >= 4) {
        var nroles = count_creeps();
        var desired_creep_counts = {
            'extractor': 2,
            'harvester': 3,
            'builder': construction_sites.length > 0?1:0,
            'upgrader': 2,
            'guard': 0,
            'theif': 0,
            'nurse': 1,
        }
        spawn_creeps(nroles, desired_creep_counts)
    }
}



const run_creeps = () => {
    all_creeps = Game.creeps;
    spawns = Object.keys(Game.spawns)
    control_level = get_controller_level(Game);
    Memory.creep_upkeep = 0;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'nurse') {
            roleNurse.run(creep);
        }
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'extractor') {
            roleExtractor.run(creep);
        }
        if(creep.memory.role == 'guard') {
            roleGuard.run(creep);
        }
        if(creep.memory.role == 'theif') {
            roleTheif.run(creep);
        }
        if (creep.ticksToLive < 800) {
            Game.spawns['Spawn1'].renewCreep(creep);
        }
        Memory.creep_upkeep += bodyCost(creep.body);
    }
    Memory.creep_upkeep = 100*Memory.creep_upkeep/1500;
}

module.exports.loop = function () {
    if (!Memory['extractor_index']) Memory['extractor_index'] = 0;
    if (!Memory['controller_history']) Memory['controller_history'] = [];
    if (!Memory['storage_history']) Memory['storage_history'] = [];
    if (Game.time%100 == 0) {
        var n = 50;
        manage_creep_counts();
        storage_energy = Game.getObjectById("611d670cf64f5e43e3350a3b").store[RESOURCE_ENERGY];
        delta_progress = Game.rooms['E17S24'].controller.progress - Memory.controller_progress;
        delta_storage =  storage_energy - Memory.storage_energy
        Memory.controller_progress = Game.rooms['E17S24'].controller.progress;
        Memory.storage_energy = storage_energy;
        Memory['storage_history'].unshift(delta_storage);
        Memory['storage_history'] = Memory['storage_history'].slice(0,n);
        Memory['controller_history'].unshift(delta_progress);
        Memory['controller_history'] = Memory['controller_history'].slice(0,n);
        var controller_average = Memory.controller_history.reduce((t,a) => (t+a))/n;
        var storage_average = Memory.storage_history.reduce((t,a) => (t+a))/n;
        var efficiency = (controller_average+storage_average+Memory.creep_upkeep)/2000;
        console.log("controller", controller_average, "storage", storage_average, "upkeep", Math.floor(Memory.creep_upkeep), "eff", Math.round(efficiency*100));
    }
    run_creeps();
    
    defendRoom('E17S24');
}
