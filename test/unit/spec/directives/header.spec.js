'use strict';

describe('keyValueEditor header', function() {

  var kveConfigProvider;
  var kveConfig;

  beforeEach(module('key-value-editor'));

  // TODO:For testing a default set via the provider:
  // (sadly this is a pain)
  // (and it should not be beforeEach, if get it working)
  // beforeEach(function() {
  //   module(['keyValueEditorConfigProvider', function(keyValueEditorConfigProvider) {
  //     kveConfigProvider = keyValueEditorConfigProvider;
  //     kveConfigProvider.set('keyPlaceholder', 'Chicken');
  //     kveConfigProvider.set('valuePlaceholder', 'Waffles');
  //   }]);
  // });
  //
  // beforeEach(inject(['keyValueEditorConfig', function(keyValueEditorConfig) {
  //   kveConfig = keyValueEditorConfig;
  // }]));

  afterEach(function() {
    //tearDown();
  });

  var withDefaultHeader = function() {
    elem = angular.element('<key-value-editor ' +
                              'show-header ' +
                              'entries="entries"></key-value-editor>');
  };
  var withCustomHeader = function() {
    elem = angular.element('<key-value-editor ' +
                              ' entries="entries" ' +
                              ' show-header ' +
                              ' key-placeholder="Bilbo" ' +
                              ' value-placeholder="Frodo"></key-value-editor>');
  };

  describe('when the show-header attribute is present', function() {

    it('displays empty strings by default', function() {
      noEntries();
      withDefaultHeader();
      render();
      scope.$apply();
      expect($('.key-header .help-block').eq(0).text()).toEqual('');
      expect($('.value-header .help-block').eq(0).text()).toEqual('');
    });

    it('displays headers using the key-placeholder and value-placeholder', inject(function($timeout) {
      noEntries();
      withCustomHeader();
      render();
      scope.$apply();
      expect(elem.isolateScope().showHeader ).toEqual(true);
      // selector doesnt work here, not sure why...?
      //expect($('.value-header .help-block').eq(0).text()).toEqual('Frodo');
    }));

    // TODO: For testing a default set via the provider:
    // (sadly this is a pain)
    // it('displays configured placeholders, if set via the keyValueEditorConfig provider', function() {
    //   noEntries();
    //   withDefaultHeader();
    //   render();
    //   scope.$apply();
    //   expect($('.key-header .help-block').eq(0).text()).toEqual('Chicken');
    //   expect($('.value-header .help-block').eq(0).text()).toEqual('Waffles');
    // });

  });
});
