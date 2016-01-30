'use strict';

const _isEmpty = function(s) {
  if (s != undefined)
    return typeof(s) == 'boolean' || ( typeof(s) == 'string' && s.trim() == '');
  return false;
}

const validateFlags = function(flags, callback) {
  let err;
  let validPeriods = ['day', 'week', 'month'];

  if ( Object.keys(flags).length == 0 ) { // empty flags object
    err = new Error('Expected arguments. Run --help for help.');
  } else if ( flags.u != undefined && flags.p != undefined ) {
    err = new Error('Expected only one of user/package.');
  } else if ( flags.u == undefined && flags.p == undefined ) {
    err = new Error('Expected either user or package name.');
  } else if ( _isEmpty(flags.u) || _isEmpty(flags.p) ) {
    err = new Error('Invalid value for user/package.');
  } else if (flags.t == undefined ) {
    err = new Error('Expected a time period.');
  } else if ( validPeriods.indexOf(flags.t) == -1 ) {
    err = new Error('Invalid period; must be one of <day|week|month>.');
  }

  if (err) callback(err)
}

module.exports = {
  validate: validateFlags
}
