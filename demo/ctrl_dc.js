(function() {
  'use strict';

  angular
    .module('demo')
    .controller('demoCtrlDC', [
      '$scope',
      'ObjectDiff',
      'dc',
      function($scope, ObjectDiff, dc) {
        console.info('ctrl_dc', '');
        var originalDC;

        // recommended usage:
        //  var merged = mergeDC(angular.copy(original), dirty)
        // so you don't mess up the original values!
        var mergeDC = function(clean, edited) {
          // replacing the containers for each DC should be sufficient
          //  item.spec.template.spec.containers
          return _.reduce(
                    edited.items,
                    function(memo, editedDC, i) {
                      var containers = _.map(
                                        _.get(editedDC, 'spec.template.spec.containers'),
                                        function(container) {
                                            container.env = _.compact(
                                                              _.map(
                                                                container.env,
                                                                function(env) {
                                                                  if(env.name) {
                                                                    // eliminate all our added properties
                                                                    return _.pick(env, ['name', 'value', 'valueFrom']);
                                                                  }
                                                                }));
                                            return container;
                                        });
                      memo.items[i].spec.template.spec.containers = containers;
                      return memo;
                    }, clean);
        };

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
            var dcForUI = _.reduce(
                            originalDC.items,
                            function(dcList, dc) {
                              dcList.items.push({
                                spec: {
                                  template: {
                                    spec: {
                                      containers: _.map(
                                                    _.get(dc, 'spec.template.spec.containers'),
                                                    function(container) {
                                                      return {
                                                        name: container.name,
                                                        env: container.env
                                                      };
                                                    })
                                    }
                                  }
                                }
                              });
                              return dcList;
                            }, { apiVersion: resp.apiVersion, items: []});


            var on = function() {
              // NOTE:
              // a plain angular.extend, _.merge, etc does not work.
              // we need to reflct both updates AND deletes
              merged = mergeDC(angular.copy(originalDC), angular.copy(dcForUI));
              var diff = ObjectDiff.diff(angular.copy(originalDC), merged);

              // proof:
              angular.extend($scope, {
                dcDiff: diff,
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
