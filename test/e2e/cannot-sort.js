'use strict';

var nav = require('./helpers/navigate.js');
var kve = require('./helpers/keyValueEditor.js');

beforeEach(function() {
  nav.goTo(nav.pages.cannotSort);
});

describe('key-value-editor cannot-sort', function() {
  it('should not be able to sort entries', function() {
    // the delete row link should not be rendered:
    expect(kve.getSortRowLink(kve.find()).count()).toEqual(0);
  });
});
