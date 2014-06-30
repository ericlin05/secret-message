/**
 * Created with JetBrains PhpStorm.
 * User: ericlin
 * Date: 29/06/14
 * Time: 3:19 PM
 * To change this template use File | Settings | File Templates.
 */


var privateStuffApp = angular.module('privateStuffApp', []);

privateStuffApp.controller('homeCtrl', function ($scope, $http) {
    $scope.data = {};
    $scope.noteFormShow = true;
    $scope.messageNoteShow = false;
    $scope.noteLink = '';
    $scope.noteLink = 'asdf';

    $scope.menu = {
        home    : true,
        file    : false,
        contact : false,
        about   : false
    };

    $scope.menuClick = function(menu) {
        for(x in $scope.menu) {
            if(x == menu) {
                $scope.menu[menu] = true;
            } else {
                $scope.menu[x] = false;
            }
        }
    };

    $scope.submitNote = function(item, event) {
        var responsePromise = $http.post("/note", $("#my_test").val());
        responsePromise.success(function(data, status, headers, config) {
            $scope.noteFormShow = false;
            $scope.messageNoteShow = true;
            $scope.noteLink = 'http://test.example.com/note/' + data.uniq_id + '/' + data.key;
        });
        responsePromise.error(function(data, status, headers, config) {
            alert("AJAX failed!");
        });
    };
});