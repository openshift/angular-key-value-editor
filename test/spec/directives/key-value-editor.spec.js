// 'use strict';
// // checking out tests here:
// // https://github.com/angular-ui/bootstrap/blob/master/src/tabs/test/tabs.spec.js
// describe('keyValueEditor', function() {
//   var scope;
//   var element;
//
//   beforeEach(module('key-value-editor'));
//
//   beforeEach(inject(function($rootScope, $compile) {
//     scope = $rootScope.$new();
//     element = angular.element('<key-value-editor entries="entries"></key-value-editor>');
//     $compile(element)(scope);
//     $('body').append(element);
//
//     // not recommended, let each suite setup its own scope & do first $appy() internally
//     // scope.entries = [];
//     // scope.$apply();
//   }));
//
//   afterEach(function() {
//     $('body').empty();
//   });
//
//   // describe('when given a list of zero entries', function() {
//   //   describe('without the add-row-link', function() {
//   //     it('should display 4 empty inputs', function() {
//   //       // reset the entries to empty list
//   //       // add new entries,
//   //       // then run an $apply()
//   //       // this will avoid triggering the auto-add
//   //       scope.entries = [];
//   //       scope.$apply();
//   //       var inputs = $('input:text');
//   //       expect(inputs.length).toEqual(4);
//   //     });
//   //   });
//   //
//   //   describe('with the add-row-link', function() {
//   //     it('should display two empty inputs so the user can add the first entry', function() {
//   //       scope.entries = [];
//   //       scope.addRowLink = true;
//   //       scope.$apply();
//   //       var inputs = $('input:text');
//   //       expect(inputs.length).toEqual(2);
//   //     });
//   //   });
//   // });
//
//
//   // describe('when given a list of one entry', function() {
//   //   it('should display the name and value of that entry', function() {
//   //     scope.entries.push({
//   //       name: 'foo',
//   //       value: 'bar'
//   //     });
//   //     scope.$apply();
//   //     var inputs = $('input:text');
//   //     expect(inputs.length).toEqual(12);
//   //     expect($('input:text').eq(0).val()).toEqual('foo');
//   //     expect($('input:text').eq(1).val()).toEqual('bar');
//   //   });
//   // });
//   //
//   // describe('when given a list of entries', function() {
//   //   it('should create one unique label for each unique input', function() {
//   //     var inputs = $('input');
//   //     var labels = [];
//   //     $.each(inputs, function(i, elem) {
//   //       labels.push($('label[for="' + elem.id + '"]'));
//   //     });
//   //     expect(inputs.length).toEqual(labels.length);
//   //   });
//   // });
//
// });
