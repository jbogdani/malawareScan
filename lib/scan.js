var chalk = require('chalk'),
  fs = require('fs'),
  path = require('path');

var Scan = module.exports = {
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
  console.log('Processed ' + chalk.green(this.total) + ' files');
  console.log('Skipped ' + chalk.yellow(this.skipped) + ' files');
  console.log('Infected ' + chalk.red.bold(this.infected.length) + ' files');
  if (this.infected.length > 0){
    console.log('List of infected files:\n');
    console.log('  -' + this.infected.join('\n  -'));
  }
},

beautifulCheck: function(file, string){
  try{
    this.simpleCheck(file, string);
    console.log(chalk.green('Clean: ' + file));
  } catch(err){

    switch(err){
      case 'infected':
        this.infected.push(file);
        console.log(chalk.red.bold("-> INFECTED FILE: "  + file));
      break;

      case 'skipped':
        console.log(chalk.yellow("Skipped: "  + file));
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
},

simpleCheck: function(file, string){
  this.total++;
  var extension = path.extname(file).substring(1).toLowerCase(),
    regex = new RegExp(this.searchPatterns.join("|"), "gi");

  if (this.excludeExt.indexOf(extension) > -1){
    this.skipped++;
    throw 'skipped';
  }

  if (!string){
    string = fs.readFileSync(file, 'utf8');
  }

  if (!string || string.trim() === '') throw 'empty';
  if (string.match(regex)) throw "infected";
}
};
