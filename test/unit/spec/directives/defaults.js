'use strict';
// checking out tests here:
// https://github.com/angular-ui/bootstrap/blob/master/src/tabs/test/tabs.spec.js
describe('keyValueEditor default', function() {

  beforeEach(module('key-value-editor'));

  beforeEach(function() {
    setup();
  });

  afterEach(function() {
    tearDown();
  });

  var withDefaults = function() {
    elem = angular.element('<key-value-editor entries="entries"></key-value-editor>');
  };

  describe('when given a list of one entry', function() {
    it('should display the name and value of that entry', function() {
      withDefaults();
      scope.entries = [{
        name: 'foo',
        value: 'bar'
      }];
      render();
      scope.$apply();
      var inputs = $('input:text');
      expect(inputs.eq(0).val()).toEqual('foo');
      expect(inputs.eq(1).val()).toEqual('bar');
    });
  });

  describe('when given a list of entries', function() {
    it('should create one unique label for each unique input', function() {
      withDefaults();
      scope.entries = [{
        name: 'foo',
        value: 'bar'
      }, {
        name: 'bar',
        value: 'baz'
      }, {
        name: 'last',
        value: 'one'
      }];
      render();
      var inputs = $('input');
      var labels = [];
      $.each(inputs, function(i, elem) {
        labels.push($('label[for="' + elem.id + '"]'));
      });
      expect(inputs.length).toEqual(labels.length);
    });
  });

});
