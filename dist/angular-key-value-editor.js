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

        var uniqueForKey = function(unique, $index) {
          return 'key-value-editor-key-' + unique + '-' + $index;
        };

        var uniqueForValue = function(unique, $index) {
          return 'key-value-editor-value-' + unique + '-' + $index;
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
            showHeader: '=?',                           // show placeholder text as headers
            allowEmptyKeys: '=?',
            keyRequiredError: '@'
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
            if('allowEmptyKeys' in $attrs) {
              $scope.allowEmptyKeys = true;
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
              keyRequiredError: config.keyRequiredError || $attrs.keyRequiredError,
              // validation error tooltip
              keyValidatorErrorTooltip: config.keyValidatorErrorTooltip || $attrs.keyValidatorErrorTooltip,
              keyValidatorErrorTooltipIcon: config.keyValidatorErrorTooltipIcon || $attrs.keyValidatorErrorTooltipIcon,
              valueValidatorErrorTooltip: config.valueValidatorErrorTooltip || $attrs.valueValidatorErrorTooltip,
              valueValidatorErrorTooltipIcon: config.valueValidatorErrorTooltipIcon || $attrs.valueValidatorErrorTooltipIcon,
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
                uniqueForKey: uniqueForKey,
                uniqueForValue: uniqueForValue,
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
                // entries MUST be an array. if we get an empty array,
                // we add an empty entry to ensure the inputs snow.
                // NOTE: entries must be an array, with a .push() method
                // else addEntry() will fail.
                if(newVal && !newVal.length) {
                  addEntry($scope.entries);
                }
              });

            }
          ]
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
          keyMinlength: '',                                        // min character length, falsy by default
          keyMaxlength: '',                                        // max character length, falsy by default
          valueMinlength: '',                                      // min character length, falsy by default
          valueMaxlength: '',                                      // max character length, falsy by default
          keyValidator: '[a-zA-Z0-9-_]+',                          // alphanumeric, with dash & underscores
          valueValidator: '',                                      // values have no default validation
          keyValidatorError: 'Validation error',                   // default error message string
          keyValidatorErrorTooltip: undefined,                     // default error message tooltip string
          keyValidatorErrorTooltipIcon: 'pficon pficon-help',      // default error message tooltip icon
          valueValidatorError: 'Validation error',                 // default error message string
          valueValidatorErrorTooltip: undefined,                   // default error message tooltip string
          valueValidatorErrorTooltipIcon: 'pficon pficon-help',    // default error message tooltip icon
          keyPlaceholder: '',
          valuePlaceholder: '',
          keyRequiredError: 'Key is required'
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

        var noop = function() {};

        // simple reduce fn
        var reduce = function(arr, fn, memo) {
          var length = (arr && arr.length) || 0;
          for(var i = 0; i < length; i++) {
            memo = fn(memo, arr[i], i, arr);
          }
          return memo;
        };

        var each = function(arr, fn) {
          var length = (arr && arr.length) || 0;
          for(var i = 0; i < length; i++) {
            fn(arr[i], i, arr);
          }
        };

        var map = function(arr, fn) {
          var length = (arr && arr.length) || 0;
          var list = [];
          for(var i = 0; i < length; i++) {
            list.push(fn(arr[i], i, arr));
          }
          return list;
        };

        // expects a flat array, removes empty arrays.
        // is used to eliminate extra empty pairs generated by user
        var compact = function(list) {
            return reduce(
                    list,
                    function(memo, next) {
                      if(next) {
                        memo.push(next);
                      }
                      return memo;
                    },
                    []);
        };

        var contains = function(list, item) {
          return list.indexOf(item) !== -1;
        };

        var last = function(entries) {
          return entries && entries[entries.length - 1];
        };
        var first = function(entries) {
          return entries && entries[0];
        };
        // this is a minimal get w/o deep paths
        var get = function(obj, prop) {
          return obj && obj[prop];
        };

        // these keys are for kve and, if this function is used, will be removed.
        var toClean = [
          'valueAlt',
          'isReadOnly',
          'isReadonlyKey',
          'cannotDelete',
          'keyValidator',
          'valueValidator',
          'keyValidatorError',
          'valueValidatorError',
          'keyIcon',
          'keyIconTooltip',
          'valueIcon',
          'valueIconTooltip',
          'keyValidatorErrorTooltip',
          'keyValidatorErrorTooltipIcon',
          'valueValidatorErrorTooltip',
          'valueValidatorErrorTooltipIcon'
        ];
        var cleanEntry = function(entry) {
          each(toClean, function(key) {
            delete entry[key];
          });
          return entry;
        };

        var cleanEntries = function(entries) {
          return map(entries, cleanEntry);
        };

        // cleans each entry of kve known keys and
        // drops any entry that has neither a key nor a value
        // NOTE: if the input validator fails to pass, then an
        // entry will not have a value and will be excluded. This
        // is not the fault of this function.
        var compactEntries = function(entries) {
          return compact(
                  map(
                    entries,
                    function(entry) {
                      entry = cleanEntry(entry);
                      return entry.name || entry.value ? entry : undefined;
                    }));
        };

        // returns an object of key:value pairs, last one in will win:
        // {
        //  foo: 'bar',
        //  baz: 'bam'
        // }
        var mapEntries = function(entries) {
          return reduce(
                  compactEntries(entries),
                  function(result, next) {
                    result[next.name] = next.value;
                    return result;
                  }, {});
        };

        return {
          noop: noop,
          each: each,
          reduce: reduce,
          compact: compact,
          contains: contains,
          first: first,
          last: last,
          get: get,
          cleanEntry: cleanEntry,
          cleanEntries: cleanEntries,
          compactEntries: compactEntries,
          mapEntries: mapEntries
        };
      }
    ]);
})();
