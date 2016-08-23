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
      function($compile, $log, $templateCache, $timeout, $window, config, utils) {

        var first = utils.first;
        var contains = utils.contains;
        var each = utils.each;
        var counter = 1000;
        var timeoutDelay = 25;

        var newEntry = function() {
          return {name: '', value: ''};
        };

        var addEntry = function(entries, entry) {
          entries && entries.push(entry || newEntry());
        };


        var setFocusOn = function(selector, value) {
          // $timeout just delays enough to ensure event/$digest resolution
          $timeout(function() {
            var element = first($window.document.querySelectorAll(selector));
            if(element) {
              element.focus();
              // if setting value, this will set the cursor at the end of the text in the value
              if(value) {
                element.value = '';
                element.value = value;
              }
            }
          }, timeoutDelay);
        };

        return {
          restrict: 'AE',
          scope: {
            keyMinlength: '@',                        // min character length
            keyMaxlength: '@',                        // max character length
            valueMinlength: '@',                      // min character length
            valueMaxlength: '@',                      // max character length
            // entries: [{
            //  name: 'foo',
            //  value: 'bar',
            //  isReadOnly: true|| false              // individual entries may be readonly
            //  isReadonlyKey: true || false          // key name on an individual entry is readonly
            //  cannotDelete: true || false           // individual entries can be permanent
            //  keyValidator: '',                     // regex string
            //  valueValidator: ''                    // regex string
            //  keyValidatorError: '',                // custom validation error
            //  valueValidatorError: ''               // custom validation error
            //  keyIcon: '',                          // icon class, such as 'fa fa-lock'
            //  keyIconTooltip: '',                   // text for tooltip
            //  valueIcon: '',                        // icon class, such as 'fa fa-lock'
            //  valueIconTooltip: ''                  // text for tooltip
            // }]
            entries: '=',
            keyPlaceholder: '@',
            valuePlaceholder: '@',
            keyValidator: '@',                        // general key regex validation string
            keyValidatorRegex: '=',                   // a regex object
            valueValidator: '@',                      // general value regex validation string
            valueValidatorRegex: '=',                 // a regex object
            keyValidatorError: '@',                   // general key validation error message
            keyValidatorErrorTooltip: '@',
            keyValidatorErrorTooltipIcon: '@',
            keyIconTooltip: '@',                      // if the tooltip for the key icon is generic
            valueValidatorError: '@',                 // general value validation error message
            valueValidatorErrorTooltip: '@',
            valueValidatorErrorTooltipIcon: '@',
            valueIconTooltip: '@',                    // if the tooltip for the value icon is generic
            cannotAdd: '=?',
            cannotSort: '=?',
            cannotDelete: '=?',
            isReadonly: '=?',
            isReadonlyKeys: '=?',                      // will only apply to existing keys,
            addRowLink: '@',                           // creates a link to "add row" and sets its text label
            showHeader: '=?'                           // show placeholder text as headers
          },
          link: function($scope, $elem, $attrs) {
            // manually retrieving here so we can manipulate and compile in JS
            var tpl = $templateCache.get('key-value-editor.html');
            var unwatchEntries;

            // validation is irritating.
            $scope.validation = {
              key: $scope.keyValidator,
              val: $scope.valueValidator
            };
            // override if we get a regex literal
            if($attrs.keyValidatorRegex) {
              $scope.validation.key = $scope.keyValidatorRegex;
            }
            if($attrs.valueValidatorRegex) {
              $scope.validation.val = $scope.valueValidatorRegex;
            }

            if('grabFocus' in $attrs) {
              $scope.grabFocus = true;
              // after render set to undefined to ensure it doesn't keep trying to grab focus
              $timeout(function() {
                  $scope.grabFocus = undefined;
              });
            }

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
            // only applies to the initial set, if a user adds an entry the
            // user must be allowed to set the key!
            if('isReadonlyKeys' in $attrs) {
              // the $scope.$watch here lets us wait until we are certain we get
              // a legitimate first set, perhaps after a promise resolution, run the
              // update, then unregister.
              unwatchEntries = $scope.$watch('entries', function(newVal) {
                if(newVal) {
                  each($scope.entries, function(entry) {
                    entry.isReadonlyKey = true;
                  });
                  unwatchEntries();
                }
              });
            }

            if('cannotSort' in $attrs) {
              // uses a regex to essentially kill the as-sortable directives
              // before we compile the template
              // TODO: this is obviously not two-way databinding compatible as
              // the template is then rendered once.  There is likely a
              // better way to do this.
              tpl = tpl.replace(/as-sortable/g, 'as-sortable-DISABLED');
              $scope.cannotSort = true;
            }

            if('showHeader' in $attrs) {
              $scope.showHeader = true;
            }

            // min/max lengths
            angular.extend($scope, {
              keyMinlength: config.keyMinlength || $attrs.keyMinlength,
              keyMaxlength: config.keyMaxlength || $attrs.keyMaxlength,
              valueMinlength: config.valueMinlength || $attrs.valueMinlength,
              valueMaxlength: config.valueMaxlength || $attrs.valueMaxlength,
              // validation regex
              keyValidator: config.keyValidator || $attrs.keyValidator,
              valueValidator: config.valueValidator || $attrs.valueValidator,
              keyValidatorError: config.keyValidatorError || $attrs.keyValidatorError,
              valueValidatorError: config.valueValidatorError || $attrs.valueValidatorError,
              // validation error tooltip
              keyValidatorErrorTooltip: config.keyValidatorErrorTooltip || $attrs.keyValidatorErrorTooltip,
              keyValidatorErrorTooltipIcon: config.keyValidatorErrorTooltipIcon || $attrs.keyValidatorErrorTooltipIcon,
              valueValidatorErrorTooltip: config.valueValidatorErrorTooltip || $attrs.valueValidatorErrorTooltip,
              valueValidatorErrorTooltipIcon: config.valueValidatorErrorTooltipIcon || $attrs.valueValidatorErrorTooltipIcon,
              // secret values
              secretValueTooltip: config.secretValueTooltip || $attrs.secretValueTooltip,
              secretValueIcon: config.secretValueIcon || $attrs.secretValueIcon,
              // placeholders
              keyPlaceholder: config.keyPlaceholder || $attrs.keyPlaceholder,
              valuePlaceholder: config.valuePlaceholder || $attrs.valuePlaceholder
            });

            // manually compile and append to the DOM
            $elem.append($compile(tpl)($scope));
          },
          controller: [
            '$scope',
            '$timeout',
            function($scope) {
              var readOnlySome = [];
              var cannotDeleteSome = [];
              var unique = counter++;

              angular.extend($scope, {
                unique: unique,
                forms: {},
                placeholder: newEntry(),
                setFocusKeyClass: 'key-value-editor-set-focus-key-' + unique,
                setFocusValClass: 'key-value-editor-set-focus-value-' + unique,
                dragControlListeners: {
                    // only allow sorting within the parent instance
                    accept: function (sourceItemHandleScope, destSortableScope) {
                      return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
                    },
                    orderChanged: function() {
                      $scope.forms.keyValueEditor.$setDirty();
                    }
                },
                deleteEntry: function(start, deleteCount) {
                  $scope.entries.splice(start, deleteCount);
                  // if the link is used, add a new empty entry to ensure the inputs do not all disappear
                  if(!$scope.entries.length && $scope.addRowLink) {
                    addEntry($scope.entries);
                  }
                  $scope.forms.keyValueEditor.$setDirty();
                },
                isReadonlySome: function(name) {
                  return contains(readOnlySome, name);
                },
                cannotDeleteSome: function(name) {
                  return contains(cannotDeleteSome, name);
                },
                onFocusLastKey: function() {
                  addEntry($scope.entries);
                  setFocusOn('.'+ $scope.setFocusKeyClass);
                  $timeout(function() {
                    $scope.placeholder.name = '';
                  },timeoutDelay);
                },
                onFocusLastValue: function() {
                  addEntry($scope.entries);
                  setFocusOn('.'+ $scope.setFocusValClass);
                  $timeout(function() {
                    $scope.placeholder.value = '';
                  },timeoutDelay);
                },
                onAddRow: function() {
                  addEntry($scope.entries);
                  setFocusOn('.'+ $scope.setFocusKeyClass);
                }
              });

              // Issue #78 todo:
              // https://github.com/openshift/angular-key-value-editor/issues/78
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

              // watching the attribute allows both:
              // <key-value-editor add-row-link>
              // <key-value-editor add-row-link="Add a pair">
              $scope.$watch('addRowLink', function(newVal) {
                if(angular.isDefined(newVal)) {
                  $scope.addRowLink = newVal || 'Add row';
                  if($scope.entries && !$scope.entries.length) {
                    addEntry($scope.entries);
                  }
                }
              });

              // ensures we always have at least one set of inputs
              $scope.$watch('entries', function(newVal) {
                if(newVal && !newVal.length) {
                  addEntry($scope.entries);
                }
              });

            }
          ]
        };
      }]);

})();
