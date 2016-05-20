(function() {
  'use strict';
  // currently no dependencies
  angular
    .module('key-value-editor')
    // convention: key-value-editor in html is keyValueList in directive
    .directive('keyValueEditor', [
      function() {
        // a few utils
        var last = function(array) {
          return array[array.length-1];
        };
        var first = function(array) {
          return array[0];
        };
        return {
          restrict: 'AE',
          scope: {
            // TODO: add an attribute for "editable" vs "view only"?
            // TODO: add an attribute controlling the ability to more key-value pairs
            // TODO: add an attribute to control sortable via drag-and-drop
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
            // ensure that there is at least one empty input for the user
            if(!!first(last($scope.pairs))) {
              $scope.pairs.push([]);
            }
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
