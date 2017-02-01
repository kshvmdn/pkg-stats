'use strict';

const meow = require('meow');
const validate = require('./validate-flags');

const cli = meow(`
  Usage
    $ pkgstats -u <user> -p <package name(s)> -t <day|week|month>

  Options
    -u, --user      npm user
    -p, --package   package name(s)
    -t, --time      time period

  Examples
  $ pkgstats -u kshvmdn -t day
  $ pkgstats -p latestvid -t month
  $ pkgstats -p latestvid -p pkg-stats -t month
  $ pkgstats -p "latestvid, pkg-stats" -t month
`);

validate(cli.flags, err => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
});

module.exports = cli;
