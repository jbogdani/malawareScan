#!/usr/local/bin/node
var
  fs      = require ('fs'),
  chalk     = require('chalk'),
  promptly = require('promptly'),
  cfg       = require('./config.json');



promptly.choose(
  'Select\n  ' +
    chalk.green.bold('1')+' for a local scan or\n  ' +
    chalk.green.bold('2') + ' for a remote scan\nYour choise:',
  ['1', '2'],
  function(err, val){

    switch(val){
      // local scan
      case '1':
        if (!cfg.path){
          console.log(
            chalk.red("Path to local directory is missing in config.json file!")
          );
          return;
        }
        try{
          if(!fs.lstatSync(cfg.path).isDirectory()){
            console.log(
              chalk.red("Path " + cfg.path + "is not a directory!")
            );
            return;
          }
        }catch(e){
          console.log(
            chalk.red("Error. Cannot read " + cfg.path + " directory!")
          );
          return;
        }
        var scanLocal = require('./lib/scanLocal.js');
        scanLocal.scan(cfg.path, cfg.excludes);
      break;

      // remote FTP scan
      case '2':
      if (!cfg.path){
        cfg.path = '.';
      }
      if (!cfg.port){
        cfg.port = 21;
      }
      if (!cfg.host){
        console.log(
          chalk.red("Please set up the host in the config.json file to continue!")
        );
        return;
      }
      if (!cfg.user){
        console.log(
          chalk.red("Please set up the user in the config.json file to continue!")
        );
        return;
      }
      if (!cfg.pass){
        console.log(
          chalk.red("Please set up the pass in the config.json file to continue!")
        );
        return;
      }
      var scanFtp = require('./lib/scanFtp.js');
      scanFtp.scan(
        {host: cfg.host,user: cfg.user,pass: cfg.pass,port: cfg.port},
        cfg.path,
        cfg.excludes
      );
      break;
    }
    console.log(val);
  }
);
