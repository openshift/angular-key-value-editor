'use strict';

describe('keyValueEditor add-row-link', function() {
  var scope;
  var element;

  beforeEach(module('key-value-editor'));

  beforeEach(inject(function($rootScope, $compile) {
    // setup model
    scope = $rootScope.$new();
    scope.entries = [];
    // this is rather annoying, requiring fussy test setup.
    // i dont want to have to $scope.$watch() every attrib tho.
    // this might only be relevant for those that are boolean based on existence?
    // ie, there is no add-row-link="true" or add-row-link="false"
    // however, this still seems irritating
    // scope.addRowLink = true; <-- doesnt work, HAS to be an attribute -|
    //                                                                   |
    //                                                                   \/
    element = angular.element('<key-value-editor entries="entries" add-row-link></key-value-editor>');
    $compile(element)(scope);
    $('body').append(element);
    scope.$apply();
  }));

  // afterEach(function() {
  //   $('body').empty();
  // });

  describe('when the add-row-link attribute is present', function() {
    it('should create two inputs', function() {
      var inputs = $('input:text');
      expect(inputs.length).toEqual(2);
    });
  });
});
