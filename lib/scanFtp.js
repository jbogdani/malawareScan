var fs = require ('fs'),
  chalk = require('chalk'),
  readdirp = require('readdirp'),
  jsftp = require('jsftp'),
  async = require('async'),
  Scan = require('./scan.js');

  var remoteBrowse = {

    ftp: {},
    files: [],

    setup: function(cfg){
      this.ftp = new jsftp(cfg);
    },

    walkRemote: function(dir, callback) {
      var files = [],
        self = this;

      // walk the directory
      this.ftp.ls(dir, function(err, list) {
        if (err) {
          sync.log.error('ftp.ls failed.');
          return callback(err);
        }
        var i = 0;
        (function next() {
          var file = list[i++];
          // exit if all files are processed
          if (!file) { return callback(null, {'files':files } ); }
          // get file/dir name/stats
          var path = dir + '/' + file.name;

          // handle directories
          if (file.type === 1) {
            // add the dir to the results
            // concat results from recursive calls
            self.walkRemote(path, function(err, res) { // recurse & shit
              files = files.concat(res.files);
              next();
            });
            return;
          }
          // handle files
          if (file.type === 0) {
            // add the file to the results
            files.push(path);
            next();
            return;
          }
          // skip everything else (ex sumlinks)
          else { next(); }
        })();
      });
    },

    scanFiles: function(clbk){
      var self = this;
      async.mapSeries(this.files, function(file, callback){
        var str = '';
        self.ftp.get(file, function(err, s) {
          if (err){
            callback(err);
          } else {
            s.on("data", function(d){
              str += d.toString();
            });
            s.on('end', function(){
              Scan.beautifulCheck(file, str);
            });
            s.resume();
            callback(null);
          }
        });

      }, function(err, res){
        if (typeof clbk == 'function'){
          clbk(err);
        }

        process.exit();
      });
    }
  };



var scanFtp = module.exports = {

  scan: function(ftpData, remotePath, userExclude, callback){
    if (userExclude){
      Scan.excludeExt = userExclude;
    }
    async.series([
      function(cb){
        remoteBrowse.setup({
          host: ftpData.host,
          user: ftpData.user,
          pass: ftpData.pass,
          port: ftpData.port
        });

        cb(null);
      },

      function(cb){
        console.log(chalk.yellow('Loading file list...'));
        remoteBrowse.walkRemote(remotePath, function(err, res){
          remoteBrowse.files = res.files;
          cb(null);
        });
      },
      function(cb){
        remoteBrowse.scanFiles(function(){
          Scan.getReport();
        });
        cb(null);
      }
    ]);
  }
};
