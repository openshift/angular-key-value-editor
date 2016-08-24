'use strict';

var nav = require('./helpers/navigate.js');
var kve = require('./helpers/keyValueEditor.js');

beforeEach(function() {
  nav.goTo(nav.pages.singleWithValidation);
});

describe('key-value-editor validation', function() {
  describe('keyValidator alpha-numeric-dashes', function() {
    it('should validate when valid keys sent to key input', function() {
      var editor = kve.find();
      var first = kve.getFirstKeyInput(editor);
      first.clear().sendKeys('abcABC123');
      browser.waitForAngular();
      var invalids = kve.getInvalidInputs(editor);
      // should be at least 1 invalid
      expect(invalids.count()).toEqual(0);
    });

    it('should NOT validate when invalid keys sent to key input', function() {
      var editor = kve.find();
      var first = kve.getFirstKeyInput(editor);
      first.clear().sendKeys('# $ ( )');
      var invalidInputs = kve.getInvalidInputs(editor);
      var invalidFormGroups = kve.getInvalidFormGroups(editor);
      expect(invalidInputs.count()).toBeGreaterThan(0);
      expect(invalidFormGroups.count()).toBeGreaterThan(0);
    });

    it('should reset to valid state when invalid keys removed', function() {
      var editor = kve.find();
      var first = kve.getFirstKeyInput(editor);
      first.clear().sendKeys('# $ ( )');
      var invalidInputs = kve.getInvalidInputs(editor);
      expect(invalidInputs.count()).toEqual(1);
      first.clear().sendKeys('123abcABC');
      expect(kve.getInvalidInputs(editor).count()).toEqual(0);
    });

    it('should invalidate the entire form when invalid keys entered', function() {
      var editor = kve.find();
      var first = kve.getFirstKeyInput(editor);
      first.clear().sendKeys('# $ ( )');
      expect(kve.isFormInvalid(editor)).toEqual(true);
      // and set valid when cleared & valid keys sent
      first.clear().sendKeys('123abcABC');
      expect(kve.isFormValid(editor)).toEqual(true);
    });

    it('should show a help-block when an input is invalid', function() {
      var editor = kve.find();
      var first = kve.getFirstKeyInput(editor);
      first.clear().sendKeys('# $ ( )');
      var helpBlock = kve.getHelpBlock(editor);
      expect(helpBlock.first().getText()).toEqual('Please enter a valid key');
      expect(kve.getHelpIcon(editor).count()).toEqual(1);
      // and hide again when input is valid
      first.clear().sendKeys('abcABC123');
      expect(kve.getHelpBlock(editor).count()).toEqual(0);
    });

    it('should show a min-length validation message', function() {
      var editor = kve.find();
      var first = kve.getFirstKeyInput(editor);
      first.clear().sendKeys('ab');
      expect(kve.getKeyMinlengthHelp(editor).first().getText()).toEqual('Minimum character count is 3');
      expect(kve.isAnyHelpVisible(editor)).toBeTruthy();
      // and remove when minlength requirement met
      first.sendKeys('c');
      expect(kve.getKeyMinlengthHelp(editor).first().isDisplayed()).toBeFalsy();
      expect(kve.isAnyHelpVisible(editor)).toBeFalsy();
    });

    it('should limit input to maxlength', function() {
      var editor = kve.find();
      var first = kve.getFirstKeyInput(editor);
      first.clear().sendKeys('abcdefghijklmnopqrstuvwxyz12345');
      expect(first.getAttribute('value')).toEqual('abcdefghijklmnopqrstuvwxy');
      // max length does not/should not trigger a validation error
      expect(kve.isAnyHelpVisible(editor)).toBeFalsy();
    });

    it('should validate both key and value', function() {
      var editor = kve.find();
      var pair = kve.getFirstInputPair(editor);
      pair.forEach(function(input, i) {
        var searchText = (i === 0) ?
                          'Please enter a valid key' :
                          'Please enter a valid value';
        input.clear().sendKeys('# $ %').click();
        expect(kve.isAnyHelpVisible(editor)).toBeTruthy();
        expect(kve.getValidationText(editor,searchText).count()).toEqual(1);
        // ensure validation is gone when cleared
        input.clear().sendKeys('abcABC123');
        expect(kve.isAnyHelpVisible(editor)).toBeFalsy();
        expect(kve.getValidationText(editor, searchText).count()).toEqual(0);
      });
    });
  });
});
