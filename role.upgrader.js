var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //creep.say('upgrader');
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
            var rcl = Game.spawns[spawns[0]].room.controller.level;
            //console.log('rcl', rcl);
            var sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        // should only use energy from spawn if rcl is 1
                        return ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && (structure.store[RESOURCE_ENERGY] >0))
                    }
            });
            //.log(JSON.stringify(sources));
            const myTarget = creep.pos.findClosestByPath(sources)
            var withdraw_result = creep.withdraw(myTarget, RESOURCE_ENERGY);
            if (withdraw_result == ERR_NOT_IN_RANGE) {
                //console.log('moving to spawn');
                creep.moveTo(myTarget, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            else {
                //console.log(JSON.stringify(myTarget));
                //console.log('result', withdraw_result);
            }
        }
	}
};

module.exports = roleUpgrader;