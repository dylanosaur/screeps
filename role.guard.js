const flatDistance = require('flatDistance');


var roleGuard = {
    /** @param {Creep} creep **/
    run: function(creep) {
        
        creep.say("hey :)");
        targets = creep.room.find(FIND_HOSTILE_CREEPS);
        targets.sort((a,b) => flatDistance(creep,a,b))
        //targets = targets.filter(x => x.owner.username != "sulliken")
        //targets.push(Game.getObjectById("5f78ec833e77a11d732381b6")); // a wall to destory to improve efficiency for theifs
        //targets.push(Game.getObjectById("5f72084bb1c5052343a5d940")); // a wall to destory to improve efficiency for theifs
        // console.log(JSON.stringify(targets));
        if (targets.length >0) {
            creep.say("kill :)");
            attack_result = creep.attack(targets[0]);
            //ranged_result = creep.rangedAttack(targets[0]);
            ranged_result = -9;
            if (attack_result == ERR_NOT_IN_RANGE && ranged_result == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            creep.say("friend :)");
            rally_flag = Game.flags.Guard;
            //console.log(JSON.stringify(rally_flag));
            creep.moveTo(rally_flag, {visualizePathStyle: {stroke: '#ffffff'}});
            // console.log(creep.rangedAttack(Game.getObjectById("5d2452c1eaa77315241f752d")));
            creep.heal(creep);
        }
    }
}

module.exports = roleGuard;