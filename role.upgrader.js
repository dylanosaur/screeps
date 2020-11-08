var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.say('upgrader');
        if(creep.carry.energy ==0) { creep.upgrading = false;}
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) && structure.energy >0;
                    }
            });
            const myTarget = creep.pos.findClosestByPath(sources)
            if(creep.withdraw(myTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                console.log('moving to spawn');
                creep.moveTo(myTarget, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	}
};

module.exports = roleUpgrader;