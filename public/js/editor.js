$(document).ready(function() {

    window.stage = new Kinetic.Stage({
        container: 'container',
        width: window.stageWidth,
        height: window.stageHeight,
    });
    stage.add(new Kinetic.Layer());

    var top = 20;
    var left = 20;

    $('#container').css({
        top: top + 'px',
        left: left + 'px',
        width: window.stageWidth + 'px',
        height: window.stageHeight + 'px'
    });

    $('#info').css({
        top: (window.stageHeight + (top * 2)) + 'px',
        left: left + 'px',
        width: window.stageWidth + 'px'
    });

    $('#webvfx-collection').css({
        top: top + 'px',
        left: (window.stageWidth + (left * 2)) + 'px'}
    );

    $("#webvfx-collection").sortable({
        stop: function(event, ui) {
            var total = $('#webvfx-collection div').length - 1;
            var index = ui.item.index();
            ui.item.trigger('drop', total - index);
        }
    });

    var dropzone = $('#container');

    dropzone.on('dragover', function() {
        console.log('dragover');
        dropzone.addClass('hover');
        return false;
    });

    dropzone.on('dragleave', function() {
        console.log('dragleave');
        dropzone.removeClass('hover');
        return false;
    });

    dropzone.on('drop', function(e) {
        console.log('drop');
        e.stopPropagation();
        e.preventDefault();
        dropzone.removeClass('hover');
        var files = e.originalEvent.dataTransfer.files;
        processFiles(files);
        return false;
    });

    var processFiles = function(files) {
        if (files && typeof FileReader !== "undefined") {
            for(var i = 0; i < files.length; i++) {
                readFile(files[i]);
            }
        }
    };

    var readFile = function(file) {
        if( (/image/i).test(file.type) ) {
            var reader = new FileReader();
            reader.onload = function(e) {
                console.log('loaded ' + file.name);
                uploadImage(file);
                image = new Image();
                image.name = file.name;
                image.type = file.type;
                image.src = e.target.result;
                webvfxCollection.add(new WebvfxImage({image: image, name: file.name}));
            };
            reader.readAsDataURL(file);
        } else {
            alert('File format not supported');
        }
    };

    var uploadImage = function(file) {
        var formdata = new FormData();
        formdata.append('uploadedFile', file);
        $.ajax({
            url: 'uploadImage',
            type: 'POST',
            data: formdata,
            processData: false,
            contentType: false,
            success: function(res) {
                console.log('uploaded ' + file.name);
            }
        });
    };

    window.webvfxCollection = new WebvfxCollection();
    /*
    webvfxCollection.add(new WebvfxRect({name: '1', x: 20, y: 20, fill: 'red'}));
    webvfxCollection.add(new WebvfxRect({name: '2', x: 40, y: 40, fill: 'yellow'}));
    webvfxCollection.add(new WebvfxRect({name: '3', x: 60, y: 60, fill: 'blue'}));
    webvfxCollection.add(new WebvfxCircle({name: '4', x: 100, y: 100, fill: 'orange'}));
    webvfxCollection.add(new WebvfxRect({name: '5', fill: 'green'}));
    webvfxCollection.add(new WebvfxText({name: 'text1', text: 'hola mundo'}));
    */

    var webvfxCollectionView = new WebvfxCollectionView(webvfxCollection);

});

// vim: set foldmethod=indent foldlevel=1 foldnestmax=2 :
