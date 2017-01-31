#!/usr/bin/env node
'use strict';
const Promise = require('pinkie-promise');
const Xray = require('x-ray'), xray = Xray();
const got = require('got');
const cli = require('./cli').flags;
const colors = require('colors');
const _ = require('lodash');

var getUsrPkgs = function(username) {
  return new Promise(function(resolve, reject) {
    if (username == '') {
      if (Array.isArray(cli.p)) {
        resolve(cli.p)
      } else {
        resolve(cli.p.split ? cli.p.split(',').map((pkg) => pkg.trim()) : [cli.p]);
      }
      return
    }
    var url = 'https://www.npmjs.com/~' + username + '/';
    xray(url, '.collaborated-packages', ['li'], 'a')(function(err, pkgs) {
      if (err) reject(err);
      var usrPkgs = [];
      _.each(pkgs, function(pkg) {
        usrPkgs.push(pkg.trim().split('- ')[0].trim());
      });
      if (usrPkgs.length === 0) return reject('User not found or no packages found for this user')
      resolve(usrPkgs);
    });
  });
}

var getPkgStats = function(pkgs) {
  // api doesn't support scoped packages :( so remove them
  pkgs = pkgs.filter((pkg) => {
    var isScoped = pkg.substr(0, 1) === '@'
    if (isScoped) console.warn('No data for ' + pkg + ', scoped packages are not supported :(')
    return !isScoped
  })
  return new Promise(function(resolve, reject) {
    var base = 'https://api.npmjs.org/downloads/point/';
    var period = 'last-' + cli.t + '/';
    var packages = pkgs.length > 1 ? pkgs.join() : String(pkgs);
    got(base + period + packages, { json: true })
      .then(response => {
        if (response.body.error)
          reject(response.body.error);
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
    if (cli.p == undefined) {
      output += 'Download stats for the last ' + (cli.t).yellow + ', for ' + (cli.u).yellow + ':\n';
      _.forOwn(pkgs, function(pkg, key) {
        output += '  - ' + (pkg.package).green + ', ' + String(pkg.downloads).cyan + ' downloads\n';
      });
    } else {
      output += 'Download stats for the last ' + (cli.t).yellow + ':\n';
      if (cli.p.indexOf(',') > -1 || Array.isArray(cli.p)) {
        _.forOwn(pkgs, function(pkg, key) {
          output += '  - ' + (pkg.package).green + ', ' + String(pkg.downloads).cyan + ' downloads\n';
        });
      } else {
        output = 'Package ' + (pkgs.package).green + ' was downloaded ' + String(pkgs.downloads).cyan + ' times.';
      }
    }
    resolve(colors.white(output.trim()));
  });
}

var user = cli.u != undefined ? cli.u.trim() : '';

getUsrPkgs(user)
  .then(pkgs => {
    return getPkgStats(pkgs);
  })
  .then(pkgStats => {
    return parseJson(pkgStats);
  })
  .then(output => {
    console.log(output);
    process.exit(0);
  })
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
