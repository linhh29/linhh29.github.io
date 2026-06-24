(function () {
  'use strict';

  var host = window.location.hostname;
  var canonical = 'hehailin.life';
  var legacyHosts = ['linhh29.github.io', 'www.linhh29.github.io'];

  if (legacyHosts.indexOf(host) !== -1 || host === 'www.' + canonical) {
    window.location.replace(
      'https://' + canonical + window.location.pathname + window.location.search + window.location.hash
    );
  }
})();
