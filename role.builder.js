const flatDistance = require('flatDistance');



var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        //creep.say('builder');
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	        targets.sort((a,b) => flatDistance(creep,a,b));
	        
            var towers = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => 
                {
                    return ((structure.structureType == STRUCTURE_TOWER) 
                        && (structure.store) 
                        && (structure['store'].getFreeCapacity(RESOURCE_ENERGY) > 0)); 
                }
            });
            
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.repair_target = targets[0].id;
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else if (towers.length) {
                var transfer_result = creep.transfer(towers[0], RESOURCE_ENERGY);
                if (transfer_result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(towers[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else {
                    console.log('tower xfer result', transfer_result);
                }
            }
            else { 
                creep.say('repair');
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_RAMPART &&
                        structure.hits <structure.hitsMax/20);
                    }
                })
                if (targets.length) { 
                    creep.memory.repair_target = targets[0].id;
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    return;
                }
                else { 
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.hits <structure.hitsMax);
                        }
                    })
                    if (targets.length) { 
                        creep.memory.repair_target = targets[0].id;
                        if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                        return;
                    }
                }
            }
	    }
	    else {
	        creep.memory.building = false;
	        var sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] >0;
                    }
            });
            sources.sort((a,b) => flatDistance(creep,a,b));
            if (creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleBuilder;