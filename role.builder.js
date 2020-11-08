var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.say('builder');
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
	        console.log(creep.memory.repair_target);
	        console.log(Game.getObjectById(creep.memory.repair_target))
	        if (typeof creep.memory.repair_target === 'undefined') {
	            console.log('found undef instance');
	            creep.memory.repair_target = null;
	        }
	        if (creep.memory.repair_target != null) { 
	        if (Game.getObjectById(creep.memory.repair_target) != null){
	            target = Game.getObjectById(creep.memory.repair_target)
	            console.log('found repair target');
	            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if (target.hits < 5000) { return;}
                else { creep.memory.repair_target = null; }
	        }
	        }

            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.repair_target = targets[0].id;
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
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
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) && structure.energy >0;
                    }
            });
            if(creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                console.log('moving to spawn');
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleBuilder;