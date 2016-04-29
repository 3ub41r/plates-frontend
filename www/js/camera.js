var CameraController = function() {
    var cameraController = {
        self: null,
        initialize: function() {
            self = this;
            this.bindCamera();
        },
        setOptions: function(srcType) {
            var options = {
                // Some common settings are 20, 50, and 100
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                // In this app, dynamically set the picture source, Camera or photo gallery
                sourceType: srcType,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                allowEdit: true,
                correctOrientation: true  //Corrects Android orientation quirks
            }
            return options;
        },
        openCamera: function(selection) {

            // Uncomment either line to change the source for photo
            // var srcType = Camera.PictureSourceType.CAMERA;
            var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
            var options = self.setOptions(srcType);
            var func = self.submitPlate;

            if (selection == "camera-thmb") {
                options.targetHeight = 100;
                options.targetWidth = 100;
            }

            navigator.camera.getPicture(function cameraSuccess(imageUri) {

                self.displayImage(imageUri);
                // You may choose to copy the picture, save it somewhere, or upload.
                func(imageUri);

            }, function cameraError(error) {
                console.debug("Unable to obtain picture: " + error, "app");

            }, options);
        }, 
        displayImage: function(imgUri) {

            var elem = document.getElementById('plate-img');
            elem.src = imgUri;
        },
        bindCamera: function() {
            console.log('This is from bindCamera');
            cameraBtn = document.querySelector('#camera-btn');
            cameraBtn.addEventListener('click', self.openCamera, false);
        },
        submitPlate: function(imgUri) {
            var serverUrl = 'http://192.168.33.10/src/public/recognize';
            var options = new FileUploadOptions();
            options.fileKey = 'image';
            options.fileName = imgUri.substr(imgUri.lastIndexOf('/') + 1);
            // options.mimeType = 'text/plain';

            var ft = new FileTransfer();
            ft.upload(imgUri, encodeURI(serverUrl), function fileUploadSuccess(result) {
                console.log(result);
            }, function fileUploadSuccess(error) {
                console.log('An error occured when sending the plate: ');
                console.log(error);
            }, options);
        },
        createNewFileEntry: function(imgUri) {
            window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function success(dirEntry) {

                // JPEG file
                dirEntry.getFile("tempFile.jpeg", { create: true, exclusive: false }, function (fileEntry) {

                    // Do something with it, like write to it, upload it, etc.
                    // writeFile(fileEntry, imgUri);
                    console.log("got file: " + fileEntry.fullPath);
                    // displayFileData(fileEntry.fullPath, "File copied to");

                }, onErrorCreateFile);

            }, onErrorResolveUrl);
        }
    }
    cameraController.initialize();
    return cameraController;
}
