'use strict';
exports.pages = {
  // prefix: /test/manual/
  singleDefault: '/test/manual/single-default.html',
  singleWithValidation: '/test/manual/single-with-validation.html',
  multipleWithValidation: '/test/manual/many-with-validation.html',
  cannotAdd: '/test/manual/cannot-add.html',
  cannotSort: '/test/manual/cannot-sort.html',
  cannotDelete: '/test/manual/cannot-delete.html',
  isReadonly: '/test/manual/is-readonly.html',
  keysOnly: '/test/manual/keys-only.html',
  allowEmptyKeys: '/test/manual/allow-empty-keys.html'
};

exports.goTo = function(uri, timeout /*, callback */) {
  browser
    .get(uri)
    .then(function() {
      browser
        .wait(function() {
            return browser
                    .getCurrentUrl()
                    .then(function(url) {
                       return url.indexOf(uri) > -1;
                    });
        }, timeout || 1000);
    });
};
