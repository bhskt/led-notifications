/*global chrome*/
(function () {
    'use strict';
    var urls = new Set();
    function blink(duration) {
        navigator.webkitGetUserMedia({video: true}, function (stream) {
            setTimeout(function () {
                if (stream.active) {
                    stream.getTracks()[0].stop();
                    if (urls.size) {
                        setTimeout(function () {
                            blink(duration);
                        }, duration / 2);
                    }
                }
            }, duration);
        }, function (error) {
            console.error(error);
        });
    }
    function checkBlink() {
        if (urls.size) {
            blink(1000);
        }
    }
    chrome.runtime.onConnectExternal.addListener(function (port) {
        port.onMessage.addListener(function (start) {
            if (start) {
                urls.add(port.sender.url);
            } else {
                urls.delete(port.sender.url);
            }
            checkBlink();
        });
        port.onDisconnect.addListener(function () {
            urls.delete(port.sender.url);
            checkBlink();
        });
    });
}());