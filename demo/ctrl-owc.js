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

        dc
          // .get()
          .getWithSpecialEnvs() // alternative env vars
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
                    // _.get(deploymentConfig, 'spec.template.spec.containers'),
                    _.get(deploymentConfig, 'spec.containers'),
                    function(container) {
                      return {
                        name: container.name,
                        env: _.map(
                          container.env,
                          function(env, i){

                            // support secrets, configmaps, etc
                            if(env.valueFrom) {
                              env.containsSecret = true;
                              env.secretValueIcon = 'fa fa-external-link-square';
                              env.secretValueTooltip = 'This is a referenced value that will be generated when a container is created.  On running pods you can check the resolved values by going to the Terminal tab and echoing the environment variable.';

                              if(env.valueFrom.configMapKeyRef) {
                                env.value = 'Set to the key "' + env.valueFrom.configMapKeyRef.key + '" in config map "' + env.valueFrom.configMapKeyRef.name + '".';
                              }
                              else if(env.valueFrom.secretKeyRef) {
                                env.secretValueIcon = 'fa fa-user-secret';
                                env.value = 'Set to the key "' + env.valueFrom.secretKeyRef.key + '" in secret "' + env.valueFrom.secretKeyRef.name + '".';
                              }
                              else if(env.valueFrom.fieldRef) {
                                env.value = 'Set to the field "' + env.valueFrom.fieldRef.fieldPath + '" in the current object.';
                              }
                              else {
                               env.value = 'Set to a reference on ' + _.keys(env.valueFrom)[0] + '.';
                              }
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
