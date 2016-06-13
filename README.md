# angular-key-value-editor
A simple UI for editing key-value pairs

<!--
## TODO:
- need to ensure that we can support various data formats, not just arrays of       arrays, though the directive itself should be pretty dumb (only support array of arrays)
- optionally invalidate the parent form if something is wonky
  - example: enforce a format for key-value pairs, such as `no spaces`.  
  - should this be easy to use attribs, or a regex? (or both)
- add an image / animated-gif to show what it looks like & how it works
- document dependency on bootstrap/patternfly
- document how one could override the template if they did not want the dependency on bootstrap/patternfly
-->

## Basic usage:

Add the `key-value-editor` in html and provide it some data:

```html
<!-- hard coded -->
<key-value-editor entries="[{key: 'foo', value: 'bar'}]"></key-value-editor>
<!-- via scope -->
<key-value-editor entries="entries"></key-value-editor>
```

## Attributes

For configuring the directive as a whole, use the following attributes.  

Readonly:
```html
<key-value-editor
  entries="entries"
  is-readonly></key-value-editor>
```

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
