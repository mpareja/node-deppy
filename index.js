/*
Copyright (c) 2012 Mario Pareja

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
exports.create = function () {
  var nodes = {};
  var instance = function (node, deps) {
    nodes[node] = {
      name: node,
      deps: Array.isArray(deps) ? deps : []
    };
  };

  instance.resolve = function (node) {
    var resolved = [],
      resolving = {};
    resolveDeps(node);

    function resolveDeps(node) {
      if (!alreadyResolved(node)) {
        throwIfCurrentlyResolving(node);

        resolving[node] = true;
        var current = nodes[node];
        if (!current) { throw new Error('Node not found: ' + node); }
        current.deps.forEach(function (dep) {
          resolveDeps(dep);
        });
        resolved.push(node);
        delete resolving[node];
      }
    }

    function alreadyResolved(node) {
      return resolved.some(function (n) { return n === node; });
    }

    function throwIfCurrentlyResolving(node) {
      if (resolving[node]) {
        throw new Error("Cycle detected: ['" + Object.keys(resolving).join("', '") + "'].");
      }
    }
    return resolved;
  };
  return instance;
};

