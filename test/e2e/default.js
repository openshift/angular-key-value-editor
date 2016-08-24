'use strict';

var nav = require('./helpers/navigate.js');
var kve = require('./helpers/keyValueEditor.js');

beforeEach(function() {
  nav.goTo(nav.pages.singleDefault);
});

// NOTE: this are basically the hello world tests
describe('key-value-editor default', function() {

  it('should render 4 empty inputs if given no data', function() {
    var editor = kve.find();
    expect(kve.getInputsCount(editor)).toEqual(4);
  });

  it('should create a new row if the first input in the last row is clicked', function() {
    var editor = kve.find();
    kve.clickLastKeyInput(editor);
    expect(kve.getInputsCount(editor)).toEqual(6);
  });

  it('should create a new row if the last input in the last row is clicked', function() {
    var editor = kve.find();
    kve.clickLastValueInput(editor);
    expect(kve.getInputsCount(editor)).toEqual(6);
  });

  it('should update a key for an entry when given input', function() {
    var editor = kve.find();
    var keyInputs = kve.getKeyInputs(editor);
    // should have 2 to start
    expect(keyInputs.count()).toEqual(2);
    var firstInput = keyInputs.get(0);
    firstInput.sendKeys('12345');
    expect(firstInput.getAttribute('value')).toEqual('12345');
  });

  // TODO: delete a row
});
