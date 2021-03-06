/**
 * Created with JetBrains PhpStorm.
 * User: ericlin
 * Date: 29/06/14
 * Time: 3:19 PM
 * To change this template use File | Settings | File Templates.
 */
var app = angular.module('privateStuffApp', ['ngRoute', 'angularFileUpload', 'ngDialog']);
var baseUrl = 'http://dev.secretify.com';

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl : '../pages/home.html',
            controller : 'homeCtrl'
        })
        .when('/about', {
            templateUrl : '../pages/about.html',
            controller : 'aboutCtrl'
        })
        .when('/contact', {
            templateUrl : '../pages/contact.html',
            controller : 'contactCtrl'
        })
        .when('/note/:id/:key', {
            templateUrl : '../pages/note-view.html',
            controller : 'noteViewCtrl'
        })
        .when('/note', {
            templateUrl : '../pages/note-create.html',
            controller : 'noteCreateCtrl'
        })
        .when('/image/:id/:key', {
            templateUrl : '../pages/image-view.html',
            controller : 'imageViewCtrl'
        })
        .when('/image', {
            templateUrl : '../pages/image-upload.html',
            controller : 'imageUploadCtrl'
        })
        .when('/faq', {
            templateUrl : '../pages/faq.html',
            controller : 'faqCtrl'
        })
        .when('/privacy-policy', {
            templateUrl : '../pages/privacy-policy.html',
            controller : 'privacyPolicyCtrl'
        })
        .otherwise({ redirectTo: '/' });
    // use the HTML5 History API
    $locationProvider.html5Mode(true);
}]);

app.controller('homeCtrl', ['$scope', function ($scope) {
    $scope.test = 'home';
}]);


app.controller('aboutCtrl', ['$scope', function($scope) {
    $scope.test = 'about';
    $scope.message = 'Look! I am an about page.';
}]);

app.controller('contactCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.formShow = true;
    $scope.successShow = false;
    $scope.loadingShow = false;
    $scope.errorShow = false;

    var defaultErrorMessage = "We are unable to process your request at this time, please try again later!";

    $scope.submit = function(item, event) {
        $scope.loadingShow = true;
        var responsePromise = $http.post(
            "/api/contact",
            {
                message:    $("#message").val(),
                email:      $("#email").val(),
                first_name: $('#first_name').val(),
                last_name:  $('#last_name').val()
            }
        );
        responsePromise.success(function(data, status, headers, config) {
            if(status == 201) {
                $scope.formShow = false;
                $scope.successShow = true;
            } else {
                $scope.errorShow = true;
                $('#error-message').html(data.message ? data.message : defaultErrorMessage);
            }
            $scope.loadingShow = false;
        });

        responsePromise.error(function(data, status, headers, config) {
            $scope.loadingShow = false;
            $scope.errorShow = true;
            $('#error-message').html(defaultErrorMessage);
        });
    };
}]);

app.controller('imageUploadCtrl', ['$scope', '$upload', function($scope, $upload) {
    $scope.loadingShow = false;
    $scope.messageImageShow = false;
    $scope.imageLink = '';
    $scope.imageUploadShow = true;
    $scope.disableSubmit = true;

    $scope.onFileSelect = function($files) {
        $scope.files = $files;
        $scope.disableSubmit = $files.length == 0;
    };

    $scope.uploadFiles = function() {
        $scope.loadingShow = true;
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $scope.files.length; i++) {
            var file = $scope.files[i];
            $scope.upload = $upload.upload({
                url: '/api/image', //upload.php script, node.js route, or servlet url
                method: 'POST',
                // headers: {'header-key': 'header-value'},
                // withCredentials: true,
                data: {
                    email:      $('#email').val(),
                    reference:  $('#reference').val()
                },
                file: file // or list of files: $files for html5 only
                /* set the file formData name ('Content-Desposition'). Default is 'file' */
                //fileFormDataName: myFile, //or a list of names for multiple files (html5).
                /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
                //formDataAppender: function(formData, key, val){}
            }).progress(function(evt) {
                    var percentage = parseInt(100.0 * evt.loaded / evt.total).toString() + '%';
                    $('#progress-bar').width(percentage);
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    $scope.loadingShow = false;
                    $scope.messageImageShow = true;
                    $scope.imageUploadShow = false;
                    $scope.imageLink = baseUrl + '/image/' + data.uniq_id + '/' + data.key;;
                });
            //.error(...)
            //.then(success, error, progress);
            //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
        }
        /* alternative way of uploading, send the file binary with the file's content-type.
         Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed.
         It could also be used to monitor the progress of a normal http post/put request with large data*/
        // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
    };
}]);

app.controller('noteCreateCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.data = {};
    $scope.noteLink = '';
    $scope.noteFormShow = true;
    $scope.messageNoteShow = false;
    $scope.loadingShow = false;
    $scope.submitDisabled = $('#note-message').val().length == 0;

    $scope.onKeyUp = function() {
        $scope.submitDisabled = $('#note-message').val().length == 0;
    };

    $scope.submitNote = function(item, event) {
        $scope.loadingShow = true;
        $scope.noteFormShow = false;
        var responsePromise = $http.post(
            "/api/note",
            {
                message:    $("#note-message").val(),
                email:      $("#email").val(),
                reference:  $('#reference').val()
            }
        );
        responsePromise.success(function(data, status, headers, config) {
            $scope.noteFormShow = false;
            $scope.messageNoteShow = true;
            $scope.loadingShow = false;
            $scope.noteLink = baseUrl + '/note/' + data.uniq_id + '/' + data.key;
        });
        responsePromise.error(function(data, status, headers, config) {
            alert("AJAX failed!");
        });
    };
}]);

app.controller('noteViewCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    $scope.showDestroyed = false;
    $scope.showNote = false;

    $http.get("/api/note/" + $routeParams.id + '/' + $routeParams.key)
        .success(function(data) {
            $scope.showDestroyed = data.status == 'destroyed';
            $scope.showNote = data.status != 'destroyed';
            $scope.note = data.data;
        });
}]);

app.controller('imageViewCtrl', ['$scope', '$http', '$routeParams', 'ngDialog', function($scope, $http, $routeParams, ngDialog) {
    $scope.imageDestroyedMessage = false;
    $scope.imageSrc = '';

    $http.get("/api/image/" + $routeParams.id + '/' + $routeParams.key)
        .success(function(data) {
            var width = $(window).width() < data.width ? $(window).width() - 50 : data.width;

            if(data.destroyed) {
                $scope.imageDestroyedMessage = true;
            } else {
                $scope.imageSrc = '/api/image/' + $routeParams.id + '/' + $routeParams.key + '/' + width;

                ngDialog.open({
                    template: 'pages/image-dialog.html',
                    className: 'ngdialog-theme-plain',
                    scope: $scope
                });

                $scope.$on('ngDialog.opened', function (e, $dialog) {
                    $('.ngdialog-content').width(width + 'px');
                });
            }
        });
}]);

app.controller('navCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.isCurrentPath = function (path) {
        return $location.path() == path;
    };
}]);

app.controller('notifyCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.notifyBtnShow = true;
    $scope.notifyFormShow = false;

    $scope.showNotifyForm = function() {
        $scope.notifyBtnShow = false;
        $scope.notifyFormShow = true;
    }
}]);

app.controller('faqCtrl', ['$scope', function($scope) {

}]);

app.controller('privacyPolicyCtrl', ['$scope', function($scope) {

}]);
