(function() {
  'use strict';
  // quick hack getting demo up and running
  angular
    .module('demo')
    .controller('demoCtrl', [
      '$scope',
      'dc',
      'mod',
      'lessThan',
      'commonRegex',
      function($scope, dc, mod, lessThan, commonRegex) {
        var originalDC;

        // quick dummy functions for testing purposes
        var isEveryThird = mod(3, 0);
        var lessThanTwo = lessThan(2);

        dc
          .get()
          // .getWithSpecialEnvs() // alternative env vars
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
                            // randomly add a few things to trigger UI changes
                            // this is cheap testing :)
                            env.isReadonly = lessThanTwo(i+1); //isEveryThird() ? true : false;
                            env.cannotDelete = lessThanTwo(i+1); // isEveryThird() ? true : false;
                            env.containsSecret = isEveryThird(i+1); //isEveryThird() ? true : false;
                            if(lessThanTwo(i+1)) {
                              env.keyValidatorError = 'Nope! You fail.';
                            }

                            // support secrets, configmaps, etc
                            if(env.valueFrom) {
                              // env.icon = '';
                              // env.tooltip = '';
                              // env.displayValue = '';
                            }

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

        $scope.keyValidator =  commonRegex.strings.alphaNumericDashes; //commonRegex.raw.noWhiteSpace;
        $scope.valueValidator = commonRegex.strings.alphaNumericDashes; // commonRegex.raw.alphaNumericDashes;

        $scope.keyValidatorError = 'Please enter a valid key';
        $scope.keyValidatorErrorTooltip = 'A valid environment variable name is an alphanumeric (a-z and 0-9) string beginning with a letter that may contain underscores.';

        $scope.secretValueTooltip = "This value is from a shared secret and cannot be edited.";

        // for the form
        var on = function() {
          // console.log($scope.deploymentConfigs);
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
