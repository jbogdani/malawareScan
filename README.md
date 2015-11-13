# malawareScan
A simple node.js utility to recursively scan a local directory of web resources for malaware

## Instructions (command line)
1. Clone the repository from GitHub: `git clone git://github.com/jbogdani/malawareScan.git`
1. Change directory `cd malawareScan`
1. Install dependencies (only on first run) `npm install`
1. Set up your configuration: `nano config.json`
  * Enter your configuration
  * Save changes and exit: `CTRL + X`, `YES`
1. Run everything: `node scan.js`

## The config file
* path: sting, absolute path to the local directory to scan
* excludes: array of lower-case extension to exclude from the scan



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
