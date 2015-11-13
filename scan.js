#!/usr/local/bin/node
var fs      = require ('fs'),
  path      = require('path'),
  chalk    = require('chalk'),
  readdirp  = require('readdirp'),
  cfg       = require('./config.json');


var scan = {
  total: 0,
  infected: [],
  skipped: 0,
  processed: 0,

  searchPatterns: [
    "^<\\\?php\\\s*\\\$md5\s*=\\\s*.*create_function\\\s*\\\(.*?\\\);\\\s*\\\$.*?\\\)\\\s*;\\\s*\\\?>\\\s*",
    " echo \"<script(.*)src=\\\"http:\\\/\\\/.*\.js\\\">(.*)<\\\/script>\"",
    "<\\\?php\\\s*\\\@error_reporting\\\(0\\\);\\\s*if\\\s*\\\(\\\!isset\\\(([\\\$\\\w]+)\\\)\\\)\\\s*{[\\\$]+[^}]+}\\\s*\\\?>",
    "<\\\?php\\\s*\\\/\\\*\\\w+_on\\\*\\\/.*\\\/\\\*\\\w+_off\\\*\\\/\\\s*\\\?>",
    "<IfModule\\\s*mod_rewrite\\\.c>\\\s*RewriteEngine\\\s*On\\\s*RewriteCond\\\s*%\\\{HTTP_REFERER\}\\\s*\\\^\\\.\\\*\\\([^\\\)]{255,}[google|yahoo|bing|ask|wikipedia|youtube][^\\\)]{255,}[^<]*<\\\/IfModule>",
    "<\\\?php\\\s*\\\/\\\*god_mode_on\\\*\\\/eval\\\(base64_decode\\\([\\\"'][^\\\"']{255,}[\\\"']\\\)\\\);\\\s*\\\/\\\*god_mode_off\*\\\/\\\s*\\\?>",
    "<\\\?php\\\s*\\\?>",
    "ErrorDocument\\\s*(?:400|401|403|404|500)+\\\s*http:\\\/\\\/.*\\\.\\\w+",
    "^<script>(.*)<\\\/script>",
    "^<\\\?php\\\s*\\\$md5\s*=\\\s*[\\\"|']\\\w+[\\\"|'];\\\s*\\\$wp_salt\\\s*=\\\s*[\\\w\\\(\\\),\\\"\\\'\\\;\\\$]+\\\s*\\\$wp_add_filter\\\s*=\\\s*create_function\\\(.*\\\);\\\s*\\\$wp_add_filter\\\(.*\\\);\\\s*\\\?>\\\s*",
    "\\\s*eval\\\(base64_decode\\\([\\\"'][^\\\"']{255,}[\\\"']\\\)\\\);",
    "if\\\(!function_exists\\\([^{]+\\\s*{\\\s*function[^}]+\\\s*}\\\s*[^\"']+\\\s*[\\\"'][^\\\"']+[\\\"'];\\\s*eval\\\s*\\\(.*\\\)\s*;\\\s*}\\\s*",
    "\\\s*\beval\\\(gzinflate\\\([^\\\)]\\\)",
    "\s*\beval\(base64_decode\([\"'][^\"']+[\"']\)\)",
    "\s*\beval\(\\\$\w+\([\"'][^\"']+[\"']\)\)",
    "\s*\beval\(\\\$_(POST|GET|REQUEST)[^\)]+\)",
    "\beval\(\\$\w\(\([^\)]+))\)",
    // 'base64_decode\\\(',
    'gzinflate\\\(base64_decode',
    'eval\\\(gzinflate\\\(base64_decode',
    'eval\\\(base64_decode'
  ],

  excludeExt: [],

  getReport: function(){
    console.log(chalk.green('\nFinished'));
    console.log('Processed ' + chalk.green(scan.total) + ' files');
    console.log('Skipped ' + chalk.yellow(scan.skipped) + ' files');
    console.log('Infected ' + chalk.red.bold(scan.infected.length) + ' files');
    if (scan.infected.length > 0){
      console.log('List of infected files:\n');
      console.log('  -' + scan.infected.join('\n  -'));
    }
  },

  run: function(rootDir, userExclude, callback){

    if (userExclude){
      this.excludeExt = userExclude;
    }

    readdirp({ root: rootDir })
      .on('error', function(err){
        console.log(chalk.red.bold("Error. Can not get files from directory " + rootDir));
      })
      .on('warn', function(err){
        console.log(calck.red('Errore. Can not read file', err));
      })
      .on('end', function(){
        if (callback && typeof callback === 'function'){
          callback();
        }
      })
      .on('data', function (entry) {
        try{
          scan.total++;
          scan.checkFile(entry.fullPath);
          console.log(chalk.green('Clean: ' + entry.fullPath));
        } catch(err){

          switch(err){
            case 'infected':
              scan.infected.push(entry.fullPath);
              fs.appendFileSync('report.log', "INFECTED FILE: "  + entry.fullPath + "\n");
              console.log(chalk.red.bold("-> INFECTED FILE: "  + entry.fullPath));
            break;

            case 'skipped':
              scan.skipped++;
              console.log(chalk.yellow("Skipped: "  + entry.fullPath));
            break;

            case 'error_read':
            /* falls through */
            case 'empty':
            /* falls through */
            default:
              // Do Nothing
            break;
          }


        }

      });
  },

  processDir: function(dir){
    var list = fs.readdirSync(dir);

    if (!list) return;

    list.forEach(function(item){

      var file = dir + '/' + item;

      if(fs.lstatSync(file).isDirectory()){
        scan.processDir(file);
      } else if (fs.lstatSync(file).isFile()){
        scan.checkFile(file);
      }
    });

  },

  checkFile: function(file){

    var extension = path.extname(file).substring(1).toLowerCase(),
      text,
      regex = new RegExp(scan.searchPatterns.join("|"), "gi");

    if (scan.excludeExt.indexOf(extension) > -1){
      throw 'skipped';
    }
    try{
      text = fs.readFileSync(file, 'utf8');
    } catch(e){
      throw 'error_read';
    }

    if (!text || text.trim() === '') throw 'empty';

    if (text.match(regex)) throw "infected";

  }
};

scan.run(cfg.path, cfg.excludes, function(){
  scan.getReport();
});
