(function() {
  'use strict';

  angular
    .module('demo')
    .factory('mod', [
      function() {
        return function(num, remainder) {
          var counter = 0;
          return function() {
            counter++;
            return counter % num === remainder;
          };
        };
      }
    ])
    .factory('lessThan', [
      function() {
        return function(num) {
          return function(compare) {
            return compare < num;
          };
        };
      }
    ])
    .factory('commonRegex', [
      function() {
        return {
          // bunch of common regex for testing
          // raw can be used in code via commonRegex.raw.foo.test(string)
          // these cannot be passed to directives
          raw: {
            noWhiteSpace: /^\S*$/,
            digitsOnly: /^[0-9]+$/,
            alphaOnly: /^[a-zA-Z]+$/,
            alphaNumeric: /^[a-zA-Z0-9]+$/,
            alphaNumericUnderscore: /^[a-zA-Z0-9_]*$/,
            alphaNumericDashes: /^[a-zA-Z0-9-_]+$/,
            email: /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,
            // USPhone: /^(?([0-9]{3}))?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
            // at least 3, max 16, alphanumeric
            standardUsername: /^[a-z0-9_-]{3,16}$/,
            // 6 to 18, letters, numbers, underscore, hyphen
            standardPassword: /^[a-z0-9_-]{6,18}$/,
            // lower, upper, unique char, min-6 char...
            complexPassword: /^.*(?=.{6,})(?=.*d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/,
            url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
            ipAddress: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            htmlTag: /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/
          },
          // Is the same as above, just without the leading /^ and trailing $/
          // these must be used to pass to directives via $scope, as the ng-pattern
          // directive will internally do this:   regex = new RegExp('^' + regex + '$');
          // at line 30671 of angular.js
          strings: {
            noWhiteSpace: '\S*',
            digitsOnly: '[0-9]+',
            alphaOnly: '[a-zA-Z]+',
            alphaNumeric: '[a-zA-Z0-9]+',
            alphaNumericUnderscore: '[a-zA-Z0-9_]*',
            alphaNumericDashes: '[a-zA-Z0-9-_]+',
            email: '[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}',
            standardUsername: '[a-z0-9_-]{3,16}',
            standardPassword: '[a-z0-9_-]{6,18}',
            complexPassword: '.*(?=.{6,})(?=.*d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*',
            url: '(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?',
            ipAddress: '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
            // this one throws an error about octal literals in strict mode:
            //htmlTag: '<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)'
          }
        };
      }
    ]);
    
})();
