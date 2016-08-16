'use strict';

describe('keyValueEditor', function() {
  var scope;
  var element;

  beforeEach(module('key-value-editor'));

  beforeEach(inject(function($rootScope, $compile) {
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

  describe('when given a list of one entry', function() {
    it('should display the name and value of that entry', function() {
      scope.entries.push({
        name: 'foo',
        value: 'bar'
      });
      scope.$apply();
      expect($('input:text').eq(0).val()).toEqual('foo');
      expect($('input:text').eq(1).val()).toEqual('bar');
    });
  });


});
