#!/usr/bin/env node
'use strict';
const Xray = require('x-ray'), xray = Xray();
const got = require('got');
const cli = require('./cli').flags;
const colors = require('colors');

function getUsrPkgs(username) {
  return new Promise((resolve, reject) => {
    if (username === '') {
      if (Array.isArray(cli.p))
        return resolve(cli.p);

      return resolve(cli.p.split ? cli.p.split(',').map(pkg => pkg.trim()) : [cli.p]);
    }

    let url = `https://www.npmjs.com/~${username}`;
    xray(url, '.collaborated-packages', ['li'], 'a')((err, pkgs) => {
      if (err)
        return reject(err);

      let usrPkgs = pkgs.map(pkg => pkg.trim().split('- ')[0].trim());
      if (usrPkgs.length === 0)
        return reject('User not found or no packages found for this user')

      resolve(usrPkgs);
    });
  });
}

function getPkgStats(pkgs) {
  // api doesn't support scoped packages :( so remove them
  pkgs = pkgs.filter(pkg => {
    if (pkg.substr(0, 1) === '@') {
      console.warn('No data for ' + pkg + ', scoped packages are not supported :(');
      return false;
    }

    return true;
  });

  if (pkgs.length === 0) process.exit(1);

  return new Promise((resolve, reject) => {
    let base = 'https://api.npmjs.org/downloads/point';
    let period = `last-${cli.t}`;
    let packages = pkgs.length > 1 ? pkgs.join() : String(pkgs);

    got(`${base}/${period}/${packages}`, { json: true })
      .then(response => {
        if (response.body.error)
          return reject(response.body.error);

        resolve(response.body);
      })
      .catch(error => reject(error));
  });
}

function parseJson(pkgs) {
  const prepareOutput = () => Object.keys(pkgs)
                                    .map(k => `  - ${(pkgs[k].package).green}, ${String(pkgs[k].downloads).cyan} downloads`)
                                    .join('\n');

  return new Promise((resolve, reject) => {
    let output = '';

    if (!cli.p) {
      output += `Download stats for the last ${(cli.t).yellow} for ${(cli.u).yellow}:\n`;
      output += prepareOutput();
    } else {
      output += `Download stats for the last ${(cli.t).yellow}:\n`;

      // Check if multiple packages were passed AND that they multiple made it to this point
      if (!pkgs.hasOwnProperty('package') && (cli.p.indexOf(',') > -1 || Array.isArray(cli.p))) {
        output += prepareOutput();
      } else {
        output = `Package ${(pkgs.package).green} was downloaded ${String(pkgs.downloads).cyan} times.`;
      }
    }

    resolve(colors.white(output.trim()));
  });
}

let user = cli.u ? cli.u.trim() : '';

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
