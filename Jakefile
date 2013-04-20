var path = require('path'),
  pckg = require('./package'),
  glob = require('glob'),
  run = require('paprika').run;

desc('Run JSLint on all javascript files.');
task('lint', function () {
  var args = [
      path.join('node_modules', 'jslint', 'bin', 'jslint.js'),
      '--devel',
      '--node',
      '--vars',
      '--maxerr=100',
      '--indent=2',
      '--sloppy=true', // don't require "use strict" everywhere
      '--nomen=true', // don't give warnings for __dirname
      '--undef',
      '--plusplus',
      '--minusminus',
      '--'
    ],
    files = glob.sync('./test/*.js');

  files.push('index.js');
  files.push('Jakefile');

  execute('node', args.concat(files), '*** JSLint passed. ***', '!!! JSLint FAILED. !!!');
}, { async: true });

task('test', function () {
  process.stdout.write("Running tests...");
  jake.exec(['node node_modules/mocha/bin/mocha -R spec'], function () {
    console.log('testing complete.');
    complete();
  });
}, { async: true });

// this exposes a 'package' task
var p = new jake.PackageTask(pckg.name, pckg.version, function () {
  this.needTarGz = true;
  this.packageFiles.include([
    'package.json',
    'LICENSE',
    'README.md',
    'index.js',
    'test/*'
  ]);
});

desc('Publish the package to npm.');
task('publish', ['package'], function () {
	var arc = pckg.name + '-' + pckg.version + '.tar.gz';
	console.log('Publishing pkg/' + arc + '.');
	jake.exec(['npm publish pkg/' + arc], complete, {stdout: true, stderr: true});
}, { async: true });

desc('Push changes up to GitHub repository.');
task('push', ['lint', 'test'], function () {
  run('git', 'push', mycomplete);
}, { async: true });

task('default', ['lint', 'test']);

function execute(cmd, args, successMessage, failureMessage, dontComplete) {
  run(cmd, args, function (code) {
    if (code === 0) {
      console.log(successMessage);
    } else {
      fail(failureMessage);
    }
    if (!dontComplete) {
      complete();
    }
  });
}

function mycomplete(err) {
  if (err) {
    fail(err);
  }

  complete();
}
