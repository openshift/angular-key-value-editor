'use strict';

var nav = require('./helpers/navigate.js');
var kve = require('./helpers/keyValueEditor.js');

beforeEach(function() {
  nav.goTo(nav.pages.isReadonly);
});

describe('key-value-editor is-readonly', function() {
  it('should not be able to edit any inputs', function() {
    var editor = kve.find();
    var inputs = kve.getInputs(editor);
    var readonly = kve.getReadonlyInputs(editor);
    expect(inputs.count()).toEqual(readonly.count());
  });
});
