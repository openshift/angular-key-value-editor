'use strict';

describe('keyValueEditor add-row-link', function() {
  var scope;
  var element;

  beforeEach(module('key-value-editor'));

  beforeEach(inject(function($rootScope, $compile) {
    // setup model
    scope = $rootScope.$new();
    scope.entries = [];
    element = angular.element('<key-value-editor entries="entries"></key-value-editor>');
    $compile(element)(scope);
    $('body').append(element);
    scope.$apply();
  }));

  afterEach(function() {
    $('body').empty();
  });

  describe('when...', function() {
    it('does...', function() {
      expect(true).toEqual(true);
    });
  });
});
