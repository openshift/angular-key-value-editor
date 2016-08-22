'use strict';

describe('keyValueEditor single editor defaults', function() {
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

  describe('when given a list of zero entries', function() {
    it('generates 4 inputs, 2 to represent an empty first entry, and 2 to triggger the creation of new entries', function() {
      var inputs = $('input:text');
      expect(inputs.length).toEqual(4);
    });
  });

  describe('when given a list of one entries', function() {
    it('generates inputs for those entries', function() {
      scope.entries.push({
        name: 'foo',
        value: 'bar'
      });
      scope.$digest();
      var inputs = $('input:text');
      expect(inputs.length).toEqual(6);
    });
  });

  describe('when given a list of multiple entires', function() {
    it('generates 2 inputs for each entry added', function() {
      scope.entries = [{
        name: 'foo',
        value: 'bar'
      }, {
        name: 'baz',
        value: 'bam'
      }, {
        name: 'shizzle',
        value: 'pop'
      }];
      scope.$apply();
      var inputs = $('input:text');
      expect(inputs.length).toEqual(8);

    });
  });
});
