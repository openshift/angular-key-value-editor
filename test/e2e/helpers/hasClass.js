'use strict';

// insulates from partial class matches.
// ie, <div class="incorrect">
// hasClass('correct') will not match 'incorrect'
exports.hasClass = function(elem, className) {
  return element
          .getAttribute('class')
          .then(function(allClasses) {
            return allClasses
                    .split(' ')
                    .indexOf(className) !== -1;
          });
};
