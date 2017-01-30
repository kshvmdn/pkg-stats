# pkg-stats
A command line tool for getting download stats for npm packages. Available on [npm](https://www.npmjs.com/package/pkg-stats).

![Screenshot](http://i.imgur.com/hPTia8j.png)

#### Install

```
npm i pkg-stats -g
```

#### Usage

`pkgstats` requires __either__ a username or package name(s) and a period (day/week/month).  See below for usage, options, and examples (or run `pkgstats --help` to access it in your console).

```
Usage
$ pkgstats -u <user> -n <package name> -p <day|week|month>

Options
    -u, --user      npm username
    -p, --package   package name
    -t, --time      time period

Examples
    $ pkgstats -u kshvmdn -t day
    $ pkgstats -p latestvid -t month
    $ pkgstats -p latestvid -p pkg-stats -t month
    $ pkgstats -p "latestvid, pkg-stats" -t month
```

#### Contribute

Feel free to open an [issue](https://github.com/kshvmdn/pkg-stats/issues) or make a [PR](https://github.com/kshvmdn/pkg-stats/pulls), all contributions are welcome!
