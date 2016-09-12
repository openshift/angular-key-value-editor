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

  var withSomeReadonlyKeys = function() {
    elem = angular.element('<key-value-editor entries="entries" is-readonly="[\'foo\']" cannot-delete="[\'foo\']"></key-value-editor>');
  };

  describe('setup', function() {
    it('should generate a unique id to use for each input', function() {
      withDefaults();
      standardEntries();
      render();
      scope.$apply();
      var isolate = elem.isolateScope();
      expect(isolate.unique).toEqual(1000); // starts with 1000, increments by 1
    });

    it('should generate a set-focus class for the key', function() {
      withDefaults();
      standardEntries();
      render();
      scope.$apply();
      var isolate = elem.isolateScope();
      expect(isolate.setFocusKeyClass).toEqual('key-value-editor-set-focus-key-1000');
    });


    it('should generate a set-focus class for the value', function() {
      withDefaults();
      standardEntries();
      render();
      scope.$apply();
      var isolate = elem.isolateScope();
      expect(isolate.setFocusValClass).toEqual('key-value-editor-set-focus-value-1000');
    });


    it('should generate a named form', function() {
      withDefaults();
      standardEntries();
      render();
      scope.$apply();
      var isolate = elem.isolateScope();
      expect(isolate.forms.keyValueEditor).toBeDefined();
    });

  });

  // this only tests the $scope function, consult e2e tests to validate UI
  describe('when given a list of readonly keys', function() {
    it('should treat those keys as readonly', function() {
      withSomeReadonlyKeys();
      scope.entries = [{
        name: 'foo',
        value: 'bar'
      }, {
        name: 'bar',
        value: 'baz'
      }];
      render();
      scope.$apply();
      var isolate = elem.isolateScope();
      expect(isolate.isReadonlySome('foo')).toEqual(true);
      expect(isolate.isReadonlySome('bar')).toEqual(false);
    });
  });

  describe('when given a list of undeletable keys', function() {
    it('should treat those keys as undeletable', function() {
      withSomeReadonlyKeys();
      scope.entries = [{
        name: 'foo',
        value: 'bar'
      }, {
        name: 'bar',
        value: 'baz'
      }];
      render();
      scope.$apply();
      var isolate = elem.isolateScope();
      expect(isolate.cannotDeleteSome('foo')).toEqual(true);
      expect(isolate.cannotDeleteSome('bar')).toEqual(false);
    });
  });



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

  describe('when the delete entry button is clicked', function() {
    it('should delete the corresponding entry by index', function() {
      withDefaults();
      standardEntries();
      render();
      scope.$apply();
      var isolate = elem.isolateScope();
      isolate.deleteEntry(1, 1);
      expect(angular.copy(isolate.entries)).toEqual([{
        name: 'DB_USER',
        value: 'user12345'
      },{
        name: 'DB_SERVER',
        value: 'foo.com'
      }]);
    });
  });

});
