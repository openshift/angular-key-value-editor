'use strict';
// checking out tests here:
// https://github.com/angular-ui/bootstrap/blob/master/src/tabs/test/tabs.spec.js
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

  describe('when given a list of zero entries', function() {
    describe('without the add-row-link', function() {
      it('should display two empty inputs so the user can add the first entry', function() {
        scope.$apply();
        var inputs = $('input:text');
        expect(inputs.length).toEqual(2);
      });
    });
    describe('with the add-row-link', function() {
      it('should display two empty inputs so the user can add the first entry', function() {
        scope.addRowLink = true;
        scope.$apply();
        var inputs = $('input:text');
        expect(inputs.length).toEqual(2);
      });
    });
  });

  describe('when given a list of one entry', function() {
    it('should display the name and value of that entry', function() {
      scope.entries.push({
        name: 'foo',
        value: 'bar'
      });
      scope.$apply();
      var inputs = $('input:text');
      expect(inputs.length).toEqual(12);
      expect($('input:text').eq(0).val()).toEqual('foo');
      expect($('input:text').eq(1).val()).toEqual('bar');
    });
  });

  describe('when given a list of entries', function() {
    it('should create one unique label for each unique input', function() {
      var inputs = $('input');
      var labels = [];
      $.each(inputs, function(i, elem) {
        labels.push($('label[for="' + elem.id + '"]'));
      });
      expect(inputs.length).toEqual(labels.length);
    });
  });

});
