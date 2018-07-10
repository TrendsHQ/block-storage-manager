const shell = require('shelljs');
const Dirs = require('../package.json').dirs;

shell.rm('-rf', (Dirs && Dirs.build) || 'build');
