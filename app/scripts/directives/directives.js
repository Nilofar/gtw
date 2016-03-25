'use strict';

/* Directives */


app = angular.module('guessTheWordApp.directives', ['ngCookies','ngResource']);

app.directive('startDirective', function (factoryDrawing,chronoService,factoryGame,factoryResults,$cookies,$resource,$q,$location) {
  return {
    restrict: 'C',
    replace: true,
    //template: '<div></div>',
    link: function(scope, element, attrs) {
      scope.startGame = function() {

        //alert('Start game !!!');
        factoryDrawing.getDrawings().then(function(data) {
          var cwid = $cookies.getObject('cwid');

          factoryDrawing.getDrawing(cwid.words[0].id).then(function(data){

            factoryDrawing.getDrawingMixed(data);
            var test2 = chronoService.start();
            console.log(test2);
          });

        });
      }
    }
  };

});

app.directive('endDirective', function (factoryDrawing,chronoService,factoryGame,factoryResults,$cookies,$resource,$q,$location) {
  return {
    restrict: 'C',
    //replace: true,
    //template: '<div></div>',
    scope:false,
    link: function(scope, element, attrs) {

        console.log(scope.score);
        //var test= chronoService.stop();
        //console.log(test);
    }
  };

});


app.directive('keyDown', function (factoryDrawing,chronoService,factoryGame,factoryResults,$cookies,$resource,$q,$location,$timeout) {
  var i = 0;
  var j = 0;
  var results = [];

  return  {
    restrict: 'C',
    scope: false,
    link: function (scope,element, attrs, ctrl) {

      element.bind('keydown', function (event) {

        //If the character is between A-Z OR a-z

        if (((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 172)) && i< scope.drawingMixed.length){


          if(scope.keyDown === undefined){
            //scope.keyDown = [];
          }

          var charPressed = String.fromCharCode(event.keyCode);

          //scope.keyDown.push(charPressed);
          scope.keyDown[i] = charPressed;
          i++;
          return true;
        }
        /* If key pressed = backspace
         * permet d'effacer un caractère tapé par l'utilisateur
         */
        else if(event.keyCode == 8) {

          if(i > 0){
            i--;
            scope.keyDown[i] = '';

          }
          else if(i == 1){
            scope.keyDown[0] = '';
          }

          return true;
        }
        else if(event.keyCode == 13) {

          var cwid = $cookies.getObject('cwid');
          var word = cwid.words[j];
          var input_user = scope.keyDown.toString();

          factoryDrawing.getDrawing(word.id).then(function(data){

            var good_word = data.word[0].word.split('').toString();

            var isEquals = factoryResults.isEquals(input_user,good_word);

              if(isEquals){
                console.log('WORD IS OK : SCORE + 2');
                scope.score += 2;


              }else{
                console.log('WORD IS WRONG : SCORE - 1');
                scope.score -= 1;
              }
          });


          factoryResults.saveInput(scope.keyDown,cwid.words[j].id,results);

          if(factoryResults.isEndGame(j)){


            scope.endgame = true;
            console.log('ENDGAME MOTHAFUCKA');

            chronoService.stop();
            $timeout(function(){
              $location.path('/end');
            }, 5000);


          }
          else{

            factoryDrawing.getDrawing(cwid.words[j+1].id).then(function(data){

              factoryDrawing.getDrawingMixed(data);
              j++;

            });
          }

          i = 0;
        }
        else {

          if(scope.keyDown == 'undefined'){
            scope.keyDown = '';
          }
          event.preventDefault();
          return false;
        }
      });

    }
  }
});

 app.directive('focusMe', function ($timeout) {

  return {
    link: function (scope, element, attrs) {

      if (attrs.focusMeDisable === "true") {

        return;
      }
      $timeout(function () {
        element[0].focus();
        /*if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.show(); //open keyboard manually
        }*/
      }, 100);

      element[0].addEventListener('focusout', function(e){
        element[0].focus();
      });
    }
  };
});