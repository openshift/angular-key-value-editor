# Testing

## Running the tests

**TLDR;**
use `gulp tdd` during development to continuously run unit tests, use `gulp test` to run all of the various tests once.

**The detailed version**
- The `gulp test` command will run all the tests
- The `gulp tdd` command will run only the unit tests using `Firefox` (assuming development is done in `Chrome` anyway), watch the files for changes and will run the tests again after every save.
- The `gulp test-unit` command will run only the unit tests (once), using headless Firefox, then exit.  Headless Firefox is used assuming this will be run in a `CI` type of environment.
- The `gulp test-e2e` will run the e2e style tests using protractor. Currently using `Chrome`, should switch to `Firefox`, `Safari` or `IE`.
- The `gulp serve` task will serve up the `/tests/manual` directory for browsing.

Since this is a directive that responds primarily to user interaction, most of the tests are in an `e2e` format.


### Protractor debugging

[Debugging docs](https://github.com/angular/protractor/blob/master/docs/debugging.md)

```javascript
  // pause the browser after prev task. webdriver will give you interface for
  // resuming, etc.
  // "c" to move forward 1 task
  // "repl" to enter interactive module
  // "ctrl + C" to resume
  browser.pause();
  // insert this into a test to pause
  browser.debugger();
```

<!-- Hide the todo list from render

## TODO list

Things to setup for testing

- [ ] need a fixture file for Karma tests
- [x] move /test/ to /test/manual because this is more obvious in purpose
  - [x] and update the gulp task

Things to test, either via unit or e2e. Should probably sort & ensure its sensible

- [ ] single editor
  - [ ] no attribs
  - [ ] just entries
  - [ ] just entries with each attribute alone
  - [ ] entries
    - [ ] with attribute overrides on each entry
- [ ] multiple editors with different data
- [ ] multiple editors with the same data
- [ ] data updates via $timeout
  - [ ] be sure to trigger observables
    - [ ] $timeout, simulation of API call, etc. changing values should update
    - [ ] verify $watch calls do not error out

- [x] basic rendering with entries only
- [x] basic input interactions
- [ ] attributes
  - [x] cannot-add
  - [x] cannot-sort
  - [x] cannot-delete
  - [x] is-readonly
- [ ] validation
  - [x] obeys `key-validator` string attribute
  - [x] obeys `value-validator` string attribute
  - [ ] obeys `key-validator` variable (from controller)
  - [ ] obeys `value-validator` variable (from controller)
  - [ ] obeys `key-validator` as a function (from controller)
  - [ ] obeys `value-validator` as a function (from controller)
  - [x] sets 'has-error' class on form-group when invalid
  - [x] removes 'has-error' class from form-group when valid
  - [x] sets error class on input when invalid
  - [x] removes error class on input when valid
  - [x] shows validation feedback message
  - [x] hides validation feedback message
  - [x] invalidates entire form when an input is invalid
  - [x] removes entire form invalidation when inputs validate
  - [x] shows min-length validation messages
  - [x] hides min-length validation messages
  - [x] limits to max length (but no message)

-->
