var should = require('should'),
  deppy = require('../');

describe('deppy', function () {
  it('can create a new dependency graph', function () {
    should.exist(deppy.create());
  });

  it('can add dependency nodes', function () {
    var d = deppy.create();
    d('a');
  });

  it('can resolve a single node', function () {
    var d = deppy.create();
    d('a');
    d.resolve('a').should.eql(['a']);
  });

  it('can resolve independent nodes', function () {
    var d = deppy.create();
    d('a');
    d('b');
    d.resolve('a').should.eql(['a']);
    d.resolve('b').should.eql(['b']);
  });

  it('can resolve directly dependent nodes', function () {
    var d = deppy.create();
    d('a');
    d('b', ['a']);
    d.resolve('b').should.eql(['a', 'b']);
  });

  it('can resolve indirectly dependent nodes', function () {
    var d = deppy.create();
    d('a');
    d('b', ['a']);
    d('c', ['b']);
    d.resolve('c').should.eql(['a', 'b', 'c']);
  });

  it('detects previously resolved dependencies', function () {
    var d = deppy.create();
    d('a');
    d('b', ['a']);
    d('c', ['b', 'a']);
    d.resolve('c').should.eql(['a', 'b', 'c']);
  });

  it('definition order does not matter', function () {
    var d = deppy.create();
    d('c', ['b']);
    d('b', ['a']);
    d('a');
    d.resolve('a').should.eql(['a']);
    d.resolve('b').should.eql(['a', 'b']);
    d.resolve('c').should.eql(['a', 'b', 'c']);
  });

  it('detects direct cycles', function () {
    var d = deppy.create();
    d('a', ['b']);
    d('b', ['a']);
    resolve.should.throw("Cycle detected: ['a', 'b'].");
    function resolve() { d.resolve('a'); }
  });

  it('detects indirect cycles', function () {
    var d = deppy.create();
    d('a', ['b']);
    d('b', ['c']);
    d('c', ['a']);
    resolve.should.throw("Cycle detected: ['a', 'b', 'c'].");
    function resolve() { d.resolve('a'); }
  });

  it('cannot resolve node it does not know about', function () {
    var d = deppy.create();
    resolve.should.throw('Node not found: a');
    function resolve() { d.resolve('a'); }
  });
});

