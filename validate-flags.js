'use strict';

const _isEmpty = s => {
  if (s != undefined)
    return typeof(s) == 'boolean' || (typeof(s) == 'string' && s.trim() == '');
  return false;
}

const validateFlags = (flags, callback) => {
  let validPeriods = ['day', 'week', 'month'];

  if (Object.keys(flags).length == 0)
    return callback(new Error('Expected arguments. Run --help for help.'))

  if (flags.u !== undefined && flags.p !== undefined)
    return callback(new Error('Expected only one of user/package.'));

  if (!flags.u && !flags.p)
    return callback(new Error('Expected either user or package name.'));

  if (_isEmpty(flags.u) || _isEmpty(flags.p))
    return callback(new Error('Invalid value for user/package.'));

  if (!flags.t)
    return callback(new Error('Expected a time period.'));

  if (validPeriods.indexOf(flags.t) == -1)
    return callback(new Error('Invalid period; must be one of <day|week|month>.'));

  callback(null);
}

module.exports = exports = validateFlags;
