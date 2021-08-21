const flatDistance = require('flatDistance');


var roleTheif = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
	    if(creep.carry.energy < creep.carryCapacity && !creep.memory.target_source && !creep.memory.depositing) {
	        creep.say("theif");
            var sources = Game.getObjectById("5fedd59bd476a31d09330699");
            creep.memory.target_source = "5fedd59bd476a31d09330699";
            creep.moveTo(rally_flag, {visualizePathStyle: {stroke: '#ffffff'}});

        }
        else if (creep.carry.energy < creep.carryCapacity && creep.room != Game.rooms['E18S24'] && !creep.memory.depositing) {
            creep.say("travel");
            rally_flag = Game.flags.Rally;
            //console.log(JSON.stringify(rally_flag));
            creep.moveTo(rally_flag, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        else if (creep.carry.energy < creep.carryCapacity && creep.room == Game.rooms['E18S24']) {
            
            creep.say("shhh");
            var target_source = Game.getObjectById("5fedd59bd476a31d09330699")
            //console.log(target_source);
            var harvest_result = creep.withdraw(target_source, RESOURCE_ENERGY);
            if( harvest_result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target_source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            // else if (harvest_result == ERR_INVALID_TARGET) {
            //     creep.memory.target_source = null;
            // }
            else if (harvest_result != 0 && harvest_result != -4 && harvest_result != -6) {
                console.log("extract failure", harvest_result);
                creep.moveTo(rally_flag, {visualizePathStyle: {stroke: '#ffffff'}});

            }
        }
        else if (creep.room != Game.rooms['E17S24'] && creep.carry.energy == creep.carryCapacity && !creep.memory.depositing) {
            creep.say("home");
            creep.moveTo(Game.spawns['Spawn1'])
        }
        else if (creep.room == Game.rooms['E17S24'] && creep.carry.energy > 0) {
            creep.say("dep");
            creep.memory.depositing = true;
            // creep.memory.resource_target = null;
            // updated to not prioritize bringing to spawn, since spawn generates res on its own
            var primary_targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == '') && structure.energy < (structure.energyCapacity-50);
                    }
            });
            var secondary_targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION) && structure.energy < (structure.energyCapacity);
                    }
            });
            secondary_targets.sort((a,b) => flatDistance(creep,a,b))
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            
                            (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && 
                                (structure.store[RESOURCE_ENERGY] < structure.store.getCapacity([RESOURCE_ENERGY]))
                        );
                    }
            });
            targets.sort((a,b) => flatDistance(creep,a,b))

            primary_targets = [];
            secondary_targets = [];
            if (primary_targets.length >0) {
                if(creep.transfer(primary_targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(primary_targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else if (secondary_targets.length >0) {
                if(creep.transfer(secondary_targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(secondary_targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                creep.memory.depositing = false;
            }
        }
        else {
            creep.say("idk");
            creep.memory.depositing = false;
            creep.moveTo(Game.spawns['Spawn1'])
        }
	}
};

module.exports = roleTheif;