/*global chrome, MutationObserver*/
(function () {
    'use strict';
    var blinkerRunning = false;
    var port = chrome.runtime.connect('nbfcghbcclkigeelkacgogjigjoaammc');
    function checkTitle() {
        var match = document.title.match(/\(([0-9]+)\)/m);
        if (match && parseInt(match[1]) > 0 && parseInt(match[1]) < 100) {
            if (!blinkerRunning) {
                blinkerRunning = true;
                port.postMessage(true);
            }
        } else {
            if (blinkerRunning) {
                blinkerRunning = false;
                port.postMessage(false);
            }
        }
        setTimeout(checkTitle, 500);
    }
    checkTitle();
}());