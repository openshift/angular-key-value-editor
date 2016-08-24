'use strict';

var nav = require('./helpers/navigate.js');
var kve = require('./helpers/keyValueEditor.js');

beforeEach(function() {
  nav.goTo(nav.pages.cannotDelete);
});

describe('key-value-editor cannot-delete', function() {
  it('should not be able to delete entries', function() {
    // the delete row link should not be rendered:
    expect(kve.getDeleteRowLink(kve.find()).count()).toEqual(0);
  });
});
