(function() {
  'use strict';

  angular
    .module('key-value-editor')
    .directive('keyValueEditor', [
      '$compile',
      '$log',
      '$templateCache',
      '$timeout',
      '$window',
      'keyValueEditorConfig',
      'keyValueEditorUtils',
      function($compile, $log, $templateCache, $timeout, $window, keyValueEditorConfig, keyValueEditorUtils) {

        var first = keyValueEditorUtils.first;
        var contains = keyValueEditorUtils.contains;
        // var last = keyValueEditorUtils.last;
        // var get = keyValueEditorUtils.get;
        // not used internally, however users can ask for keyValueEditorUtils and
        // use this function to clean out empty pairs from the list when they are ready
        // to save/preserve.  Also can just use _.compact() or any other library that
        // provides this util if it is already available.
        // var compact = keyValueEditorUtils.compact;

        // a few utils
        var addEmptyEntry = function(entries) {
          entries && entries.push({name: '', value: ''});
        };

        var setFocusLastEntry = function(selector) {
          // $timeout just delays to ensure
          // events/rendering resolve
          $timeout(function() {
            var element = first($window.document.querySelectorAll(selector));
            if(element) {
              element.focus();
            }
          });
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
            entries: '=',
            keyPlaceholder: '@',
            valuePlaceholder: '@',
            keyValidator: '@',                        // general key regex validation string
            valueValidator: '@',                      // general value regex validation string
            keyValidatorError: '@',                   // general key validation error message
            keyValidatorErrorTooltip: '@',
            keyValidatorErrorTooltipIcon: '@',
            valueValidatorError: '@',                 // general value validation error message
            valueValidatorErrorTooltip: '@',
            valueValidatorErrorTooltipIcon: '@',
            secretValueTooltip: '@',
            secretValueIcon: '@',
            cannotAdd: '=?',
            cannotSort: '=?',
            cannotDelete: '=?',
            isReadonly: '=?'
          },
          link: function($scope, $elem, $attrs) {
            // manually retrieving here so we can manipulate and compile in JS
            var tpl = $templateCache.get('key-value-editor.html');

            // if an attribute exists, set its corresponding bool to true
            if('cannotAdd' in $attrs) {
              $scope.cannotAdd = true;
            }
            if('cannotDelete' in $attrs) {
              $scope.cannotDeleteAny = true;
            }
            if('isReadonly' in $attrs) {
              $scope.isReadonlyAny = true;
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
            $scope.valueValidator = keyValueEditorConfig.valueValidator || $attrs.valueValidator;
            $scope.keyValidatorError = keyValueEditorConfig.keyValidatorError || $attrs.keyValidatorError;
            $scope.valueValidatorError = keyValueEditorConfig.valueValidatorError || $attrs.valueValidatorError;
            // validation error tooltip
            $scope.keyValidatorErrorTooltip = keyValueEditorConfig.keyValidatorErrorTooltip || $attrs.keyValidatorErrorTooltip;
            $scope.keyValidatorErrorTooltipIcon = keyValueEditorConfig.keyValidatorErrorTooltipIcon || $attrs.keyValidatorErrorTooltipIcon;
            $scope.valueValidatorErrorTooltip = keyValueEditorConfig.valueValidatorErrorTooltip || $attrs.valueValidatorErrorTooltip;
            $scope.valueValidatorErrorTooltipIcon = keyValueEditorConfig.valueValidatorErrorTooltipIcon || $attrs.valueValidatorErrorTooltipIcon;
            // secret values
            $scope.secretValueTooltip = keyValueEditorConfig.secretValueTooltip || $attrs.secretValueTooltip;
            $scope.secretValueIcon = keyValueEditorConfig.secretValueIcon || $attrs.secretValueIcon;
            // placeholders
            $scope.keyPlaceholder = keyValueEditorConfig.keyPlaceholder || $attrs.keyPlaceholder;
            $scope.valuePlaceholder = keyValueEditorConfig.valuePlaceholder || $attrs.valuePlaceholder;
            // manually compile and append to the DOM
            $elem.append($compile(tpl)($scope));
          },
          controller: [
            '$scope',
            function($scope) {
              $scope.forms = {};
              var readOnlySome = [];
              var cannotDeleteSome = [];
              // generate a unique class name for each editor, so that the
              // onFocusLast() fn below can select the correct node with
              // certainty if there are many instances of the key-value-editor
              // on the page.
              var setFocusClass = 'key-value-editor-set-focus-'+Date.now();
              $scope.setFocusClass = setFocusClass;

              $scope.onFocusLast = function() {
                if (!$scope.cannotAdd && !$scope.isReadonly) {
                  addEmptyEntry($scope.entries);
                  setFocusLastEntry('.'+setFocusClass);
                }
              };
              // clicking the delete button removes the pair
              $scope.deleteEntry = function(start, deleteCount) {
                $scope.entries.splice(start, deleteCount);
                $scope.forms.keyValueEditor.$setDirty();
              };
              $scope.dragControlListeners = {
                  // only allow sorting within the parent instance
                  accept: function (sourceItemHandleScope, destSortableScope) {
                    return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
                  },
                  orderChanged: function(event) {
                    $scope.forms.keyValueEditor.$setDirty();
                  }
              };
              // cannotDelete and isReadonly are boolean or list values.
              // if boolean, they apply to all.
              // if arrays, they apply to the items passed.
              // GOTCHA:
              // we suppport:
              //   <key-value-editor is-readonly cannot-delete>
              // and:
              //   <key-value-editor is-readonly="['foo']" cannot-delete="['foo','bar']">
              // changing the is-readonly and cannot-delete to a list and then
              // setting the list to undefined/null will not:
              //   cannotDeleteAny = false;
              // why?
              //   we assume the presence of is-readonly similar to disabled and other html
              //   attributes that are 'truthy' though they have no actual value.
              // workaround?
              //   potentially using ng-attr-cannot-delete=false?
              $scope.$watch('cannotDelete', function(newVal) {
                if(angular.isArray(newVal)) {
                  $scope.cannotDeleteAny = false;
                  cannotDeleteSome = newVal;
                }
              });
              $scope.$watch('isReadonly', function(newVal) {
                if(angular.isArray(newVal)) {
                  $scope.isReadonlyAny = false;
                  readOnlySome = newVal;
                }
              });
              $scope.isReadonlySome = function(name) {
                return contains(readOnlySome, name);
              };
              $scope.cannotDeleteSome = function(name) {
                return contains(cannotDeleteSome, name);
              };
            }
          ]
        };
      }]);

})();
