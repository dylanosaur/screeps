/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('flatDistance');
 * mod.thing == 'a thing'; // true
 */

const flatDistance = (creep, a, b) => {
    var deltax_a = a.pos.x - creep.pos.x
    var deltay_a = a.pos.y - creep.pos.y
    
    var deltax_b = b.pos.x - creep.pos.x
    var deltay_b = b.pos.y - creep.pos.y
    
    if (deltax_a <0) deltax_a *= -1
    if (deltay_a <0) deltay_a *= -1
    
    if (deltax_b <0) deltax_b *= -1
    if (deltay_b <0) deltay_b *= -1
    
    var delta_a = 0;
    if (deltax_a < deltay_a) { 
        delta_a = deltay_a
    }
    else {
        delta_a = deltax_a
    }
    
    var delta_b = 0;
    if (deltax_b < deltay_b) { 
        delta_b = deltay_b
    }
    else {
        delta_b = deltax_b
    }
    return delta_a - delta_b
}
module.exports = flatDistance;