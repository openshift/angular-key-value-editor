(function() {
  'use strict';
  angular.module('key-value-editor', ['as.sortable']);
})();

(function() {
  'use strict';

  angular
    .module('key-value-editor')
    .directive('keyValueEditor', [
      '$compile',
      '$templateCache',
      'keyValueEditorConfig',
      'keyValueEditorUtils',
      function($compile, $templateCache, keyValueEditorConfig, keyValueEditorUtils) {

        var last = keyValueEditorUtils.last;
        var get = keyValueEditorUtils.get;
        // not used internally, however users can ask for keyValueEditorUtils and
        // use this function to clean out empty pairs from the list when they are ready
        // to save/preserve.  Also can just use _.compact() or any other library that
        // provides this util if it is already available.
        // var compact = keyValueEditorUtils.compact;

        // a few utils
        var addEmptyEntry = function(entries) {
          entries && entries.push({name: '', value: ''});
        };

        return {
          restrict: 'AE',
          scope: {
            keyMinlength: '@',                   // min character length
            keyMaxlength: '@',                   // max character length
            valueMinlength: '@',                   // min character length
            valueMaxlength: '@',                   // max character length
            // entries: [{
            //  name: 'foo',
            //  value: 'bar',
            //  isReadOnly: true|| false      // individual entries may be readonly
            //  cannotDelete: true || false   // individual entries can be permanent
            //  keyValidator: '',             // regex string
            //  valueValidator: ''            // regex string
            //  keyValidatorError: '',        // custom validation error
            //  valueValidatorError: ''       // custom validation error
            // }]
            entries: '=?',
            keyPlaceholder: '@',
            valuePlaceholder: '@',
            keyValidator: '@',                // general key regex validation string
            valueValidator: '@',              // general value regex validation string
            keyValidatorError: '@',           // general key validation error message
            valueValidatorError: '@',         // general value validation error message
            secretValueTooltip: '@',
            secretValueIcon: '@',
            cannotAdd: '=?',
            cannotDelete: '=?',
            cannotSort: '=?',
            isReadonly: '=?'
          },
          link: function($scope, $elem, $attrs) {
            // manually retrieving here so we can manipulate and compile in JS
            var tpl = $templateCache.get('key-value-editor.html');

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
              // uses a regex to essentially kill the as-sortable directives
              // before we compile the template
              tpl = tpl.replace(/as-sortable/g, 'as-sortable-DISABLED');
              $scope.cannotSort = true;
            }
            // min/max lengths
            $scope.keyMinlength = keyValueEditorConfig.keyMinlength || $attrs.keyMinlength;
            $scope.keyMaxlength = keyValueEditorConfig.keyMaxlength || $attrs.keyMaxlength;
            $scope.valueMinlength = keyValueEditorConfig.valueMinlength || $attrs.valueMinlength;
            $scope.valueMaxlength = keyValueEditorConfig.valueMaxlength || $attrs.valueMaxlength;
            // validation regex
            $scope.keyValidator = keyValueEditorConfig.keyValidator || $attrs.keyValidator;
            $scope.valueValidatorError = keyValueEditorConfig.valueValidatorError || $attrs.valueValidatorError;
            $scope.keyValidatorError = keyValueEditorConfig.keyValidatorError || $attrs.keyValidatorError;
            $scope.valueValidatorError = keyValueEditorConfig.valueValidatorError || $attrs.valueValidatorError;
            // secret values
            $scope.secretValueTooltip = keyValueEditorConfig.secretValueTooltip || $attrs.secretValueTooltip;
            $scope.secretValueIcon = keyValueEditorConfig.secretValueIcon || $attrs.secretValueIcon;

            // manually compile and append to the DOM
            $elem.append($compile(tpl)($scope));
          },
          controller: [
            '$scope',
            function($scope) {
              $scope.$watch('entries', function() {
                if(!$scope.cannotAdd && (get(last($scope.entries), 'name') !== '')) {
                  addEmptyEntry($scope.entries);
                }
              });
              // will add a new text input every time the last
              // set is selected.
              $scope.onFocusLast = function() {
                if (!$scope.cannotAdd && !$scope.isReadonly) {
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
                  }

              };
            }
          ]
          // as a fn in case we want to allow configurable templates
          // templateUrl: function() {
          //   return 'key-value-editor.html';
          // }
        };
      }]);

})();

(function() {
  'use strict';
  angular
    .module('key-value-editor')
    .provider('keyValueEditorConfig', [
      function() {
        var defaults = {
          keyMinlength: '',                       // min character length, falsy by default
          keyMaxlength: '',                       // max character length, falsy by default
          valueMinlength: '',                     // min character length, falsy by default
          valueMaxlength: '',                     // max character length, falsy by default
          keyValidator: '[a-zA-Z0-9-_]+',         // alphanumeric, with dash & underscores
          valueValidator: '',                     // values have no default validation
          keyValidatorError: undefined,           // default error message string
          valueValidatorError: undefined,         // default error message string
          secretValueTooltip: undefined,          // secret values have no default tooltip
          secretValueIcon: 'fa fa-user-secret'    // default icon for secret values
        };

        // set a new default key value pair, or pass an object to replace
        // multiple keys.
        // example 1:
        //  keyValueEditorConfigProvider.set('keyValidator', '\S*') // no white space
        // example 2:
        //  keyValueEditorConfigProvider.set({
        //      keyValidator: '[a-zA-Z0-9]+',  // alphanumberic,
        //      keyValidatorError: 'key must be alphanumeric only'
        //  });
        this.set = function(key, value) {
          if(angular.isObject(key)) {
            angular.extend(defaults, key);
          } else {
            defaults[key] = value;
          }
        };

        this.$get = [
          function() {
            return defaults;
          }
        ];
      }
    ]);
})();

(function() {
  'use strict';

  // simple set of utils to share
  angular
    .module('key-value-editor')
    .factory('keyValueEditorUtils', [
      function() {
        // simple reduce fn
        var reduce = function(arr, fn, memo) {
          for(var i = 0; i < arr.length; i++) {
            memo = fn(memo, arr[i], i, arr);
          }
          return memo;
        };

        // expects a flat array, removes empty arrays.
        // is used to eliminate extra empty pairs generated by user
        var compact = function(list) {
            return reduce(
                    list,
                    function(memo, next) {
                      if(next.length) {
                        memo.push(next);
                      }
                      return memo;
                    },
                    []);
        };

        var last = function(entries) {
          return entries && entries[entries.length - 1];
        };
        // this is a minimal get w/o deep paths
        var get = function(obj, prop) {
          return obj && obj[prop];
        };

        return {
          compact: compact,
          last: last,
          get: get
        };
      }
    ]);
})();
