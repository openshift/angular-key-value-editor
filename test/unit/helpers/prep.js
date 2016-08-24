'use strict';
// these are set as globals in the .jshintrc file, but are first defined here
// to eliminate repitition in the actual spec files
/* jshint unused: false */
/* global scope: true */
/* global setup: true */
/* global render: true */
/* global tearDown: true */
/* global noEntries: true */
/* global standardEntries: true */
var scope;
var elem;
var timeout;
var compile;


// adding css to the karma.conf.js files[] array does nothing.
// so manually loading up the css here.
var loadCSS = _.once(function() {
  var $body = $('body');
  var files = [
    'bower_components/patternfly/dist/css/patternfly.min.css',
    'bower_components/patternfly/dist/css/patternfly-additions.min.css',
    'bower_components/ng-sortable/dist/ng-sortable.min.css',
    'dist/angular-key-value-editor.css',
  ];
  _.each(files, function(path) {
    $body.append('<link rel="stylesheet" href="' + path + '" />');
  });
});

var setup = function() {
  //loadCSS(); // no worky, prob cuz not running serve task
  inject(function($rootScope, $timeout, $compile) {
    timeout = $timeout;
    scope = $rootScope.$new();
    compile = $compile;
  });
};

var noEntries = function() {
  scope.entries = [];
};

var standardEntries = function() {
  scope.entries = [{
    name: 'DB_USER',
    value: 'user12345'
  }, {
    name: 'DB_PASSWORD',
    value: 'p@55w0rd'
  }, {
    name: 'DB_SERVER',
    value: 'foo.com'
  }];
};

var render = function() {
  compile(elem)(scope);
  if(!scope.entries) {
    throw new Error('>> $scope.entries must be provided as an array before render()');
  }
  $('body').append(elem);
  scope.$apply();
};

var tearDown = function() {
  $('body').empty();
};
