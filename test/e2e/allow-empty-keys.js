'use strict';

var nav = require('./helpers/navigate.js');
var kve = require('./helpers/keyValueEditor.js');

beforeEach(function() {
  nav.goTo(nav.pages.allowEmptyKeys);
});

describe('key-value-editor allow-empty-keys', function() {

  // Can't double nest describe? odd...
  //describe('default behavior', function() {
    it('should invalidate the key input if a row is added w/o a key', function() {
      var editor = kve.find();
      var input = kve.getFirstValueInput(editor);
      input.sendKeys('12345');
      var invalidInputs = kve.getInvalidInputs(editor);
      var invalidFormGroups = kve.getInvalidFormGroups(editor);
      expect(invalidInputs.count()).toBeGreaterThan(0);
      expect(invalidFormGroups.count()).toBeGreaterThan(0);
    });
  //});

  //describe('with allow-empty-keys attrib', function() {
    it('should allow the row to remain vaild if it is added w/o a key', function() {
      var editor = kve.findAll().get(3);
      var input = kve.getFirstValueInput(editor);
      input.sendKeys('12345');
      var invalidInputs = kve.getInvalidInputs(editor);
      var invalidFormGroups = kve.getInvalidFormGroups(editor);
      expect(invalidInputs.count()).toEqual(0);
      expect(invalidFormGroups.count()).toEqual(0);
    });
  //});


});
