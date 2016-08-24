(function() {
  'use strict';

  // quick hack getting demo up and running
  angular
    .module('demo', [
      'key-value-editor'
    ])
    .config([
      'keyValueEditorConfigProvider',
      function(keyValueEditorConfigProvider) {
        // set a global value here:
        keyValueEditorConfigProvider.set('keyValidator----', '[0-9]+');
      }
    ]);
})();
