# Deppy - A simple dependency graph resolver.

Deppy is a JavaScript library for resolving dependency graphs. It handles cycles and multiple independent nodes. Nodes can be defined in any order.

# Serial resolution of dependencies

Deppy will walk the graph and build an array of nodes. The first element in the array has no dependencies while subsequent elements depend on zero or more previous elements. Here is an example of using deppy to build and resolve a graph:

    var d = require('deppy').create();
    d('a');
    d('c', ['b']);
    d('b', ['a']);
    console.log(d.resolve('c')); // [ 'a', 'b', 'c' ]

