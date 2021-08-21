const flatDistance = require('flatDistance');

const moveToSource = (creep) => {
    target = Game.getObjectById(creep.memory.target_source);
    extract_result = creep.harvest(target, RESOURCE_ENERGY);
    if (extract_result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
    else if (extract_result == 0) {
        creep.memory.state = 'extract';
    }
    else if (extract_result == 0 || extract_result == -4 || extract_result == -6) {}
    else {
        console.log("travel failure", extract_result);
    }
}

const extractFromSource = (creep) => { 
    work_tick = _.filter(creep.body, function(bp){return bp.type == WORK;}).length*2;

    // else if still room in capacity to hold more energy then keep extracting
    if (creep.carry.energy < (creep.carryCapacity - creep.carryCapacity%work_tick)) {
        var target_source = Game.getObjectById(creep.memory.target_source)
        var harvest_result = creep.harvest(target_source);
        if (harvest_result == ERR_INVALID_TARGET) {
            console.log("extract failure invalid target", harvest_result);
        }
        else if (harvest_result == 0 || harvest_result == -6) {}
        else {
            console.log("extract failure", harvest_result);
        }
    }
    // transfer energy to container energy if next tick would only partially harvest
    else if (creep.carry.energy == (creep.carryCapacity - creep.carryCapacity%work_tick)) {
        container = Game.getObjectById(creep.memory.container);
        if (!container) {
            creep.memory.state = 'build';
            return;
        }
        else if (container.hits < 0.5*container.hitsMax) {
            creep.repair(container);
        }
        else {
            creep.transfer(container, RESOURCE_ENERGY)
        }
    }
    else {
        creep.drop(RESOURCE_ENERGY);
    }
}

const buildContainer = (creep) => { 

    if (creep.carry.energy == 0) {
        creep.memory.state = 'extract';
        return;
    }
    containers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                structure.structureType == STRUCTURE_CONTAINER
                && structure.pos.x == creep.pos.x 
                && structure.pos.y == creep.pos.y 
                && structure.isActive()
            )
        }
    });
    if (containers.length > 0) {
        creep.memory.container = containers[0].id;
        creep.memory.state = 'extract';
        return;
    }

    if (!creep.memory.containerSite) {
        containerSites = creep.room.find(FIND_CONSTRUCTION_SITES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_CONTAINER
                    && structure.pos.x == creep.pos.x 
                    && structure.pos.y == creep.pos.y 
                )
            }
        });
        if (containerSites.length > 0) {
            creep.memory.containerSite = containerSites[0].id;
        } else {
            creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_CONTAINER);
        }
    }
    creep.build(Game.getObjectById(creep.memory.containerSite));
   
}



var roleExtractor = {

    // /** @param {Creep} creep **/
    // run: function(creep) {
    //     // energy harvested per tick
    //     work_tick = (_.filter(creep.body, function(bp){return bp.type == WORK;}).length)*2;
    //     // assign source to creep
	//     if (creep.carry.energy < creep.carryCapacity && !creep.memory.target_source) {
    //         var sources = creep.room.find(FIND_SOURCES);
    //         creep.memory.target_source = sources[Memory['extractor_index']%sources.length].id;
    //         Memory['extractor_index'] = (Memory['extractor_index']+1)%2;
    //     }
    //     // else if still room in capacity to hold more energy then keep extracting
    //     else if (creep.carry.energy < (creep.carryCapacity - creep.carryCapacity%work_tick)) {
    //         creep.say("working");
    //         var target_source = Game.getObjectById(creep.memory.target_source)
    //         var harvest_result = creep.harvest(target_source);
    //         if( harvest_result == ERR_NOT_IN_RANGE) {
    //             creep.moveTo(target_source, {visualizePathStyle: {stroke: '#ffaa00'}});
    //         }
    //         else if (harvest_result == ERR_INVALID_TARGET) {
    //             console.log("extract failure", harvest_result);
    //             creep.memory.target_source = null;
    //         }
    //         else if (harvest_result != 0 && harvest_result != -4 && harvest_result != -6) {
    //             console.log("extract failure", harvest_result);
    //         }
    //     }
    //     // drop energy if next tick would only partially harvest
    //     else {
    //         creep.drop(RESOURCE_ENERGY);
    //     }
	// }

    /** @param {Creep} creep **/
    run: function(creep) {
    
        state = creep.memory.state;
        creep.say(state);
        switch(state) {
            case 'travel':
                moveToSource(creep);
                break;
            case 'extract':
                extractFromSource(creep);
                break;
            case 'build':
                buildContainer(creep);
                break;
            default:
                // default state creep is born into
                var sources = creep.room.find(FIND_SOURCES);
                creep.memory.target_source = sources[Memory['extractor_index']%sources.length].id;
                creep.memory.state = 'travel';
                break;
        }
    }
};

module.exports = roleExtractor;