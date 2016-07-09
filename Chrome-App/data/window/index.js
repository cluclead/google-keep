'use strict';

var webview = document.querySelector('webview');

webview.setAttribute('src', 'https://keep.google.com/');

document.addEventListener('click', function (e) {
  let cmd = e.target.dataset.cmd;
  if (cmd === 'refresh') {
    webview.setAttribute('src', 'about:blank');
    webview.setAttribute('src', 'https://keep.google.com/');
  }
  else {
    chrome.runtime.sendMessage({
      method: cmd,
      data: e.target.dataset.value
    });
  }
});
