'use strict';

const catw        = require('catw');
const fs          = require('fs');
const uglifyjs    = require('uglify-js');
const chalk       = require('chalk');
const concat      = require('concat');
const sass        = require('node-sass');
const cssmin      = require('cssmin');

catw('assets/scripts/**/*.js', function() {
  let manifest    = require('../assets/scripts/_spinanyc.js');
  let src = './shopify/assets/spinanyc.min.js';

  concat(manifest).then(function(result) {
    let js = uglifyjs.minify(result);
    fs.writeFile(src, js.code, function(err) {
      if (err) {
        process.stdout.write(chalk.red(err));
      }
      else {
        process.stdout.write(chalk.yellow('App JS Updated \n'));
      }
    });
  });
});

catw('assets/styles/**/*.scss', function() {
  let src = './shopify/assets/spinanyc.min.css';

  sass.render({
    file: './assets/styles/_spinanyc.scss'
  }, function(err, result) {
    fs.writeFile(src, result.css, function(err) {
      if (!err) {
        let min = cssmin(fs.readFileSync(src, 'utf8'));
        fs.writeFile(src, min, function(err) {
          if (err) {
            process.stdout.write(chalk.red(err));
          }
          else {
            process.stdout.write(chalk.yellow('App CSS Updated \n'));
          }
        });
      }
    });
  });
});
