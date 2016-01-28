#!/usr/bin/env node
'use strict';
const Promise = require('pinkie-promise');
const Xray = require('x-ray'), xray = Xray();
const got = require('got');
const cli = require('./cli');
const colors = require('colors');
const _ = require('lodash');

var getUsrPkgs = function(username) {
  return new Promise(function(resolve, reject) {
    var url = 'https://www.npmjs.com/~' + username + '/';
    xray(url, '.collaborated-packages', ['li'], 'a')(function(err, pkgs) {
      if (err) reject(err);
      var usrPkgs = [];
      _.each(pkgs, function(pkg) {
        usrPkgs.push(pkg.trim().split('- ')[0].trim());
      });
      resolve(usrPkgs);
    });
  });
}

var getPkgStats = function(pkgs) {
  return new Promise(function(resolve, reject) {
    var base = 'https://api.npmjs.org/downloads/point/';
    var period = 'last-' + cli.flags['t'] + '/';
    var packages = pkgs.length > 1 ? pkgs.join() : String(pkgs);
    got(base + period + packages, {json: true})
      .then(response => {
        resolve(response.body);
      })
      .catch(error => {
        reject(error);
      });
  });
}

var parseJson = function(pkgs) {
  return new Promise(function(resolve, reject) {
    var output = '';
    // console.log(pkgs);
    _.forOwn(pkgs, function(pkg, pkgName) {
      output += pkgName + ' - ' + pkg.downloads + ' downloads\n'
    })
    resolve(output.trim());
  });
}

getUsrPkgs(cli.flags['u'])
  .then(pkgs => {
    return getPkgStats(pkgs);
  })
  .then(pkgStats => {
    return parseJson(pkgStats);
  })
  .then(output => {
    console.log(output);
  })
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
