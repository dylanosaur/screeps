const flatDistance = require('flatDistance');


const findAndWithdrawEnergy = (creep) => {
    var sources = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) 
                && structure.store[RESOURCE_ENERGY] >0
            );
        }
    });
    sources.sort((a,b) => flatDistance(creep,a,b));
    result = creep.withdraw(sources[0], RESOURCE_ENERGY);
    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
    }
    else if (result == 0) {
        creep.memory.state = 'fill';
    }
    else if (result == ERR_INVALID_TARGET) {
        creep.moveTo(nursePath[0][0], nursePath[0][1]);
    }
    else if (result == ERR_FULL) {
        creep.memory.state = 'fill';
    }
    else if (result == -4) {}
    else {
        console.log("nurse load error", result);
    }
}
    
var nursePath = [
    [33, 31], [32, 32], [33, 33], [32, 34],
    [33, 35], [34, 34], [35, 35], [36, 34],
    [35, 33], [36, 32], [35, 31], [34, 32]
]

const walkNursePath = (creep) => {
    // check that creep is on path
    var position = [creep.pos.x, creep.pos.y];
    // console.log("nurse pos", [creep.pos.x, creep.pos.y]);
    var positionOnPath = nursePath.findIndex(x => (x[0] == creep.pos.x && x[1] == creep.pos.y))
    // console.log("nurse position", positionOnPath);
    if (positionOnPath >= 0) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    (structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_TOWER) 
                    && structure.energy < structure.energyCapacity
                );
            }
        });
        targets.sort((a,b) => flatDistance(creep,a,b));
        // console.log(targets);
        result = creep.transfer(targets[0], RESOURCE_ENERGY)
        if (result == ERR_NOT_IN_RANGE) {
            newPositionOnPath = (positionOnPath+1)%nursePath.length;
            creep.moveTo(nursePath[newPositionOnPath][0], nursePath[newPositionOnPath][1], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        else if (result == 0) {
            // fill succeeded, keep filling and walking path
        }
        else if (result == ERR_NOT_ENOUGH_ENERGY) {
            creep.moveTo(nursePath[0][0], nursePath[0][1]);
        }
        else if (result == ERR_INVALID_TARGET) {
            // usually when everything is topped off
            creep.moveTo(nursePath[0][0], nursePath[0][1]);
            creep.memory.state = "load";
        }
        
        else {
            console.log("nurse fill error", result);
        }
    }
    else {
        creep.moveTo(nursePath[0][0], nursePath[0][1])
    }
    if (creep.store[RESOURCE_ENERGY] < 1) {
        creep.memory.state = 'load';
    }
}
	   
        
        
var roleNurse = {
   
    /** @param {Creep} creep **/
    run: function(creep) {
        
        if (creep.ticksToLive < 100) {
            creep.memory.state = 'renew';
        }
        //console.log(creep.ticksToLive < 100, creep.ticksToLive);
        creep.memory.renewReady = creep.ticksToLive < 100;
        state = creep.memory.state;
        //creep.say(state);
        switch(state) {
            case 'load':
                findAndWithdrawEnergy(creep);
                break;
            case 'fill':
                walkNursePath(creep);
                break;
            case 'renew':
                creep.moveTo(nursePath[0][0], nursePath[0][1]);
                creep.memory.renewReady = true;
                if (creep.ticksToLive > 100) {
                    creep.memory.state = 'load';
                    creep.memory.renewReady = false;
                }
                break;
            default:
                creep.memory.state = 'load';
                break;
        }
	}
};

module.exports = roleNurse;