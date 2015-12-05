/*global chrome*/
(function () {
    'use strict';
    document.addEventListener('DOMContentLoaded', function () {
        var status = document.getElementById('status');
        navigator.webkitGetUserMedia({video: true}, function (stream) {
            if (stream.active) {
                stream.getTracks()[0].stop();
                status.classList.add('success');
                status.innerText = 'OK';
            }
        }, function () {
            status.classList.add('danger');
            status.innerText = 'Error';
        });
        document.getElementById('permission').onclick = function () {
            chrome.runtime.openOptionsPage();
        };
        chrome.storage.sync.get('frequency', function (storage) {
            document.getElementById(storage.frequency).classList.remove('btn-default');
            document.getElementById(storage.frequency).classList.add('btn-primary');
        });
        chrome.storage.onChanged.addListener(function (change) {
            if (change.frequency) {
                document.getElementById('slow').classList.remove('btn-primary');
                document.getElementById('slow').classList.add('btn-default');
                document.getElementById('medium').classList.remove('btn-primary');
                document.getElementById('medium').classList.add('btn-default');
                document.getElementById('fast').classList.remove('btn-primary');
                document.getElementById('fast').classList.add('btn-default');
                document.getElementById(change.frequency.newValue).classList.remove('btn-default');
                document.getElementById(change.frequency.newValue).classList.add('btn-primary');
            }
        });
        document.getElementById('slow').onclick = function () {
            chrome.storage.sync.set({frequency: 'slow'});
        };
        document.getElementById('medium').onclick = function () {
            chrome.storage.sync.set({frequency: 'medium'});
        };
        document.getElementById('fast').onclick = function () {
            chrome.storage.sync.set({frequency: 'fast'});
        };
    });
}());