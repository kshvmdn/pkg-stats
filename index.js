#!/usr/bin/env node
'use strict';
const Xray = require('x-ray'), xray = Xray();
const got = require('got');
const cli = require('./cli').flags;
const colors = require('colors');
const _ = require('lodash');

const getUsrPkgs = username => {
  return new Promise((resolve, reject) => {
    if (username === '') {
      if (Array.isArray(cli.p)) {
        resolve(cli.p)
      } else {
        resolve(cli.p.split ? cli.p.split(',').map(pkg => pkg.trim()) : [cli.p]);
      }
      return
    }
    let url = `https://www.npmjs.com/~${username}`;
    xray(url, '.collaborated-packages', ['li'], 'a')((err, pkgs) => {
      if (err) return reject(err);
      let usrPkgs = [];
      _.each(pkgs, pkg => {
        usrPkgs.push(pkg.trim().split('- ')[0].trim());
      });
      if (usrPkgs.length === 0) return reject('User not found or no packages found for this user')
      resolve(usrPkgs);
    });
  });
}

const getPkgStats = pkgs => {
  // api doesn't support scoped packages :( so remove them
  pkgs = pkgs.filter(pkg => {
    let isScoped = pkg.substr(0, 1) === '@';
    if (isScoped) console.warn('No data for ' + pkg + ', scoped packages are not supported :(');
    return !isScoped;
  })
  return new Promise((resolve, reject) => {
    let base = 'https://api.npmjs.org/downloads/point/';
    let period = `last-${cli.t}/`;
    let packages = pkgs.length > 1 ? pkgs.join() : String(pkgs);
    got(`${base}${period}${packages}`, { json: true })
      .then(response => {
        if (response.body.error) return reject(response.body.error);
        resolve(response.body);
      })
      .catch(error => reject(error));
  });
}

const parseJson = pkgs => {
  return new Promise((resolve, reject) => {
    let output = '';
    if (cli.p == undefined) {
      output += `Download stats for the last ${(cli.t).yellow} for ${(cli.u).yellow}:\n`;
      _.forOwn(pkgs, (pkg, key) => {
        output += `  - ${(pkg.package).green}, ${String(pkg.downloads).cyan} downloads\n`;
      });
    } else {
      output += `Download stats for the last ${(cli.t).yellow}:\n`;
      if (cli.p.indexOf(',') > -1 || Array.isArray(cli.p)) {
        _.forOwn(pkgs, (pkg, key) => {
          output += `  - ${(pkg.package).green}, ${String(pkg.downloads).cyan} downloads\n`;
        });
      } else {
        output = `Package ${(pkgs.package).green} was download ${String(pkgs.downloads).cyan} times.`;
      }
    }
    resolve(colors.white(output.trim()));
  });
}

let user = cli.u != undefined ? cli.u.trim() : '';

getUsrPkgs(user)
  .then(pkgs => getPkgStats(pkgs))
  .then(pkgStats => parseJson(pkgStats))
  .then(output => {
    console.log(output);
    process.exit(0);
  })
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
