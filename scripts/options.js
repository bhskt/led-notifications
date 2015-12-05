/*global chrome*/
(function () {
    'use strict';
    var status = document.getElementById('status');
    navigator.webkitGetUserMedia({video: true}, function (stream) {
        if (stream.active) {
            stream.getTracks()[0].stop();
            status.classList.add('text-success');
            status.classList.remove('text-muted');
            status.innerText = 'Permission to Access Webcam : ALLOWED';
        }
    }, function () {
        status.classList.add('text-danger');
        status.classList.remove('text-muted');
        status.innerText = 'Permission to Access Webcam : DENIED';
    });
}());