(function() {
  'use strict';
  // quick hack getting demo up and running
  angular
    .module('demo')
    .factory('mod', [
      function() {
        return function(num, remainder) {
          var counter = 0;
          return function() {
            counter++;
            return counter % num === remainder;
          }
        }
      }
    ])
    .factory('lessThan', [
      function() {
        return function(num) {
          return function(compare) {
            return compare < num;
          }
        }
      }
    ])
    .factory('commonRegex', [
      function() {
        return {
          raw: {
            // bunch of common regex for testing
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
          strings: {
            noWhiteSpace: '\S*',
            digitsOnly: '[0-9]+',
            alphaOnly: '[a-zA-Z]+',
            alphaNumeric: '[a-zA-Z0-9]+',
            alphaNumericUnderscore: '[a-zA-Z0-9_]*'
          }
        }
      }
    ])
    .controller('demoCtrl', [
      '$scope',
      'dc',
      'mod',
      'lessThan',
      'commonRegex',
      function($scope, dc, mod, lessThan, commonRegex) {
        var originalDC;

        // quick dummy functions for testing purposes
        var isEven = mod(2, 0);
        var isOdd = mod(2, 1);
        var isEveryThird = mod(3, 0);
        var lessThanTwo = lessThan(2);
        var lessThanThree = lessThan(3);

        dc
          .get()
          .then(function(response) {
            originalDC = response;
            console.log(response);
            // transforming the lists into a simplified copy we can use for UI
            // we will dirty up this temporary model with UI data, therefore need
            // to transform it back when ready to persist it (copy relevant data
            // back to the original model to return to the server)
            $scope.deploymentConfigs = _.map(
              response.items,
              function(deploymentConfig) {
                return {
                  name: _.get(deploymentConfig, 'metadata.name'),
                  containers: _.map(
                    _.get(deploymentConfig, 'spec.template.spec.containers'),
                    function(container) {
                      return {
                        name: container.name,
                        env: _.map(
                          container.env,
                          function(env, i){
                            env.isReadonly = lessThanTwo(i+1); //isEveryThird() ? true : false;
                            env.cannotDelete = lessThanTwo(i+1); // isEveryThird() ? true : false;
                            // for the key-value-editor, we will annotate these
                            // with is-readonly, etc.
                            return env;
                          })
                      };
                    })
                };
              });

          });

        $scope.keyPlaceholder = 'key';
        $scope.valuePlaceholder = 'value';

      //  $scope.keyValidator =  commonRegex.noWhiteSpace;
      //  $scope.valueValidator = commonRegex.alphaOnly;


        // for the form
        var on = function() {
          console.log($scope.deploymentConfigs);
          // console.log('list1', $scope.list1);
          // console.log('list2', $scope.list2);
          // no way to get at the unnamed list in the 3rd directive
        };

        $scope.onSubmit = on;
        $scope.onClick = on;

      }
    ])
    .run([
      '$timeout',
      function($timeout) {
        $timeout(function() {
          // console.log('demo is running');
        },1200);
      }
    ]);
})();
