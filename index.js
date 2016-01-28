#!/usr/bin/env node
'use strict';
const Promise = require('pinkie-promise');
const Xray = require('x-ray'), xray = Xray();
const cli = require('./cli');

const getUsrPkgs = function(username) {
  return new Promise(function(resolve, reject) {
    var url = 'https://www.npmjs.com/~' + username + '/';
    xray(url, '.collaborated-packages', ['li'], 'a')(function(err, pkgs) {
      if (err) reject(err);
      // resolve(data);
      var usrPkgs = [];
      pkgs.forEach(function(pkg) {
        usrPkgs.push(pkg.trim().split('- ')[0].trim());
      });
      resolve(usrPkgs);
    });
  });
}

getUsrPkgs(cli.flags['u']).then(function(pkgs) {
  return pkgs;
});
