'use strict';

// var ngScopeElem = function() {
//   //return element.all(by.css('.ng-scope')).get(0);
//   return browser.executeScript(function() {
//     return angular.element(document.querySelectorAll('.ng-scope')[0]);
//   });
// };
//
// var $injector = function() {
//   return ngScopeElem()
//           .then(function(elem) {
//             return elem.injector();
//           });
// };
//
// var $rootElement = function() {
//   return $injector()
//           .then(function(inj) {
//             return ing.get('$rootElement');
//           });
// };
//
// var $rootScope = function() {
//   return $injector()
//           .then(function(inj) {
//             return inj.get('$rootScope');
//           });
// };
//
// var $digest = function() {
//   return browser.executeScript(function() {
//     return angular
//             .element(document
//                       .querySelector('.ng-scope'))
//             .injector()
//               .get('$rootScope')
//               .$digest();
//   });
// };
//
//
// this doesn't quite work yet, $digest() will fail on:
//  Failed: root.$digest is not a function
// module.exports = {
//   rootElement: rootElement,
//   $injector: $injector,
//   $rootElement: $rootElement,
//   $rootScope: $rootScope,
//   $digest: $digest
// };
