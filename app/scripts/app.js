'use strict';

var app = angular.module('guessTheWordApp', ['guessTheWordApp.filters', 'guessTheWordApp.services', 'guessTheWordApp.directives', 'guessTheWordApp.controllers','angular-chrono','ngRoute','ngResource','ngCookies'])
    .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {templateUrl: '/app/views/login.html', controller: 'Login'});
    $routeProvider.when('/view1', {templateUrl: '/app/views/partial1.html', controller: 'MyCtrl1'});
    $routeProvider.when('/view2', {templateUrl: '/app/views/partial2.html', controller: 'MyCtrl2'});
    $routeProvider.when('/game',  {templateUrl: 'views/game.html', controller: 'gameController'});
    $routeProvider.when('/start',  {templateUrl: 'views/start.html', controller: 'startController'});
        $routeProvider.when('/end',  {templateUrl: 'views/endgame.html', controller: 'endgameController'});
    $routeProvider.otherwise({redirectTo: '/start'});
}]);

app.factory("factoryGame", function($http,$resource,$cookies,$rootScope,chronoService){

    return{
        startGame: function(){



            chronoService.start();

        },
        stopGame: function(scope){
            chronoService.stop();

        }
    };
});

app.factory("factoryDrawing", function($http,$resource,$cookies,$rootScope){

    return{
        getDrawings: function(){
            return $resource('http://localhost:8888/symfony2/api-fosrest/web/app_dev.php/api/words').get().$promise.then(function(data) {
                $cookies.putObject('cwid', data);
            });
        },
        getDrawing: function(id){
            return $resource('http://localhost:8888/symfony2/api-fosrest/web/app_dev.php/api/words/:wordId').get({wordId:id}).$promise.then(function(data) {
                return data;
            });

        },
        getDrawingMixed: function(drawing){

            $rootScope.drawingMixed = drawing.word[0].word.split('');
            var size_drawingMixed = $rootScope.drawingMixed.length;
            $rootScope.keyDown = new Array(size_drawingMixed);

            for(var j = 0; j < size_drawingMixed; j++){
                $rootScope.keyDown[j] = '';
            }
        }
    };
});

app.factory("factoryResults", function($http,$resource,$cookies,$rootScope){
    return{
        saveInput: function(input,id,results){

            var user_input = input;
            results.push({
                'id': id,
                'input_user': user_input
            });
        },
        isEquals: function(input_user,good_word){

            if(angular.equals(input_user, good_word)) {
                return true;
            }
            else{
                return false;
            }
        },
        isEndGame: function(id_drawing){

            if(id_drawing == 2) {
                return true;
            }
            else{
                return false;
            }
        },
    };
});