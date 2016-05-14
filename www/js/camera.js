var CameraController = function() {
    var cameraController = {
        self: null,
        initialize: function() {
            self = this;
            this.bindButton();
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
        openCamera: function() {
            self.pickPhoto('camera');
        },
        openGallery: function() {
            self.pickPhoto();
        },
        pickPhoto: function(sType) {
            var srcType = (sType != null && sType == 'camera') 
            ? Camera.PictureSourceType.CAMERA
            : Camera.PictureSourceType.SAVEDPHOTOALBUM;

            var options = self.setOptions(srcType);
            var func = self.submitPlate;

            navigator.camera.getPicture(function cameraSuccess(imageUri) {

                // self.displayImage(imageUri);
                func(imageUri);

            }, function cameraError(error) {
                console.debug('Unable to obtain picture: ' + error, 'app');

            }, options);
        }, 
        displayImage: function(imgUri) {

            var elem = document.getElementById('plate-img');
            elem.src = imgUri;
        },
        bindButton: function() {
            cameraBtn = document.querySelector('#camera-btn');
            galleryBtn = document.querySelector('#gallery-btn');
            cameraBtn.addEventListener('click', self.openCamera, false);
            galleryBtn.addEventListener('click', self.openGallery, false);
        },
        submitPlate: function(imgUri) {

            // Reset
            var $errorAlert = $('#error-alert');
            $errorAlert.text('').addClass('hidden');
            // Show loading indicator
            var $loading = $('#loading');
            $loading.removeClass('hidden');

            var options = new FileUploadOptions();
            options.fileKey = 'image';
            options.fileName = imgUri.substr(imgUri.lastIndexOf('/') + 1);
            var backend_url = document.getElementById('url').value || 'http://localhost/src/public/recognize';

            var ft = new FileTransfer();
            ft.upload(imgUri, encodeURI(backend_url), function success(result) {
                
                console.log(self.backend_url);
                self.bindPlateInfo(JSON.parse(result.response));
                $loading.addClass('hidden');

            }, function error(error) {
                
                console.log(error);
                $('#error-alert').text('Exception: ' + error.exception).removeClass('hidden');
                $loading.addClass('hidden');
                
            }, options);
        },
        bindPlateInfo: function(plate) {

            document.getElementById('plate-no').textContent = plate.plate_number;
            document.getElementById('name').textContent = plate.name;
            document.getElementById('matric-no').textContent = plate.matric_no;

        }
    }
    cameraController.initialize();
    return cameraController;
}
