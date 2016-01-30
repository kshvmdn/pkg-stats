'use strict';

const meow = require('meow');
const validate = require('./utils').validate;

const cli = meow(`
  Usage
    $ pkgstats -u <user> -n <package name> -p <day|week|month>

  Options
    -u, --user      npm user
    -p, --package   package name
    -t, --time      time period

  Examples
    $ pkgstats -u kshvmdn -p day
    $ pkgstats -p latestvid -p week
`);

validate(cli.flags, function(err) {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
});

module.exports = cli;
