'use strict';

/**
 * Basic code to parse the values in the "data" attribute in a Google Maps URL to an Array.
 * There will likely still be some work to do to interpret the resulting Array.
 *
 * Based on information from:
 *  http://stackoverflow.com/a/34275131/1852838
 *  http://stackoverflow.com/a/24662610/1852838
 */

const util = require('util');

// Data string to be parsed
var str = process.argv[2];

var parts = str.split('!').filter(function(s) { return s.length > 0; }),
    root = [],                      // Root elemet
    curr = root,                    // Current array element being appended to
    m_stack = [root,],              // Stack of "m" elements
    m_count = [parts.length,];      // Number of elements to put under each level

parts.forEach(function(el) {
    var kind = el.substr(1, 1),
        value = el.substr(2);

    // Decrement all the m_counts
    for (var i = 0; i < m_count.length; i++) {
        m_count[i]--;
    }

    if (kind === 'm') {            // Add a new array to capture coming values
        var new_arr = [];
        m_count.push(value);
        curr.push(new_arr);
        m_stack.push(new_arr);
        curr = new_arr;
    }
    else {
        if (kind == 'b') {                                    // Assuming these are boolean
            curr.push(value == '1');
        }
        else if (kind == 'd' || kind == 'f') {                // Float or double
            curr.push(parseFloat(value));
        }
        else if (kind == 'i' || kind == 'u' || kind == 'e') { // Integer, unsigned or enum as int
            curr.push(parseInt(value));
        }
        else {                                                // Store anything else as a string
            curr.push(value);
        }
    }

    // Pop off all the arrays that have their values already
    while (m_count[m_count.length - 1] === 0) {
        m_stack.pop();
        m_count.pop();
        curr = m_stack[m_stack.length - 1];
    }
});

console.log(util.inspect(root, { depth: null }));
