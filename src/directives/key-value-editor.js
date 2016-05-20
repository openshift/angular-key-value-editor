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

              $scope.onFocus = function(last, index) {
                console.log('focus last?', last, index);
              };

            }
          ],
          templateUrl: 'key-value-editor.html'
        };
      }]);

})();
