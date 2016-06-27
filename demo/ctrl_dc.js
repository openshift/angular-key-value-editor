(function() {
  'use strict';

  angular
    .module('demo')
    .controller('demoCtrlDC', [
      '$scope',
      'ObjectDiff',
      'dc',
      'environmentVarEditor',
      function($scope, ObjectDiff, dc, environmentVarEditor) {
        console.info('ctrl_dc', '');
        var originalDC;

        dc
          .get()
          .then(function(resp) {
            // originalDC = resp;
            originalDC = {
              items: [resp.items[0]]
            };
            var merged = {};

            // only worrying about the container envs, so making a simple
            // tree structure to emulate the original, but with no extra fluff,
            // so we can easily merge when done editing.
            // *should* be able to diff the change and see if it does as expected.
            var dcForUI = environmentVarEditor.dc.containers.extract(originalDC);


            var on = function() {
              merged = environmentVarEditor.dc.containers.merge(angular.copy(originalDC), angular.copy(dcForUI));

              angular.extend($scope, {
                dcDiff: ObjectDiff.diff(angular.copy(originalDC), merged),
                dcDiffView: ObjectDiff.toJsonView(diff)
              });
            };

            angular.extend($scope, {
              dcForUI: dcForUI, // dcForUI, <-- just want a single!
              merged: merged,
              onClick: on,
              onSubmit: on
            });
          });
      }
    ]);
})();
