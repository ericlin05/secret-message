/**
 * Created with JetBrains PhpStorm.
 * User: ericlin
 * Date: 29/06/14
 * Time: 3:19 PM
 * To change this template use File | Settings | File Templates.
 */
var app = angular.module('privateStuffApp', ['ngRoute', 'angularFileUpload', 'ngDialog']);
var baseUrl = 'http://test.example.com';

app.config(function($routeProvider, $locationProvider) {
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
            controller : 'fileCtrl'
        })
        .otherwise({ redirectTo: '/' });
    // use the HTML5 History API
    $locationProvider.html5Mode(true);
});

app.controller('homeCtrl', function ($scope, $http) {
    $scope.test = 'home';
});


app.controller('aboutCtrl', function($scope) {
    $scope.test = 'about';
    $scope.message = 'Look! I am an about page.';
});

app.controller('contactCtrl', function($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});

app.controller('fileCtrl', function($scope, $upload) {
    $scope.loadingShow = false;
    $scope.messageImageShow = false;
    $scope.imageLink = '';
    $scope.imageUploadShow = true;

    $scope.onFileSelect = function($files) {
        $scope.loadingShow = true;
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            $scope.upload = $upload.upload({
                url: '/api/image', //upload.php script, node.js route, or servlet url
                method: 'POST',
                // headers: {'header-key': 'header-value'},
                // withCredentials: true,
                data: {test: 1},
                file: file // or list of files: $files for html5 only
                /* set the file formData name ('Content-Desposition'). Default is 'file' */
                //fileFormDataName: myFile, //or a list of names for multiple files (html5).
                /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
                //formDataAppender: function(formData, key, val){}
            }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log(data);
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
});

app.controller('noteCreateCtrl', function ($scope, $http) {
    $scope.data = {};
    $scope.noteLink = '';
    $scope.noteFormShow = true;
    $scope.messageNoteShow = false;
    $scope.loadingShow = false;

    $scope.submitNote = function(item, event) {
        $scope.loadingShow = true;
        $scope.noteFormShow = false;
        var responsePromise = $http.post("/api/note", $("#my_test").val());
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
});

app.controller('noteViewCtrl', function($scope, $http, $routeParams) {
    $scope.showDestroyed = false;
    $scope.showNote = false;

    $http.get("/api/note/" + $routeParams.id + '/' + $routeParams.key)
        .success(function(data) {
            $scope.showDestroyed = data.status == 'destroyed';
            $scope.showNote = data.status != 'destroyed';
            $scope.note = data.data;
        });
});

app.controller('imageViewCtrl', function($scope, $http, $routeParams, ngDialog) {
    $scope.imageSrc = '/api/image/' + $routeParams.id + '/' + $routeParams.key;

    ngDialog.open({
        template: 'pages/image-dialog.html',
        className: 'ngdialog-theme-plain',
        scope: $scope
    });
});

app.controller('navCtrl', function($scope, $location) {
    $scope.isCurrentPath = function (path) {
        return $location.path() == path;
    };
});