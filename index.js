#!/usr/bin/env node
"use strict";
const meow = require("meow");
const Promise = require("pinkie-promise");
const Xray = require("x-ray"), xray = Xray();

const periods = ['day', 'week', 'month'];

const cli = meow(`
  Usage
    $ pkgstats -u <user> -n <package name> -p <day|week|month>

  Options
    -u, --user      npm user
    -n, --name      pkg name
    -p, --period    time period
`);
