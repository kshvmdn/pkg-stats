'use strict';

const meow = require('meow');

const periods = ['day', 'week', 'month'];
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

if ( cli.flags.u != undefined && cli.flags.p != undefined ) {
  console.log('Expected only one of user/package.')
  process.exit(1);
} else if ( cli.flags.u == undefined && cli.flags.p == undefined ) {
  console.log('Expected either user or package name.'); 
  process.exit(1);
} else if ( cli.flags.u == '' || cli.flags.p == '' ) {
  console.log('Invalid user/package argument; cannot be empty.')
} else if (cli.flags.t == undefined ) {
  console.log('Expected a time period.');
  process.exit(1);
} else if ( periods.indexOf(cli.flags.t) == -1 ) {
  console.log('Invalid period; must be one of <day|week|month>.')
  process.exit(1);
}

module.exports = cli
