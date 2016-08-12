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
      function($compile, $log, $templateCache, $timeout, $window, keyValueEditorConfig, keyValueEditorUtils) {

        var first = keyValueEditorUtils.first;
        var contains = keyValueEditorUtils.contains;
        var each = keyValueEditorUtils.each;
        var unique = 1000;
        // var last = keyValueEditorUtils.last;
        // var get = keyValueEditorUtils.get;
        // not used internally, however users can ask for keyValueEditorUtils and
        // use this function to clean out empty pairs from the list when they are ready
        // to save/preserve.  Also can just use _.compact() or any other library that
        // provides this util if it is already available.
        // var compact = keyValueEditorUtils.compact;

        // a few utils
        var newEntry = function() {
          return {name: '', value: ''};
        };

        var addEntry = function(entries, entry) {
          entries && entries.push(entry || newEntry());
        };

        var setFocusOn = function(selector, value) {
          // $timeout just delays to ensure
          // events/rendering resolve
          $timeout(function() {
            var element = first($window.document.querySelectorAll(selector));
            if(element) {
              element.focus();
              // to put cursor at the end of the text after focus, must do the dance of
              // setting the value to nothing, then applying
              element.value = '';
              element.value = value;
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
            //  isReadonlyKey: true || false  // key name on an individual entry is readonly
            //  cannotDelete: true || false   // individual entries can be permanent
            //  keyValidator: '',             // regex string
            //  valueValidator: ''            // regex string
            //  keyValidatorError: '',        // custom validation error
            //  valueValidatorError: ''       // custom validation error
            //  keyIcon: '',                  // icon class, such as 'fa fa-lock'
            //  keyIconTooltip: '',           // text for tooltip
            //  valueIcon: '',                // icon class, such as 'fa fa-lock'
            //  valueIconTooltip: ''          // text for tooltip
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
            isReadonlyKeys: '=?'                      // will only apply to existing keys
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
            '$timeout',
            function($scope) {
              $scope.forms = {};
              $scope.placeholder = newEntry();
              var readOnlySome = [];
              var cannotDeleteSome = [];
              // generate a unique class name for each editor, so that the
              // onFocusLast() fn below can select the correct node with
              // certainty if there are many instances of the key-value-editor
              // on the page.
              var setFocusClass = 'key-value-editor-set-focus-' + unique++;
              $scope.setFocusKeyClass = setFocusClass + '-key';
              $scope.setFocusValClass = setFocusClass + '-val';


              $scope.onKeyChange = function() {
                addEntry($scope.entries, {
                  name: $scope.placeholder.name,
                  value: $scope.placeholder.value
                });
                setFocusOn('.'+ $scope.setFocusKeyClass, $scope.placeholder.name);
                $scope.placeholder = newEntry();
              };

              $scope.onValChange = function() {
                addEntry($scope.entries, {
                  name: $scope.placeholder.name,
                  value: $scope.placeholder.value
                });
                setFocusOn('.'+ $scope.setFocusValClass, $scope.placeholder.value);
                $scope.placeholder = newEntry();
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
                  orderChanged: function() {
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
          keyValidatorError: undefined,                            // default error message string
          keyValidatorErrorTooltip: undefined,                     // default error message tooltip string
          keyValidatorErrorTooltipIcon: 'pficon pficon-help',      // default error message tooltip icon
          valueValidatorError: undefined,                          // default error message string
          valueValidatorErrorTooltip: undefined,                   // default error message tooltip string
          valueValidatorErrorTooltipIcon: 'pficon pficon-help',    // default error message tooltip icon
          secretValueTooltip: undefined,                           // secret values have no default tooltip
          secretValueIcon: 'fa fa-user-secret',                    // default icon for secret values
          keyPlaceholder: '',
          valuePlaceholder: ''
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
          console.log('entries?', entries);
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
