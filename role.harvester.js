const flatDistance = require('flatDistance');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {   

	    if(creep.store[RESOURCE_ENERGY] == 0 && !creep.memory.resource_target) {
            if (creep.ticksToLive < 50) { creep.suicide();}
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] >0;
                }
            });
            targets.sort((a,b) => (b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]))
            harvesters = _(Game.creeps).filter({ memory: { role: 'harvester' }}).map(x => x.name);
            var rsi = harvesters.indexOf(creep.name);
            var target_index = 0;
            if (targets.length && !creep.memory.resource_target) {
                creep.memory.resource_target = targets[target_index].id
                //creep.say("target "+creep.memory.resource_target.pos.x+""+creep.memory.resource_target.pos.y)
            }
        }
        if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) creep.memory.resource_target = null;
        if (creep.memory.resource_target && (creep.store[RESOURCE_ENERGY] == 0)) {
                try {
                    resource_target = Game.getObjectById(creep.memory.resource_target)
                    //console.log(JSON.stringify(resource_target));
                    creep.say("using "+resource_target.pos.x+""+resource_target.pos.y)
                    result = creep.withdraw(resource_target, RESOURCE_ENERGY);
                    if (result == ERR_NOT_IN_RANGE) {
                        creep.moveTo(resource_target);
                    }

                    //console.log("withraw harv result", result);
                } catch (error) {
                    console.log(error);
                    creep.memory.resource_target = null;
                }
            }
        else {

            primary_targets = [];

            secondary_targets = [];
            secondary_targets.sort((a,b) => flatDistance(creep,a,b))
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            (structure.structureType == STRUCTURE_STORAGE) && 
                            (structure.store[RESOURCE_ENERGY] < structure.store.getCapacity([RESOURCE_ENERGY]))
                        );
                    }
            });
            targets.sort((a,b) => flatDistance(creep,a,b))

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
                var transfer_result = creep.transfer(targets[0], RESOURCE_ENERGY)
                if(transfer_result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else {
                    creep.memory.resource_target = null;
                }
            }
        }
	}
};

module.exports = roleHarvester;