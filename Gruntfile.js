'use strict';
const dotenv = require("dotenv");
dotenv.load();

module.exports = function(grunt) {
  var env = grunt.option('env');
  var options;

  if (env === 'production') {
    options = {
      theme: process.env.PRODUCTION_THEME_ID,
      api_key: process.env.PRODUCTION_API_KEY,
      password: process.env.PRODUCTION_PASSWORD,
      url: process.env.PRODUCTION_SUBDOMAIN + ".myshopify.com",
      base: "shopify/"
    };
  }
  else if (env === 'staging') {
    options = {
      theme: process.env.STAGING_THEME_ID,
      api_key: process.env.STAGING_API_KEY,
      password: process.env.STAGING_PASSWORD,
      url: process.env.STAGING_SUBDOMAIN + ".myshopify.com",
      base: "shopify/"
    };
  }

  grunt.initConfig({
    shopify: {
      options: options
    },
    watch: {
      shopify: {
        files: ["shopify/**"],
        tasks: ["shopify"]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shopify');
  grunt.registerTask('default', ['jshint']);
};
