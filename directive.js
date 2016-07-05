angular.module('st2forget.word-unscramble-game',
  ['ng-sortable',
    'ngDialog']
).directive('wordUnscrambleGame', function () {
    var totalTime = 3000000,
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

    var shuffeCharsFn = function () { // Shuffle Character
      return _.shuffle(this.model.Statement.split(this.gameType == 'word' ? '' : ' ')); // Shuffle original word
    };

    /*Timer Function*/
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

    /*Show Dialog*/
    var timeOverDialog = function () { // Time Over Dialog
      var self = this;
      this.stopTimer();
      this.popupTitle = 'Time up!';
      // this.randomWords();
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
          self.randomWords();
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
        this.countDown = totalTime;

        this.randomWords();
      }
      else {
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


    var randomWords = function () {
      var randomNumber = _.random(0, 6);
      var listOfWords = this.listOfWOrds;
      console.log(listOfWords[randomNumber]);

      this.model.ID = randomNumber;
      this.model.Statement = listOfWords[randomNumber][0];
      this.model.Hint = listOfWords[randomNumber][1];

      this.letterCount = this.model.Statement.length;
      this.draggableObjects = this.shuffeChars(); // shuffle char array

    };

    var windowResizeChange = function () {
      this.letterWidth = this.windowsInnerWidth/(this.letterCount + 5) + 'px';
      this.letterFontSize = this.windowsInnerWidth/(this.letterCount + 5) + 'px';

      // console.log(this.letterWidth);
      // console.log(this.letterFontSize);

      this.sortableItemInner = {
        'width': this.letterWidth,
        'font-size': this.letterFontSize
      };
    };

    var exitWordUnscramble = function () {
      try {
        if (Native && typeof Native == "function") {
          Native("dataCallback", quizID);
        }
      }
      catch (err) {
        //logError(err);
        console.log("ERROR FUNCTION")
      }
    };

    var init = function ($attrs, $scope, $element, $interval, $http, $window, ngDialog) {
      /*// Declare $scope variable*/
      $scope.gameType = $attrs.gameType;
      $scope.isCorrect = false;
      $scope.scoreMark = 0;
      $scope.countDown = totalTime;
      $scope.ngDialog = ngDialog;
      $scope.directiveRootPath = $attrs.directiveRootPath;
      $scope.shuffleChars = shuffleChars;
      $scope.letterCount = 0;
      $scope.model = {
        ID: null,
        Statement: null,
        Hint: null
      };
      $scope.interval = $interval;
      $scope.sortableItemInner = { // Defaull CSS for each letter
        'width': '55px',
        'font-size': '50px'
      };

      angular.element($window).bind('resize', function () {
        $scope.windowsInnerWidth = $window.innerWidth;
        $scope.windowResizeChange();
      });

      /*Declare function for $scope*/
      $scope.shuffeChars = shuffeCharsFn;
      $scope.getTemplateUrl = getTemplateUrl;
      $scope.startTimer = startTimer;
      $scope.stopTimer = stopTimer;
      $scope.replayTimer = replayTimer;
      $scope.submitDialog = submitDialog;
      $scope.timeOverDialog = timeOverDialog;
      $scope.hintDiaglog = hintDiaglog;
      $scope.randomWords = randomWords;
      $scope.windowResizeChange = windowResizeChange;
      $scope.exitWordUnscramble = exitWordUnscramble;

      $scope.onDropComplete = function () { // Change position
        shuffleChars = $scope.draggableObjects.join('');
      };

      /*Running */
      $scope.randomWords(); // Change words
      $scope.hintMsg = $scope.model.Hint;
      $scope.draggableObjects = $scope.shuffeChars();

    };

    return {
      controllerAs: 'wordUnscrambleGame',
      controller: ['$attrs', '$scope', '$element', '$interval', '$http', '$window', 'ngDialog', function ($attrs, $scope, $element, $interval, $http, $window, ngDialog) {
        $scope.$on('WorldUnscrambleCtrlModelUpdated', function (event, data) {
          $scope.listOfWOrds = data;
          init($attrs, $scope, $element, $interval, $http, $window, ngDialog);
        });
      }],
      template: '<ng-include src="getTemplateUrl()"></ng-include>',
      link: link
    };
  }
);
