/**
 * Created with JetBrains PhpStorm.
 * User: ericlin
 * Date: 29/06/14
 * Time: 3:19 PM
 * To change this template use File | Settings | File Templates.
 */


var app = angular.module('privateStuffApp', ['ngRoute']);

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
            templateUrl : '../pages/note.html',
            controller : 'noteCtrl'
        })
        .otherwise({ redirectTo: '/' });
    // use the HTML5 History API
    $locationProvider.html5Mode(true);
});

app.controller('homeCtrl', function ($scope, $http) {
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
            $scope.noteLink = 'http://test.example.com/#note/' + data.uniq_id + '/' + data.key;
        });
        responsePromise.error(function(data, status, headers, config) {
            alert("AJAX failed!");
        });
    };
});


app.controller('aboutCtrl', function($scope) {
    $scope.message = 'Look! I am an about page.';
});

app.controller('contactCtrl', function($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});

app.controller('noteCtrl', function($scope, $http, $routeParams) {
    $http.get("/api/note/" + $routeParams.id + '/' + $routeParams.key)
        .success(function(data) {
            $scope.note = data.data;
        });
});