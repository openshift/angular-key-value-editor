// Karma configuration
// Generated on Fri Aug 12 2016 17:01:25 GMT-0400 (EDT)
//
// generate a test config file:
//   ./node_modules/karma/bin/karma init
// run karma with this file:
//   ./node_modules/karma/bin/karma start test/karma.conf.js
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    // frameworks: ['mocha', 'chai', 'sinon'],
    // jasmine seems to have all that mocha, chai, sinon provide, so going with a single framework!
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // libs
      "bower_components/lodash/lodash.js",
      "bower_components/jquery/dist/jquery.js",
      "bower_components/angular/angular.js",
      // mocks comes after angular
      // left it as a node module because everything else test related is via npm
      'node_modules/angular-mocks/angular-mocks.js',
      "bower_components/ng-sortable/dist/ng-sortable.min.js",
      // kve
      'dist/angular-key-value-editor.js',
      'dist/compiled-templates.js',
      // test files
      //'test/**/*Spec.js',
      //'test/**/*Spec.js',
      'test/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['Chrome', 'Firefox', 'IE'],
    browsers: ['Chrome'],

    // dead if no response in 5 seconds
    browserNoActivityTimeout: 5000,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
