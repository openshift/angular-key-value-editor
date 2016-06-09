(function() {
  'use strict';
  // currently no dependencies
  angular
    .module('key-value-editor')
    .directive('keyValueEditor', [
      function() {
        // a few utils
        var addEmptyEntry = function(entries) {
          entries.push({name: '', value: ''});
        };
        var last = function(entries) {
          return entries[entries.length - 1];
        };
        return {
          restrict: 'AE',
          scope: {
            // TODO: save modifications
            // TODO: ensure we don't return an empty pair
            // TODO: validate input
            entries: '=?',
            // TODO: add an attribute for "editable" vs "view only"?
            // TODO: add an attribute for delete
            keyPlaceholder: '@',
            valuePlaceholder: '@',
            cannotAdd: '=?',
            cannotDelete: '=?',
            cannotSort: '=?',
            isReadonly: '=?'
          },
          link: function($scope, $elem, $attrs) {
            // ensure a default
            $scope.entries = $scope.entries || [];
            // if an attribute exists, set its corresponding bool to true
            if('cannotAdd' in $attrs) {
              $scope.cannotAdd = true;
            }
            if('cannotDelete' in $attrs) {
              $scope.cannotDelete = true;
            }
            if('isReadonly' in $attrs) {
              $scope.isReadonly = true;
            }
            if('cannotSort' in $attrs) {
              $scope.cannotSort = true;
            }
            // ensure that there is at least one empty input for the user
            if(!$scope.cannotAdd && last($scope.entries).name !== ''){
              addEmptyEntry($scope.entries);
            }
          },
          controller: [
            '$scope',
            function($scope) {
              // will add a new text input every time the last
              // set is selected.
              $scope.onFocusLast = function(last, index) {
                if (!$scope.cannotAdd) {
                  addEmptyEntry($scope.entries);
                }
              };
              // clicking the delete button removes the pair
              $scope.deleteEntry = function(start, deleteCount) {
                $scope.entries.splice(start, deleteCount);
              };
              $scope.dragControlListeners = {
                  // only allow sorting within the parent instance
                  accept: function (sourceItemHandleScope, destSortableScope) {
                    return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
                  },
                  orderChanged: function(event) {
                    // don't allow sorting past the empty pair if empty pair exist
                    if(event.dest.index === (event.dest.sortableScope.modelValue.length - 1) && !$scope.cannotAdd) {
                      event.dest.sortableScope.removeItem(event.dest.index);
                      event.source.itemScope.sortableScope.insertItem(event.source.index, event.source.itemScope.modelValue);
                    }
                    // console.log(_.map($scope.entries, function(item) {
                    //   return item.name;
                    // }));
                  }

              };
            }
          ],
          templateUrl: 'key-value-editor.html'
        };
      }]);

})();
