'use strict';

module.exports = function(config) {
  config.set({
    // root of project, so /src, /dist, etc can load
    basePath: '../',
    frameworks: ['jasmine'],
    files: [
      // libs
      // 'bower_components/patternfly/dist/css/patternfly.min.css',
      // 'bower_components/patternfly/dist/css/patternfly-additions.min.css',
      "bower_components/lodash/lodash.js",
      "bower_components/jquery/dist/jquery.js",
      "bower_components/angular/angular.js",
      // angular-mocks must load after angular
      // exists in node_modules instead of bower_components as that is
      // where all of the rest of the testing stuff is (even though it is for the browser)
      'node_modules/angular-mocks/angular-mocks.js',
      // kve files
      'bower_components/bootstrap/dist/js/bootstrap.min.js', // all we need is tooltips...
      //'bower_components/ng-sortable/dist/ng-sortable.min.css',
      'bower_components/ng-sortable/dist/ng-sortable.min.js',
      //'dist/angular-key-value-editor.css',
      'dist/angular-key-value-editor.js',
      'dist/compiled-templates.js',
      // test helpers
      'test/unit/helpers/*.js',
      // tests
      'test/unit/spec/**/*.spec.js'
    ],
    exclude: [],
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],
    // passing in via the gulp task instead
    //port: 9876
    colors: true,
    // config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    autoWatch: false,
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['Chrome', 'Firefox', 'IE'],
    browsers: ['Firefox'],
    browserNoActivityTimeout: 5000,
    // toggles continuous integration mode
    // if true, Karma captures browsers, runs the tests, then exits
    singleRun: true,
    // limit how many browsers should be started simultaneous
    concurrency: Infinity
  });
};
