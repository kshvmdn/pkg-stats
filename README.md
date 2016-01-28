# pkg-stats
A command line tool for getting download stats for npm packages.

![Screenshot](http://i.imgur.com/hPTia8j.png)

#### Install

```bash
npm i pkg-stats -g
```

#### Usage

`pkgstats` requires __either__ a username or package name (only one!) and a period (day/week/month). See below for usage, options, and examples (or run `pkgstats --help` to access it in your console)

```bash
Usage
$ pkgstats -u <user> -n <package name> -p <day|week|month>

Options
    -u, --user      npm username
    -p, --package   package name
    -t, --time      time period

Examples
    $ pkgstats -u kshvmdn -p day
    $ pkgstats -p latestvid -p week
```

#### Contribute

Feel free to open an [issue](https://github.com/kshvmdn/pkg-stats/issues) or make a [PR](https://github.com/kshvmdn/pkg-stats/pulls), all contributions are welcome!
