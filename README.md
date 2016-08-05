# angular-key-value-editor
A simple UI for editing key-value pairs

![key-value-editor screenshot](/docs/key-value-editor-screenshot.png)

## Dependencies

This key-value-editor is based on the bootstrap based framework [Patternfly](https://www.patternfly.org/#_).  Patternfly or a similar boostrap based framework should be present for proper layout rendering. Icons are from font awesome.  Alternative layouts with a different framework could be achieved by replacing the `key-value-editor.html` template which is pre-compiled into `compiled-templates.js` for convenience.

## Basic usage:

Add the `key-value-editor` in html and provide it some data via the entries attribute:

```html
<!-- hard coded -->
<key-value-editor entries="[{key: 'foo', value: 'bar'}]"></key-value-editor>
<!-- via scope -->
<key-value-editor entries="entries"></key-value-editor>
```
Note that entries is *required* or `<key-value-editor>` will log an error!

## Attributes

For configuring the directive as a whole, use the following attributes.  

Readonly:
```html
<key-value-editor
  entries="entries"
  is-readonly></key-value-editor>
```
(`is-readonly` can also be an array of string names `is-readonly="['foo']"` for selectively making individual entries readonly.  In addition, each `entry.isReadonly` can be set to `true||false`.)

Readonly keys:
```html
<key-value-editor
  entries="entries"
  is-readonly-keys></key-value-editor>
```
Makes the keys of the inital set of entries readonly. Does not affect added entries.
(In implementation, this just sets `isReadonlyKey: true` on each of the entries in the initial set of entries for you.  `isReadonlyKey` can be directly controlled if preferred)

Disable adding new entries:
```html
<key-value-editor
  entries="entries"
  cannot-add></key-value-editor>
```

Disable sorting entries:
```html
<key-value-editor
  entries="entries"
  cannot-sort></key-value-editor>
```

Disable deleting entries:
```html
<key-value-editor
  entries="entries"
  cannot-delete></key-value-editor>
```
(`cannot-delete` can also be an array of string names `cannot-delete="['foo']"` for selectively making individual entries readonly.  In addition, each `entry.cannotDelete` can be set to `true||false`.)

Use the attributes together:
```html
<key-value-editor
  entries="entries"
  is-readonly
  cannot-add    
  cannot-sort
  cannot-delete></key-value-editor>
```

Some of the above attributes can also be applied to individual entries to control them uniquely within the set:
```javascript
$scope.entries = [{
  key: 'foo',
  value: 'bar',
  isReadonly: true,      // key & value are readonly
  isReadonlyKey: true,   // only key (name) is readonly
  cannotDelete: true
}];
```

Validator attributes and error messages:
```html
<key-value-editor
  entries="entries"
  key-validator="[a-zA-Z0-9_]*"
  key-validator-error="Invalid name"  
  value-validator="[a-zA-Z0-9_]*"
  value-validator-error="Invalid value"></key-value-editor>
```
To pass a regex directly (or an object with a `.test()` method, simulating a regex), you can do something like the following:
```javascript
// controller code:
$scope.validation = {
  key: new RegExp('^[0-9]+$'), // numbers only
  val: {
    test: function(val) {
      // some complicated test w/multiple regex or other insanity
    }
  }
}
```
```html
<!-- view code -->
<key-value-editor
  entries="entries"
  key-validator-regex="validation.key"
  key-validator-error="Invalid name, numbers only plz"  
  value-validator-regex="validation.val"
  value-validator-error="Invalid value, cuz *complicated* things"></key-value-editor>
```


All attributes for convenient reference.
```html
<key-value-editor
  entries="[
    {name: 'foo', value: 'stuff'},
    {name: 'bar', value: 'things'},
    {
      name: 'baz',
      value: '3',
      isReadonly: true,
      cannotDelete: true,
      isReadonlyKey: true
    }
  ]"
  key-placeholder="name"
  key-min-length="3"
  key-max-length="25"
  key-validator="[a-zA-Z0-9_]*"
  key-validator-error="Invalid name"
  key-validator-error-tooltip="Name must be alphanumeric including - and _"
  key-validator-error-tooltip-icon="fa fa-exclamation-circle"
  value-placeholder="value"
  value-min-length="3"
  value-max-length="25"
  value-validator="[a-zA-Z0-9_]*"
  value-validator-error="Invalid value"
  secret-value-tooltip="This is a hidden value"
  secret-value-icon="fa fa-external-link-square"
  is-readonly="['can','be','a','list']"
  is-readonly-keys
  cannot-delete="['can','be','a','list']"
  cannot-add    
  cannot-sort
  grab-focus></key-value-editor>
```


### Non-standard Values

![key-value-editor screenshot](/docs/key-value-editor-alt-values-screenshot.png)

Some entry lists may include non-standard key-value pairs. If the value is not a string, or is a different object entirely, such as this:

```javascript
$scope.entries = [{
                    name: 'entry_value',
                    value: 'value'
                  },{
                    name: 'valueFrom-valueAlt',
                    isReadonly: true,
                    // non-standard
                    valueFrom: {
                      "configMapKeyRef": {
                        "name": "test-configmap",
                        "key": "data-1"
                      }
                    },
                    // valueAlt to the rescue!
                    valueAlt: 'valueFrom is a non-standard value',
                  }];
```
The `valueAlt` attribute can provide the user with some alt text for understanding that this key-value pair will not display properly. It is not necessary to set `isReadonly:true` as an input receiving `valueAlt` will auto to `readonly`.  The `valueValidator` property, `minLength` and `maxLength` properties are all ignored as `valueAlt` is help text and it is assumed that it will break typical validation rules for the rest of the values.


## Tooltip

NOTE: the default template provided with `<key-value-editor>` uses bootstrap tooltips via Patternfly/Bootstrap. Be sure to [initialize the tooltips](http://getbootstrap.com/javascript/#tooltips-examples) somewhere with code such as:

```javascript
// opt in to the bootstrap tooltips
$('[data-toggle="tooltip"]').tooltip();

```

## Validation

General validation rules can be put on the directive as attributes and will run
against each of the entries:

```html
<key-value-editor
  key-validator="{{regex}}"
  value-validator="{{regex2}}"
  key-validator-error="The error message if you break it"
  value-validator-error="The other error message if you break it"></key-value-editor>
```

For a more granular approach, each entry provided can have its own custom validation rules that will override the generic set on the directive:

```javascript
return [{
  key: 'foo',
  value: 'bar',
  keyValidator: '[a-zA-Z0-9]+' // alphanumeric
  keyValidatorError: 'Thats not alphanumeric!!',
  valueValidator: '[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}', // email address
  valueValidatorError: 'Hey, this has to be an email.'
}]
```
For convenience, here are a few useful regex.  Note that the `<key-value-editor>` internally uses `ng-pattern` which expects string regex that angular will internally `new RegExp('^' + regex + '$');`.  Therefore be sure to leave off the leading `/^` and trailing `$/` or your regex will not work.

```javascript
// <key-value-editor key-validator="regex.digitsOnly"></key-value-editor>
$scope.regex = {
  noWhiteSpace: '\S*',
  digitsOnly: '[0-9]+',
  alphaOnly: '[a-zA-Z]+',
  alphaNumeric: '[a-zA-Z0-9]+',
  alphaNumericUnderscore: '[a-zA-Z0-9_]*',
  alphaNumericDashes: '[a-zA-Z0-9-_]+',
  email: '[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}',
}
```

### Setting global validation via the provider

Global defaults can be set via the provider:

```javascript
angular
  .module('demo')
  .config([
    'keyValueEditorConfigProvider',
    function(keyValueEditorConfigProvider) {
      // set a global value here:
      keyValueEditorConfigProvider.set('keyValidator', '[0-9]+');
      // or, pass an object to set multiple values at once:
      keyValueEditorConfigProvider.set({
        keyValidator: '[0-9]+',
        keyValidatorError: 'This is an invalid key'
      });
    }
  ]);
```
Globals are still overridden via attributes on the `<key-value-editor>` directive, or via the `entries="entries"` data objects passed to the directive.

### Other utils

There are two useful utility functions provided to help process the `entries`. The first will eliminate entries missing the name or value, the second will convert the list of entries to a map (object) of name-values (duplicate keys override values).

```javascript
angular
  .module('app')
  .controller([
    'keyValueEditorUtils'
    function(kveUtils) {
      angular.extend($scope, {
        entries: [{name: 'foo', value: 'bar'}],
        // a 'save'function
        onSubmit: function() {
          // eliminates entries missing a key or val.
          console.log('compact', kveUtils.compactEntries($scope.entries));
          // transforms the array into an object.
          console.log('map', kveUtils.mapEntries($scope.entries));
        }
      })
    }
  ]);
```
If other filtering/mapping abilities are needed user will have to write own utils or use a lib such as lodash.
