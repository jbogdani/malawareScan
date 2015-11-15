# malawareScan
A simple node.js utility to recursively scan local or remote (FTP)
directories of web resources malaware scripts

## Instructions (command line)
1. Clone the repository from GitHub: `git clone git://github.com/jbogdani/malawareScan.git`
1. Change directory `cd malawareScan`
1. Install dependencies (only on first run) `npm install`
1. Edit the configuration file to match your needs
1. Run everything: `node scan.js`
1. Follow the instructions and choose the right option between
local or remote (FTP) scan

# Notice and Disclaimer
**malawareScan** will **not** clean or change in any way your files.
Before deleting / changing any of your files check yourself carefully your code.
Some **false positive** results can be reported.


## The config file
* `path`: *sting*, absolute path to the local or remote (FTP server) directory to scan. Required for local scan, can be omitted (the default value`./` will be used)
* `excludes`: *array*, list of lower-case extension to exclude from the scan
* `host`: *string*, FTP host, required for remote scan
* `user`: *string*, FTP username, required for remote scan
* `pass`: *string*, FTP password, required for remote scan
* `port`: *integer*, FTP port, optional, default value `21`

## Issues
Report any issue [here](https://github.com/jbogdani/malawareScan/issues).



### MIT license
**Copyright (c) 2015 Julian Bogdani**

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
