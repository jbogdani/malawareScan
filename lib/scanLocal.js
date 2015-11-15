var fs = require ('fs'),
chalk  = require('chalk'),
readdirp = require('readdirp'),
Scan = require('./scan.js');

var scanLocal = module.exports = {

scan: function(rootDir, userExclude, callback){

  if (userExclude){
    Scan.excludeExt = userExclude;
  }

  readdirp({ root: rootDir })
    .on('error', function(err){
      console.log(chalk.red.bold("Error. Can not get files from directory " + rootDir));
    })
    .on('warn', function(err){
      console.log(calck.red('Errore. Can not read file', err));
    })
    .on('end', function(){
      Scan.getReport();
      if (callback && typeof callback === 'function'){
        callback();
      }
    })
    .on('data', function (entry) {
      try{
        Scan.beautifulCheck(entry.fullPath);
      } catch(e){
      }
    });
  }
};
