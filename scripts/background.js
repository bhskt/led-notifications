/*global chrome*/
(function () {
    'use strict';
    var urls = new Set();
    var frequencyMap = {slow: 2, medium: 1, fast: 0.5};
    var frequency = 'medium';
    function blink(duration) {
        navigator.webkitGetUserMedia({video: true}, function (stream) {
            setTimeout(function () {
                if (stream.active) {
                    stream.getTracks()[0].stop();
                    setTimeout(function () {
                        if (urls.size) {
                            blink(1000 * frequencyMap[frequency]);
                        }
                    }, duration / 2);
                }
            }, duration);
        }, function (error) {
            console.error(error);
        });
    }
    chrome.runtime.onInstalled.addListener(function () {
        chrome.storage.sync.set({frequency: frequency});
        chrome.runtime.openOptionsPage();
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (tab) {
                chrome.tabs.reload(tab.id);
            });
        });
    });
    chrome.storage.onChanged.addListener(function (change) {
        if (change.frequency) {
            frequency = change.frequency.newValue;
        }
    });
    chrome.runtime.onConnect.addListener(function (port) {
        port.onMessage.addListener(function (start) {
            if (start) {
                if (!urls.size) {
                    blink(1000 * frequencyMap[frequency]);
                }
                urls.add(port.sender.url);
            } else {
                urls.delete(port.sender.url);
            }
        });
        port.onDisconnect.addListener(function () {
            urls.delete(port.sender.url);
        });
    });
}());