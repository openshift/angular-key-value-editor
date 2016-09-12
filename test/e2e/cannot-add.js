'use strict';

var nav = require('./helpers/navigate.js');
var kve = require('./helpers/keyValueEditor.js');

beforeEach(function() {
  nav.goTo(nav.pages.cannotAdd);
});

describe('key-value-editor cannot-add', function() {
  it('should not be able to add new entries', function() {
    var editor = kve.find();
    var countInputs = kve.getInputsCount(editor);
    // normally clicking the last input will generate new rows, but these special
    // inputs should not be rendered:
    kve.getAddRowInput(editor).click();
    kve.getAddRowInput(editor).click();
    kve.getAddRowInput(editor).click();
    // clicking the last input, regardless of class, to ensure it does not add a row:
    kve.getInputs(editor).last().click();
    kve.getInputs(editor).last().click();
    kve.getInputs(editor).last().click();
    kve.getInputs(editor).last().click();
    // the add row link should not be present, but will ensure via this test:
    kve.getAddRowLink(editor).click();

    expect(kve.getInputsCount(editor)).toEqual(countInputs);
  });
});
