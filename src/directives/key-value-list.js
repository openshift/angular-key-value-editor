(function() {
  'use strict';
  // currently no dependencies
  angular
    .module('key-value-editor')
    // convention: key-value-list in html is keyValueList in directive
    .directive('keyValueList', [
      function() {
        console.log('key-value-list load?');
        return {
          restrict: 'AE',
          scope: {},
          // this will prob not work till we use the
          // angular template cacher to cache the templates....
          // templateUrl: 'key-value-list.html',
          link: function($scope, $elem, $attrs) {
            console.log('key-value-list.link');
          },
          controller: [
            function() {
              console.log('key-value-list.ctrl');
            }
          ]
        };
      }]);

})();
