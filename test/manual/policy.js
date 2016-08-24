(function() {
  'use strict';
  // quick hack getting demo up and running
  angular
    .module('demo')
    .controller('demoCtrl', [
      '$scope',
      '$timeout',
      function($scope, $timeout) {

        $timeout(function() {
          var generic = [
            {name: 'MYSQL_USER',     value: 'user8E4'},
            {name: 'MYSQL_PASSWORD', value: 'ybqOpSMG'},
            {name: 'MYSQL_DATABASE', value: 'root'}
          ];
          var withAttrs = [
            {name: 'MYSQL_USER',     value: 'user8E4', isReadonly: true, cannotDelete: true},
            {name: 'MYSQL_PASSWORD', value: 'ybqOpSMG', isReadonly: true},
            {name: 'MYSQL_DATABASE', value: 'root', cannotDelete: true}
          ];
          var policyRestrictKeys = ['MYSQL_USER', 'MYSQL_PASSWORD'];

          // for the form
          var on = function() {
            console.log($scope.deploymentConfigs);
          };

          angular.extend($scope, {
            generic: generic,
            withAttrs: withAttrs,
            policyRestrictKeys: policyRestrictKeys,
            keyPlaceholder: 'key',
            valuePlaceholder: 'value',
            onSubmit: on,
            onCLick: on
          });

        }, 2000);
      }
    ]);

})();
