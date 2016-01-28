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
      resolve([cli.p]);
    }

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
    var period = 'last-' + cli.t + '/';
    var packages = pkgs.length > 1 ? pkgs.join() : String(pkgs);
    got(base + period + packages, { json: true })
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
    if (cli.p == undefined) {
      output += colors.white( 'Package download stats for user ' + (cli.u).magenta + ' in the last ' + (cli.t).magenta + ':\n\n' );
      _.forOwn(pkgs, function(pkg, key) {
        output += colors.white(' - ' + (pkg.package).cyan + ' downloaded ' + String(pkg.downloads).cyan + ' times\n');
      });
    } else {
      output = colors.white('Package ' + (pkgs.package).cyan + ' was downloaded ' + String(pkgs.downloads).cyan + ' times in the last ' + (cli.t).cyan + '.');
    }
    resolve(output.trim());
  });
}

var user = cli.u != undefined ? cli.u : '';

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
    console.log(e.red);
    process.exit(1);
  });
