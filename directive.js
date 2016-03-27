angular.module('st2forget.word-unscramble-game', ['ng-sortable']).
  directive('wordUnscrambleGame', function () {


    var model = { //queston
      Id: 1,
      Statement: 'LOVE'
    };

    var link = function ($scope, $element, $attrs){
       $element.on('click', function (e) {
         e.stopPropagation();
       });

      $element.on('', function (e) {

      });
    };

    return {
      controllerAs  : 'wordUnscrambleGame',
      controller  : ['$attrs', '$scope', '$element', function ($attrs, $scope, $element) {

        $scope.data = model; //TODO: get data from api $.get(url, function () {})
        $scope.dataSentence = 'This is an sentence';
        $scope.gameType = $attrs.gameType;

        $scope.statusMessage = 'Let start'

        // Transform INPUT data to list of charracter with correct index
        var charsArray = _.shuffle($scope.data.Statement.split($scope.gameType == 'word' ? '' : ' '));
        console.log(charsArray);
        $scope.draggableObjects = charsArray;

        $scope.onDragOver = function (index, obj) {
          console.log('Word drag over' + obj);
        };

        // Change position
        $scope.onDropComplete = function () {

          // Get current words
          var shuffleChars = [];
          for (var i = 0; i < $scope.draggableObjects.length; i++){
            shuffleChars = shuffleChars.concat($scope.draggableObjects[i])
          }
          shuffleChars = shuffleChars.join('');
          console.log(shuffleChars);

          //Checking Status
          if (shuffleChars == $scope.data.Statement) {
            $scope.statusMessage = "Well Done."
          } else {
            $scope.statusMessage = "Try Again."
          }
        }

        //Directive URL
        $scope.directiveRootPath = $attrs.directiveRootPath;
        $scope.getTemplateUrl = function () {
          return $scope.directiveRootPath + '/angular-word-unscramble-game/templates/word-unscramble.html';
        };

      }],
      template  : '<ng-include src="getTemplateUrl()"></ng-include>',
      link      : link
    };
  }
);



