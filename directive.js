angular.module('st2forget.word-unscramble-game', [
  'ng-sortable',
  'ngDialog'
]).directive('wordUnscrambleGame', function () {
    var model = { //queston
      Id: 1,
      Statement: 'LOVE',
      Hint: 'Thing that everyone need most'
    };

    var link = function ($scope, $element) { // create link
      $element.on('click', function (e) {
        e.stopPropagation();
      });
      $element.on('', function (e) {
      });
    };

    return {
      controllerAs: 'wordUnscrambleGame',
      controller: ['$attrs', '$scope', '$element', '$interval', 'ngDialog', function ($attrs, $scope, $element, $interval, ngDialog) {
        //Declare local variable
        var shuffleChars = []; // Get current words
        var scoreIncrement = 1000;
        var totalTime = 5000;

        // Declare $scope variable
        $scope.data = model; //TODO: get data from api $.get(url, function () {})
        $scope.dataSentence = 'This is an sentence'; // For detect sentence
        $scope.gameType = $attrs.gameType;
        $scope.correctWord = $scope.data.Statement;
        $scope.correctBol = false;
        $scope.hintMsg = $scope.data.Hint;
        $scope.scoreMark = 0;

        $scope.startVisible = false; //Show and Hide Start Button
        $scope.startShowHide = function () {
          $scope.startVisible = $scope.startVisible ? false : true;
        };

        $scope.instructionVisible = false; //Show and Hide Start Button
        $scope.instructionShowHide = function () {
          $scope.instructionVisible = $scope.instructionVisible ? false : true;
        };

        $scope.gameVisible = false; // Show and Hide Game
        $scope.gameShowHide = function () {
          $scope.gameVisible = $scope.gameVisible ? false : true;
        };

        $scope.shuffeChars = function () { // Shuffle Character
          var charsArray = _.shuffle($scope.data.Statement.split($scope.gameType == 'word' ? '' : ' ')); // Shuffle original word
          console.log(charsArray);
          $scope.draggableObjects = charsArray;
        };
        $scope.shuffeChars();

        $scope.onDropComplete = function () { // Change position
          shuffleChars = $scope.draggableObjects.join('');
          console.log(shuffleChars);
        };

        //Directive URL
        $scope.directiveRootPath = $attrs.directiveRootPath;
        $scope.getTemplateUrl = function () {
          return $scope.directiveRootPath + '/angular-word-unscramble-game/templates/word-unscramble.html';
        };

        // Add timer
        $scope.countDown = totalTime;
        $scope.interval = null;

        $scope.startTimer = function () {
          $scope.interval = $interval(function () {
            $scope.countDown -= 1;
            if ($scope.countDown <= 0) {
              $scope.stopTimer();
              $scope.timeOverDialog()
            }
          }, 1)
        };

        $scope.stopTimer = function () {
          $interval.cancel($scope.interval);
        };

        $scope.replayTimer = function () {
          $scope.countDown = totalTime;
          $scope.interval = null;
          $scope.startTimer();
        };

        // Add Popup from ngDialog
        $scope.timeOverDialog = function () { // Finish Dialog
          $scope.popupTitle = 'Time up!';
          $scope.shuffeChars();
          ngDialog.openConfirm({
            template: 'timeOverId',
            className: 'ngdialog-theme-default',
            scope: $scope
          }).then(function (value) {
              console.log("Confirm");
            }, function (reason) {
              console.log("TimeOver modal promise rejected. Reason: " + reason);
            }
          );
        };

        $scope.submitDialog = function () { // Submit Dialog
          shuffleChars = $scope.draggableObjects.join('');
          if (shuffleChars == $scope.data.Statement) { //Checking Status
            $scope.correctBol = true;
            $scope.scoreMark += (10 * scoreIncrement);
            $scope.stopTimer();
            $scope.submitMsg = 'Correct !';
            $scope.shuffeChars();
          } else {
            $scope.scoreMark -= (2 * scoreIncrement);
            $scope.submitMsg = 'Sorry, the word you entered is not in our dictionary'
          }

          ngDialog.openConfirm({
            template: 'submitId',
            className: 'ngdialog-theme-default',
            scope: $scope
          }).then(function (value) {
              console.log("Confirm");
            }, function (reason) {
              console.log("Submit modal promise rejected. Reason: " + reason);
            }
          );
        };

        $scope.hintDiaglog = function (rel) { // Hint Dialog
          ngDialog.openConfirm({
            template: 'hintId',
            className: 'ngdialog-theme-default',
            scope: $scope
          }).then(function (value) {
              console.log("Confirm");
            }, function (reason) {
              console.log("Hint modal promise rejected. Reason: " + reason);
            }
          );
        };

      }],
      template: '<ng-include src="getTemplateUrl()"></ng-include>',
      link: link
    };
  }
);
