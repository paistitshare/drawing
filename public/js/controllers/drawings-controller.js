$(document).ready(function () {

    $('#refresh').bind("DOMSubtreeModified", function () {
        $('img', refresh).draggable({
            helper: 'clone'
        });
    });

});

angular.module('pw.canvas-painter').controller('CanvasController', function ($scope, $http, $interval, $window) {

    angular.element(document).ready(function () {
        var canvas = document.getElementById("myCanvas"),
            ctx = canvas.getContext("2d"),
            $canvas = $("#myCanvas"),
            canvasOffset = $canvas.offset(),
            offsetX = canvasOffset.left,
            offsetY = canvasOffset.top,
            $image = $("img");

        $image.draggable({
            helper: 'clone'
        });

        $canvas.droppable({
            drop: function dragDrop(e, ui) {
                var element = ui.draggable,
                    data = element.data("url"),
                    x = parseInt(ui.offset.left - offsetX),
                    y = parseInt(ui.offset.top - offsetY),
                    img = new Image();
                // img.setAttribute('crossOrigin', 'anonymous');
                img.src = element[0].currentSrc;
                ctx.drawImage(img, x - 1, y, 100, 100);
            }
        });

    });

    $window.onload = function () {
        var c = document.getElementById("myCanvas"),
            ctx = c.getContext("2d");
        $http({
            method: 'POST',
            data: {username: $('#username').text()},
            url: '/workflow'
        }).then(function (result) {
            var img = new Image();
            img.crossOrigin = "Anonymous";
            if(typeof result.data !== "undefined") {
                console.log('ex');
                img.src = result.data;
                ctx.drawImage(img, 0, 0);
            }
        }).catch(function (e) {
            throw (e);
        });
    };

    this.undo = function () {
        this.version--;
    };

    this.clear = function () {
        var canvas = document.getElementById("myCanvas"),
            ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    this.saveAsImage = function () {
        this.href = document.getElementById("myCanvas").toDataURL();
        this.download = 'canvas.png';
    };

    this.save = function () {
        var canvas = document.getElementById('myCanvas');
        dataURL = canvas.toDataURL();
        $http({
            method: 'POST',
            data: {workflow: dataURL},
            url: '/save'
        }).then(function successCallback(response) {
        }, function errorCallback(response) {
        });
    };
    $interval(callAtInterval, 10000);
    var k = 1;

    function callAtInterval() {
        /*var canvas = document.getElementById('myCanvas');
         localStorage.setItem('lastWorkflow', canvas.toDataURL());
         console.log("Timeout occurred for" + localStorage.getItem('lastWorkflow'));
         console.clear();*/
        var canvas = document.getElementById('myCanvas');
        var dataURL = canvas.toDataURL();
        $http({
            method: 'POST',
            data: {workflow: dataURL},
            url: '/save'
        }).then(function (response) {
            // console.clear();
            // console.log('saved ' + k++);
        }, function errorCallback(response) {
        });
    }
});