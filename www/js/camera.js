var CameraController = function() {
    const BACKEND_URL = 'http://192.168.43.89/src/public/recognize';
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

            if (selection == 'camera-thmb') {
                options.targetHeight = 100;
                options.targetWidth = 100;
            }

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
        bindCamera: function() {
            console.log('This is from bindCamera');
            cameraBtn = document.querySelector('#camera-btn');
            cameraBtn.addEventListener('click', self.openCamera, false);
        },
        submitPlate: function(imgUri) {
            // var serverUrl = 'http://192.168.33.10/src/public/recognize';
            var options = new FileUploadOptions();
            options.fileKey = 'image';
            options.fileName = imgUri.substr(imgUri.lastIndexOf('/') + 1);
            // options.mimeType = 'text/plain';

            var ft = new FileTransfer();
            ft.upload(imgUri, encodeURI(BACKEND_URL), function fileUploadSuccess(result) {
                console.log(result);
                self.bindPlateInfo(JSON.parse(result.response));

            }, function fileUploadSuccess(error) {
                console.log('An error occured when sending the plate: ');
                console.log(error);
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
