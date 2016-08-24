'use strict';

describe('keyValueEditor add-row-link', function() {

  beforeEach(module('key-value-editor'));

  beforeEach(function() {
    setup();
  });

  afterEach(function() {
    tearDown();
  });

  var withoutAddRow = function() {
    elem = angular.element('<key-value-editor entries="entries"></key-value-editor>');
    scope.entries = [];
  };

  var withAddRow = function() {
    elem = angular.element('<key-value-editor entries="entries" add-row-link></key-value-editor>');
    scope.entries = [];
  };

  var withCustomAddRow = function() {
    elem = angular.element('<key-value-editor entries="entries" add-row-link="Add some stuff will ya"></key-value-editor>');
    scope.entries = [];
  };


  describe('without add-row-link attribute', function() {
    it('should display the default 4 inputs', function() {
      withoutAddRow();
      render();
      expect($('input:text').length).toEqual(4);
    });
  });

  describe('with add-row-link attribute', function() {
    it('does not display the extra set of inputs for triggering new rows', function() {
      withAddRow();
      render();
      var inputs = $('input:text');
      expect(inputs.length).toEqual(2);
    });

    it('does display an add-row-link', function() {
      withAddRow();
      render();
      var link = $('.add-row-link');
      expect(link.length).toEqual(1);
    });

    it('adds a new row when the add-row-link is clicked', function() {
      withAddRow();
      render();
      $('.add-row-link').click();
      expect($('input:text').length).toEqual(4);
    });

    it('should add rows multiple times', function() {
      withAddRow();
      render();
      var timesToClick = 10;
      _.times(timesToClick, function() {
        $('.add-row-link').click();
      });
      expect($('input:text').length).toEqual((timesToClick * 2) + 2);
    });
  });

  describe('with custom add-row-link attribute text', function() {
    it('should display the link with the custom text instead of the default', function() {
      withCustomAddRow();
      render();
      expect($('.add-row-link').text()).toEqual('Add some stuff will ya');
      expect($('.add-row-link').text()).not.toEqual('Add row');

    });
  });

  // todo: default text, configured text
});
