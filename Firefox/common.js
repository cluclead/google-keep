'use strict';

var {ToggleButton} = require('sdk/ui/button/toggle');
var tabs = require('sdk/tabs');
var panels = require('sdk/panel');
var self = require('sdk/self');
var sp = require('sdk/simple-prefs');
var {getActiveView} = require('sdk/view/core');
var timers = require('sdk/timers');
var {getActiveView} = require('sdk/view/core');
var Worker = require('sdk/content/worker').Worker;  // jshint ignore:line

var panel, button, browser;

button = new ToggleButton({
  id: self.name,
  label: 'Google™ Keep',
  icon: {
    '16': './icons/16.png',
    '32': './icons/32.png',
    '64': './icons/64.png'
  },
  onChange: state => state.checked && panel.show({
    position: button
  })
});

panel = panels.Panel({
  contentURL: self.data.url('./panel/index.html'),
  contentScriptFile: self.data.url('./panel/index.js'),
  width: 40,
  height: 500,
  onHide: () => button.state('window', {checked: false})
});
panel.port.on('open', (url) => {
  panel.hide();
  tabs.open(url);
});
panel.port.on('refresh', () => {
  browser.src = 'https://keep.google.com';
  browser.reload();
});
panel.port.on('pin', function (bol) {
  getActiveView(panel).setAttribute('noautohide', bol);
});

browser = (function (panelView) {
  // we use a safe browser element (type=content)
  let b = panelView.ownerDocument.createElement('browser');
  b.setAttribute('type', 'content');
  b.setAttribute('style', 'width: 660px;');
  panelView.appendChild(b);
  b.setAttribute('src', 'https://keep.google.com/');
  return b;
})(getActiveView(panel));

// FAQs page
exports.main = function (options) {
  if (options.loadReason === 'install' || options.loadReason === 'startup') {
    let version = sp.prefs.version;
    if (self.version !== version) {
      timers.setTimeout(function () {
        tabs.open(
          'http://add0n.com/google-keep.html?v=' + self.version +
          (version ? '&p=' + version + '&type=upgrade' : '&type=install')
        );
      }, 3000);
      sp.prefs.version = self.version;
    }
  }
};
