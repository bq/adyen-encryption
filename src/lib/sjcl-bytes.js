/* jshint ignore:start */ 

/**
 * Workaround for the missing bytes codec in sjcl builds
 *
*/
var sjcl = require('sjcl');

sjcl.codec.bytes = {
    fromBits: function(g) {
        var f = [],
            j = sjcl.bitArray.bitLength(g),
            i, h;
        for (i = 0; i < j / 8; i++) {
            0 === (i & 3) && (h = g[i / 4]), f.push(h >>> 24), h <<= 8
        }
        return f
    },
    toBits: function(f) {
        var e = [],
            h, g = 0;
        for (h = 0; h < f.length; h++) {
            g = g << 8 | f[h], 3 === (h & 3) && (e.push(g), g = 0)
        }
        h & 3 && e.push(sjcl.bitArray.partial(8 * (h & 3), g));
        return e
    }
};

module.exports = sjcl

/* jshint ignore:end */