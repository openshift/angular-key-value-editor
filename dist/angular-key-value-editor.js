(function() {
  'use strict';
  // currently no dependencies
  angular.module('key-value-editor', [ ]);
})();

(function() {
  'use strict';
  // currently no dependencies
  angular
    .module('key-value-editor')
    // convention: key-value-editor in html is keyValueList in directive
    .directive('keyValueEditor', [
      function() {
        console.log('key-value-editor load?');
        return {
          restrict: 'AE',
          scope: {
            pairs: '=?',
            keyPlaceholder: '@',
            valuePlaceholder: '@'
          },
          // this will prob not work till we use the
          // angular template cacher to cache the templates....
          // templateUrl: 'key-value-editor.html',
          link: function($scope, $elem, $attrs) {
            // ensure a default
            $scope.pairs = $scope.pairs || [[]];
          },
          controller: [
            '$scope',
            function($scope) {

              // will add a new text input every time the last
              // set is selected.
              $scope.onFocusLast = function(last, index) {
                $scope.pairs.push([]);
              };

            }
          ],
          templateUrl: 'key-value-editor.html'
        };
      }]);

})();
