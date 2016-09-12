'use strict';
// the keyValueEditor pageObject
// protractors element.js:
// - https://github.com/angular/protractor/blob/2.1.0/lib/element.js
var hasClass = require('./hasClass').hasClass;

var findAll = function() {
  return element.all(by.tagName('key-value-editor'));
};

// shortcut to just get first instance
var find = function() {
  //return browser.findElement(by.tagName('key-value-editor'));
  return findAll().get(0);
};

// get inputs from a kve instance
// TODO: decide if these should return 'all' or if they should naturally filter
// out the 'last' two inputs, if the add-row-link attrib is used, because the
// last two inputs then have different behavior
var getInputs = function(editor) {
  return editor.all(by.css('input[type="text"]'));
};

var getReadonlyInputs = function(editor) {
  return editor
          .all(by.css('input[type="text"]'))
          .filter(function(elem) {
            return !!elem.getAttribute('readonly');
          });
};

var getFirstKeyInput = function(editor) {
  return getInputs(editor).get(0);
};

var getFirstValueInput = function(editor) {
  return getInputs(editor).get(1);
};

// an array of 2 inputs representing the first entry: {name: '', value: ''}
var getFirstInputPair = function(editor) {
  return [getFirstKeyInput(editor), getFirstValueInput(editor)];
};

var getInputsCount = function(editor) {
  return getInputs(editor).count();
};

var getKeyInputs = function(editor) {
  return getInputs(editor)
          .filter(function(elem, i) {
            // evens, 0 index, are the keys
            if(i % 2 === 0) {
              return elem;
            }
          });
};

var getValueInputs = function(editor) {
  return getInputs(editor)
          .filter(function(elem, i) {
            // odds, 0 index, are the values
            if(i % 2 === 1) {
              return elem;
            }
          });
};

// when `add-row-link` is not used, this input is a trigger to add a row
var getLastKeyInput = function(editor) {
  var inputs = getInputs(editor);
  return inputs.get(-2); // negative index from end
};

// when `add-row-link` is not used, this input is a trigger to add a row
var getLastValueInput = function(editor) {
  var inputs = getInputs(editor);
  return inputs.last();
};

var clickLastKeyInput = function(editor) {
  return getLastKeyInput(editor).click();
};

var clickLastValueInput = function(editor) {
  return getLastValueInput(editor).click();
};

var getFormGroups = function(editor) {
  return editor.all(by.css('form-group'));
};

var getInvalidFormGroups = function(editor) {
  return editor.all(by.css('.form-group.has-error'));
};

// returns help blocks for invalidFormGroups
var getHelpBlock = function(editor, text) {
  var invalid = getInvalidFormGroups(editor);
  if(text) {
    return invalid.all(by.cssContainingText('span.help-block', text));
  }
  return invalid.all(by.css('span.help-block'));
};

var getValidationText = function(editor, text) {
  return editor
          .all(by.cssContainingText('span.validation-text', text))
          .filter(function(el) {
            return el.isDisplayed();
          });
};

var getKeyMinlengthHelp = function(editor) {
  return editor.all(by.css('span.key-min-length'));
};

var getKeyValidationHelp = function(editor) {
  return editor.all(by.css('span.key-min-length'));
};

var getValueMinlengthHelp = function(editor) {
  return editor.all(by.css('span.key-min-length'));
};

var getValueValidationHelp = function(editor) {
  return editor.all(by.css('span.key-min-length'));
};

var getHelpIcon = function(editor) {
  return getHelpBlock(editor)
          .all(by.css('.help.action-inline i'));
};

// checks for any help messages visible in the editor. Useful to simplify tests
// fishing for specific nodes over and over, though at least some tests should
// pinpoint specific nodes.
var isAnyHelpVisible = function(editor) {
  return getHelpBlock(editor)
          .reduce(function(result, next) {
            if(next.isDisplayed()) {
              result = true;
            }
            return result;
          }, false);
};

// any inputs that do not pass validation rules
// note: rather than getting form groups with 'has-valid', should be able
// to update this to do something like this:
// expect(hasClass(element(by.name('your-element')), 'ng-invalid')).toBe(true);
// expect(hasClass(element(by.name('your-element')), 'ng-dirty')).toBe(true);
// TODO: decide if getting formGroups with 'has-error' is still helpful to
// ensure that visual feedback is not broken.
var getInvalidInputs = function(editor) {
  return editor.all(by.css('input.ng-invalid'));
};

var isFormValid = function(editor) {
  return !!editor.all(by.css('ng-form.ng-valid'));
};

var isFormInvalid = function(editor) {
  return !!editor.all(by.css('ng-form.ng-invalid'));
};

var getAddRowLink = function(editor) {
  return editor.all(by.css('.add-row-link'));
};

var getAddRowInput = function(editor) {
  return editor.all(by.css('.add-row-input'));
};

var getDeleteRowLink = function(editor) {
  return editor
          .all(by.css('.delete-row'))
          .filter(function(elem) {
            return elem.isDisplayed();
          });
};

var getSortRowLink = function(editor) {
  return editor
          .all(by.css('.sort-row'))
          .filter(function(elem) {
            return elem.isDisplayed();
          });
};

// TODO:
// fn for checking for add-row-link becuase this affects behavior of "last" inputs
// fn for getting the not-last inputs (relevant if add-row-link is true, else all inputs is fine)
module.exports = {
  find: find,
  findAll: findAll,
  getInputs: getInputs,
  getReadonlyInputs: getReadonlyInputs,
  getInputsCount: getInputsCount,
  getFirstKeyInput: getFirstKeyInput,
  getFirstValueInput: getFirstValueInput,
  getFirstInputPair: getFirstInputPair,
  getKeyInputs: getKeyInputs,
  getValueInputs: getValueInputs,
  getLastKeyInput: getLastKeyInput,
  getLastValueInput: getLastValueInput,
  clickLastKeyInput: clickLastKeyInput,
  clickLastValueInput: clickLastValueInput,
  getFormGroups: getFormGroups,
  getInvalidFormGroups: getInvalidFormGroups,
  getHelpBlock: getHelpBlock,
  getHelpIcon: getHelpIcon,
  getValidationText: getValidationText,
  getKeyMinlengthHelp: getKeyMinlengthHelp,
  getKeyValidationHelp: getKeyValidationHelp,
  getValueMinlengthHelp: getValueMinlengthHelp,
  getValueValidationHelp: getValueValidationHelp,
  getInvalidInputs: getInvalidInputs,
  isFormValid: isFormValid,
  isFormInvalid: isFormInvalid,
  isAnyHelpVisible: isAnyHelpVisible,
  getAddRowLink: getAddRowLink,
  getAddRowInput: getAddRowInput,
  getDeleteRowLink: getDeleteRowLink,
  getSortRowLink: getSortRowLink
};
