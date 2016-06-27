angular.module('st2forget.word-unscramble-game',
  ['ng-sortable',
  'ngDialog']
).directive('wordUnscrambleGame', function () {
    var totalTime = 50000,
      interval = null,
      shuffleChars = [],
      scoreIncrement = 1000;

    var getTemplateUrl = function () {
      return this.directiveRootPath + '/angular-word-unscramble-game/templates/word-unscramble.html';
    };

    var link = function ($scope, $element) { // create link
      $element.on('click', function (e) {
        e.stopPropagation();
      });
      $element.on('', function (e) {
      });
    };

    var shuffeChars = function () { // Shuffle Character
      return _.shuffle(this.model.Statement.split(this.gameType == 'word' ? '' : ' ')); // Shuffle original word
    };

    var startTimer = function () {
      var self = this;
      this.stopTimer();
      interval = self.interval(function () {
        self.countDown -= 10;
        if (self.countDown <= 0) {
          self.stopTimer();
          self.timeOverDialog()
        }
      }, 10)
    };

    var stopTimer = function () {
      this.interval.cancel(interval);
    };

    var replayTimer = function () {
      // console.log("Mode: Reset Timer");
      this.countDown = totalTime;
      interval = null;
      this.startTimer();
    };

    var timeOverDialog = function () { // Time Over Dialog
      var self = this;
      this.stopTimer();
      this.popupTitle = 'Time up!';
      this.draggableObjects = this.shuffeChars();

      if (this.countDown <= 0) {
        this.interval.cancel(interval);
      }

      this.countDown = totalTime; // Reset timer

      this.ngDialog.openConfirm({
        template: 'timeOverId',
        className: 'ngdialog-theme-default',
        scope: this
      }).then(function () {
          self.startTimer();

        }, function (reason) {
          self.startTimer();
          console.log("TimeOver modal promise rejected. Reason: " + reason);
        }
      );


    };

    var submitDialog = function () { // Submit Dialog
      var self = this;
      this.stopTimer();
      interval = null;
      shuffleChars = this.draggableObjects.join('');
      if (shuffleChars == this.model.Statement) { //Checking Status
        this.submitMsg = 'Correct !';
        this.isCorrect = true;
        this.scoreMark += (10 * scoreIncrement);
        this.draggableObjects = this.shuffeChars();
        this.countDown = totalTime
      } else {
        this.scoreMark -= (2 * scoreIncrement);
        this.submitMsg = 'Sorry, the word you entered is not in our dictionary'
      }

      this.ngDialog.openConfirm({
        template: 'submitId',
        className: 'ngdialog-theme-default',
        scope: this
      }).then(function () {
          self.startTimer();
          console.log("Confirm");
        }, function (reason) {
          self.startTimer();
          console.log("Submit modal promise rejected. Reason: " + reason);
        }
      );
    };

    var hintDiaglog = function () { // Hint Dialog
      var self = this;
      this.stopTimer();

      this.ngDialog.openConfirm({
        template: 'hintId',
        className: 'ngdialog-theme-default',
        scope: this
      }).then(function (value) {
          self.startTimer();
          console.log("Confirm");
        }, function (reason) {
          self.startTimer();
          console.log("Hint modal promise rejected. Reason: " + reason);
        }
      );
    };

    var init = function ($attrs, $scope, $element, $interval, $http, ngDialog) {
      /*Directive URL*/
      $scope.ngDialog = ngDialog;
      $scope.directiveRootPath = $attrs.directiveRootPath;
      $scope.shuffleChars = shuffleChars;
      $scope.interval = $interval;
      $scope.shuffeChars = shuffeChars;
      $scope.getTemplateUrl = getTemplateUrl;
      $scope.startTimer = startTimer;
      $scope.stopTimer = stopTimer;
      $scope.replayTimer = replayTimer;
      $scope.submitDialog = submitDialog;
      $scope.timeOverDialog = timeOverDialog;
      $scope.hintDiaglog = hintDiaglog;

      /*// Declare $scope variable*/
      $scope.gameType = $attrs.gameType;
      $scope.correctWord = $scope.model.Statement;
      $scope.isCorrect = false;
      $scope.hintMsg = $scope.model.Hint;
      $scope.scoreMark = 0;
      $scope.countDown = totalTime;
      $scope.draggableObjects = $scope.shuffeChars();

      $scope.onDropComplete = function () { // Change position
        shuffleChars = $scope.draggableObjects.join('');
      };

      /*Show and hide section*/
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
    };

    return {
      controllerAs: 'wordUnscrambleGame',
      controller: ['$attrs', '$scope', '$element', '$interval', '$http', 'ngDialog', function ($attrs, $scope, $element, $interval, $http, ngDialog) {
        $scope.$on('WorldUnscrambleCtrlModelUpdated', function (event, data) {
          $scope.model = data;
          init($attrs, $scope, $element, $interval, $http, ngDialog);
        });
      }],
      template: '<ng-include src="getTemplateUrl()"></ng-include>',
      link: link
    };
  }
);
