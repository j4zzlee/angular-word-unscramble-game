angular.module('st2forget.word-unscramble-game', []).
  directive('wordUnscrambleGame', function () {
    var link = function ($scope, $element, $attrs){
    };

    return {
      controllerAs  : 'wordUnscrambleGame',
      controller  : ['$attrs', '$scope', '$element', function ($attrs, $scope, $element) {
        console.log('fuck')

        $scope.directiveRootPath = $attrs.directiveRootPath;

        $scope.draggableObjects = [
          {name: 'one'},
          {name: 'two'},
          {name: 'three'}
        ]

        $scope.onDropComplete = function (index, obj, evt) {
          var otherObj = $scope.draggableObjects[index];
          var otherIndex = $scope.draggableObjects.indexOf(obj);
          $scope.draggableObjects[index] = obj;
          $scope.draggableObjects[otherIndex] = otherObj;
        }

        $scope.getTemplateUrl = function () {
          return $scope.directiveRootPath + '/angular-word-unscramble-game/templates/word-unscramble.html';
        };

        ///////////////////////////////////////
        console.log("Enter New ")
        $scope.models = {
          selected: null,
          lists: {"A": [], "B": []}
        };

        // Generate initial model
        for (var i = 1; i <= 3; ++i) {
          $scope.models.lists.A.push({label: "Item A" + i});
          $scope.models.lists.B.push({label: "Item B" + i});
        }

        console.log($scope.models.lists)

        $scope.$watch('models', function(model) {
          $scope.modelAsJson = angular.toJson(model, true);
        }, true);
        //console.log($scope.model)
        console.log("Exit New")



      }],
      template  : '<ng-include src="getTemplateUrl()"></ng-include>',
      link      : link
    };
  }
);



