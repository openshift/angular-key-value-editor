'use strict';

// TODO: move this to /test/ if possible
module.exports.config = {
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    isVerbose: true,
    includeStackTrace: true
  },
  reporters: ['spec'],
  colors: true,
  capabilities: {
    browserName: 'chrome',
    //browserName: 'phantomjs',
    //browserName: 'firefox',
    // can split the tests between multiple browser instances to save time:
    shardTestFiles: true,
    maxInstances: 2
  },
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['./e2e/*.js']
};
