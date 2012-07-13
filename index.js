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

