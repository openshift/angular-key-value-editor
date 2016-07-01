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
  isReadonly: true,
  cannotDelete: true
}];
```
All attributes for convenient reference.
```html
<key-value-editor
  entries="[
    {name: 'foo', value: 'stuff'},
    {name: 'bar', value: 'things'},
    {name: 'baz', value: '3', isReadonly: true, cannotDelete: true}
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
  cannot-delete="['can','be','a','list']"
  cannot-add    
  cannot-sort></key-value-editor>
```


### Secret values

![key-value-editor screenshot](/docs/key-value-editor-secret-screenshot.png)

Values that contain secrets display with a special presentation.  This display includes a configurable icon and tooltip.  The
default icon is [Font Awesome's user-secret](http://fontawesome.io/icon/user-secret/).

The default icon can be overridden using any of [PatternFly's icons](https://www.patternfly.org/styles/icons/#_) via an attribute

```html
<key-value-editor
  entries="entries"
  secret-value-icon="fa fa-lock"></key-value-editor>
```

or a global default.

There is no default for the secret value tooltip, but one can be set via an
attribute

```html
<key-value-editor
  entries="entries"
  secret-value-tooltip="This value is secret"></key-value-editor>
```

or a global default.

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
