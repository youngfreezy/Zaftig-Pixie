var GameScreen = function (width, height, threshold) {
  this.width = width;
  this.height = height;
  this.threshold = threshold;

  // this.player = new Racer(player);
  // this.opponent = new Racer(opponent);
}

GameScreen.prototype.initialize = function () {
  var div = d3.select('body')
              // .append('div')
              // .attr('id', 'competition')
              .append('svg:svg')
              .attr('width', this.width)
              .attr('height', this.height)

  var svg = d3.select('svg');

  svg.selectAll('rect')
    .data([
      [this.threshold/2, '#C477E2', 0],
      [this.threshold/2, '#77D7E2', this.threshold/2]
    ])
    .enter()
    .append('rect')
}

GameScreen.prototype.render = function (playerScore, oppScore) { 

  // var total = this.player.model.get('numCorrect') + this.opponent.model.get('numCorrect');

  // function to scale the score based on the width of the svg
  var scale = d3.scale.linear().domain([0, this.threshold]).range([0, this.width]);

  // var difference = this.player.model.get('numCorrect') - this.opponent.model.get('numCorrect')
  var difference = playerScore - oppScore;

  var playerData = [scale(this.threshold/2 + difference), '#C477E2', 0];
  var opponentData = [scale(this.threshold - (this.threshold/2 + difference)), '#77D7E2', scale(this.threshold/2 + difference)];

  var data = []
  data.push(playerData);
  data.push(opponentData);

  var svg = d3.select('svg')

  svg.selectAll('rect')
    .data(data)
    .transition()
    .duration(400)
    .attr('width', function(d){
      return d[0];
    })
    .attr('height', 20)
    .attr('fill', function(d){
      return d[1];
    })
    .attr('x', function(d){
      return d[2];
    });
}

//pass in backbone syntax new Racer({model: model})
var Racer = function (player) {
  this.model = player.model;
}

var RacerModel = function(correct){
  this.model = {
    numCorrect: correct,
    get: function(key){
      return this[key];
    }
  }
}

// var player = new RacerModel(20);
// var opponent = new RacerModel(20);
// var count = 0;

// var game = new GameScreen(600, 300, 60, player, opponent);
// game.initialize();
// game.render();

// setInterval(function(){
//   if(count % 3 === 0){
//     player.model.numCorrect += 4;
//     opponent.model.numCorrect += 1;
//   }
//   else if (count % 5 === 0){
//     player.model.numCorrect += 1;
//     opponent.model.numCorrect += 9; 
//   }
//   else {
//     player.model.numCorrect += 2;
//     opponent.model.numCorrect += 3;
//   }
//   count++;
// }, 100);

// setInterval(function(){
//   game.render();
// }, 500)

var AppModel = Backbone.Model.extend({

  /*
  * Initializes backbone models to be used in views.
  */
  initialize: function(params) {
    this.set('gameDisplay', new GameDisplayModel());
    this.set('speedTyper', new SpeedTyperModel());
  }

});
var GameDisplayModel = Backbone.Model.extend({

});
/*
* Speed Typer Model contains most of the model logic for the game.
* This includes the player data, the async server calls, and the socket
* handlers. One instance of SpeedTyperModel is instantiated in AppModel
* and passed into SpeedTyperView and all sub views.
*/

var SpeedTyperModel = Backbone.Model.extend({

  urlRoot: '/',

  defaults: {
    /*
    * 'paragraph' contains the text the player will be typing.
    */
    paragraph: '',

    /*
    * Score handlers: these are updated based on user input
    *  while the game is running.
    * 'oppScore' is updated from a socket handler, triggered
    *  when the opponent's score changes.
    */
    numMissed: 0,
    numCorrect: 0,
    oppScore: 0,
    currentIndex: 0,
    wpm: 0,
    practiceMode: false,
    wordsPerView: 30,

    /*
    * 'gameOver' is updated from a socket handler, triggered
    * when the socket server has determined a player has won or lost.
    */
    gameOver: false

  },

  initialize: function () {
    this.startGame();
    /*
    * Initialize socket, set it on the model and put
    * a connect handler on it.
    */
    this.set('socket', io.connect(window.location.host));
    this.get('socket').on('connect', function () {
      console.log('Connected!');
    });

    /*
    * Add event listeners for the socket object. The handlers:
    * match: emmitted from socket when two players are connected and the
    *   game client should begin.
    * update: emitted from socket when the opponents score has changed.
    * win: emmitted from socket when this player has a winning score differential
    * lose: emmitted from socket when opponent has a winning score differential
    */
    this.get('socket').on('update', this.updateOpponent.bind(this));
    this.get('socket').on('practice', this.beginPractice.bind(this));
    this.get('socket').on('win', this.gameWin.bind(this));
    this.get('socket').on('lose', this.gameLose.bind(this));
    this.get('socket').on('match', this.beginGame.bind(this));


    this.set('paragraphArray', this.get('paragraph').split(' '));
    this.updateCurrentLine();
  },


  /*
  * beginPractice is called when a socket emits a 'practice' event.
  */
  beginPractice: function() {
    this.set('practiceMode', true);
    this.set('startTime', Date.now());
  },

  /*
  * beginGame is called when a socket emits a 'match' event.
  */
  beginGame: function() {
    /*
    * beginGame resets variables that may have been changed
    * when the player was practicing.
    * 'startTime' is used to calculate words per minute.
    */
    this.set('practiceMode', false);
    this.set('numCorrect', 0);
    this.set('numMissed', 0);
    this.set('wpm', 0);
    this.trigger('update');
    this.set('currentIndex', 0);
    this.set('startTime', Date.now());

    /*
    * trigger the views to initialize game functionality
    */
    this.trigger('beginGame', 'true');
  },

  /*
  * updateOpponent is called with socket emits an 'update' event.
  * Socket passes in a data object with the opponent's score.
  */
  updateOpponent: function(data) {
    this.set('oppScore', data.score);
  },

  /*
  * gameWin and gameLose are socket handlers for the two gameOver
  *   situations.
  */
  gameWin: function () {
    // alert('Game Won');
    this.set('gameOver', true);
    this.trigger('gameWin');
  },

  gameLose: function () {
    // alert('Game lost');
    this.set('gameOver', true);
    this.trigger('gameLose');
  },

  startGame: function() {
  },

  /*
  * fetchText submits a GET request to the server '/text' URL to retrieve a paragraph
  * generated by the server.
  */
  fetchText: function() {
    var context = this;

    this.deferred = this.fetch({
      url: '/text',
      success: function(data, response){
        return response.text;
      }
    });

    this.deferred.done(function(data){
      /*
      * 'paragraphArray' takes the string form of the text ('paragraph')
      * and splits it into an array. Using an array form allows for the
      * game statistics to be more easily and naturally calculated.
      */
      context.set('paragraph', data.text);
      context.set('paragraphArray', context.get('paragraph').split(' '));
      context.updateCurrentLine();
      context.trigger('paragraphSet');
    });
  },

  /*
  * spaceHandler is called by InputView when a space is pressed by the user.
  *   param 'inputWord' is the word grabbed from the input box.
  * This method calculates the player score based on the inputWord's correctness
  * and updates the appropriate score handlers.
  */
  spaceHandler: function (inputWord) {
    this.set( 'inputWord', inputWord );

    if( inputWord === this.get('paragraphArray')[this.get('currentIndex')] ){
      this.set('numCorrect', this.get('numCorrect') + 1 );
      if (!this.get('practiceMode')) {
        this.trigger('correct');
      }
      /*
      * 'prevResult' is set to notify the views whether the input submitted
      * is correct or incorrect.
      */
      this.set('prevResult', 'correct');

      /*
      * Emit an event to the socket with our score when it increases.
      */
      this.get('socket').emit('update', { score: this.get('numCorrect') });

    } else {
      this.set('numMissed', this.get('numMissed') + 1 );
      this.set('prevResult', 'incorrect');
    }

    /*
    * Update the current position and the words per minute
    */
    this.set('currentIndex', this.get('currentIndex') + 1 );
    this.updateWordsPerMinute();
  },

  getCurrentWord: function () {
    return this.get('paragraphArray')[this.get('currentIndex')];
  },

  /*
  * updateWordsPerMinute calculates wpm by taking the number of correct
  *   words and dividing it by the elapsed time.
  */
  updateWordsPerMinute: function () {
    var start = this.get('startTime');
    var now = Date.now();
    var elapsed = (now - start) / (1000 * 60);
    var wpm = this.get('numCorrect') / elapsed;
    this.set('wpm', wpm);
    this.trigger('update');
  },

  /*
  * currentLine refers to the text being displayed in paragraph view.
  */
  updateCurrentLine: function () {
    var wordsPerView = this.get('wordsPerView');
    var index = this.get('currentIndex');
    console.log("The index is", index);
    this.set('currentLine', this.get('paragraphArray').slice(index, index + wordsPerView));
    console.log("The current line after updateCurrentLine is", this.get('currentLine'));
    // console.log("updateCurrentLine is pointing to", this.get('paragraphArray').slice(index, index + 10));
  },

  saveGame: function () {
    //TODO submit post request with game statistics
  }

});
var AppView = Backbone.View.extend({
  
  className: 'container',

  initialize: function(params) {
    /*
    * Initialize creates the two main container views
    */
    this.gameContainerView = new GameContainerView({model: this.model.get('speedTyper')});
    this.speedTyperView = new SpeedTyperView({model: this.model.get('speedTyper')});


  },

  render: function(){
    /*
    * render appends the html from speedTyperView and gameContainerView. 
    * Called in index.html.
    */
    this.model.get('speedTyper').get('socket').emit('login');
    return this.$el.html([
      this.gameContainerView.$el,
      this.speedTyperView.$el
      ]);
  }

});
/*
* StatsView listens to the model and displays the current
*   player statistics on the page as they are updated.
*/
var StatsView = Backbone.View.extend({

  tagName: "div",

  className: "statsView",

  initialize: function ( params ) {
    this.model.on('update', this.render, this);
    this.render();
  },

  render: function () {
    var $statsWpm = $('<div class="wpm stats-box"></div>');
    var $statsCorrect = $('<div class="correct stats-box"></div>');
    var $statsMissed = $('<div class="missed stats-box"></div>');
    return this.$el.html([
      $statsWpm.append('<span class="num">' + Math.floor(this.model.get('wpm')) + '</span><span class="desc">wpm</span>' ),
      $statsCorrect.append('<span class="num">' + this.model.get('numCorrect') + '</span><span class="desc">correct</span>' ),
      $statsMissed.append('<span class="num">' + this.model.get('numMissed') + '</span><span class="desc">missed</span>' ),
    ]);
  }
});
/*
* InputView contains the html input field and its handlers when the
* user types.
*/
var InputView = Backbone.View.extend({

  tagName: "input",

  className: "noOutline form-control",

  initialize: function () {
    this.render();

    /*
    * Initially the input box is disabled to prevent user typing. When the
    * beginGame trigger is detected, the view will enable the user to type.
    */
    this.model.bind("beginGame", this.beginGame.bind(this));
    this.$el.prop("disabled", false);

    /*
    * Add a game over event listener to disable the input box so they cannot
    * type
    */

    this.model.on("change:gameOver", this.disableInput, this);
    this.model.on("paragraphSet", this.setCursorAndPlaceholder, this);
  }, 

  events: {
    /*
    * html input event handler is fired every time a user enters a new character
    *   into the input box. The handler does two things:
    * Calls space handler if the last button pressed was space
    * Otherwise calls spell checker with the current input to determine if the
    *   user typed an incorrect letter.
    */
    'input': function (e) {
      var currentInput = e.target.value;
      if( currentInput[currentInput.length-1] === " " ){
        this.spacePressHandler(e);
      }
      else {
        this.$el.removeClass(this.model.get("prevResult"));
        this.$el.addClass("noOutline");
        this.spellChecker(currentInput);
      }
    },
  },

  render: function () {
    return this.$el;
  },

  /*
  * beginGame removes the 'disabled' property from the input box once the game
  *   has begun, allowing the user to begin typing.
  */
  beginGame: function () {
    this.$el.removeClass(this.model.get("prevResult"));
    this.$el.addClass("noOutline");
    this.$el.val("");
  },

  setCursorAndPlaceholder: function () {
    this.$el.attr('placeholder', this.model.getCurrentWord());
    this.$el.focus();
  },

  /*
  * spacePressHandler grabs the input text and calls the model handler with it,
  *   then removes any styling and adds the appropriate styling class based on the
  *   correctness of the word submitted.
  */
  spacePressHandler: function (e) {
    var currentInput = e.target.value;
    this.model.spaceHandler(currentInput.substring(0, currentInput.length-1));
    this.$el.removeClass("warning noOutline");
    this.$el.addClass(this.model.get("prevResult"));
    e.target.value = "";
    this.$el.attr('placeholder', this.model.getCurrentWord());
  },

  /*
  * spellChecker checks if the current input is incorrect and attaches
  *   styling to the input box to notify the user.
  */
  spellChecker: function (currentInput) {
    var currentWord = this.model.getCurrentWord();
    if( currentInput !== currentWord.substring(0, currentInput.length)) {
      this.$el.addClass("warning");
    } else {
      this.$el.removeClass("warning");
    }
  },

  /*
  * disableInput turns the "disabled" property on the input element to true so
  * user cannot type
  */
  disableInput: function () {
    this.$el.prop("disabled", true);
  }

});
/*
* ParagraphView contains the two lines of text shown to the user
*   as the text to be typed.
*/

var ParagraphView = Backbone.View.extend({

  tagName: "div",

  className: "paragraph-text",

  initialize: function () {
    this.model.on('change:currentIndex', this.updateCurrent, this);
    this.model.on('paragraphSet', this.updateCurrent, this);
    this.model.on('change:currentLine', this.render, this);
    this.model.fetchText();
    this.render();
  },

  /*
  * render grabs the current and next lines from the model and
  *   displays the in the html.
  */
  render: function () {
    return this.$el.html([
      "<p>" + this.model.get('currentLine').join(" ") + "</p>"
    ]);
  },


  /*
  * updateLines tells the model to recalculate the current and next line.
  * updateLines is called by 'updateCurrent' every five iterations, when
  *   the end of the current line is reached.
  */
  updateLines: function () {
    this.model.updateCurrentLine();
  },

  /*
  * updateCurrent checks if we've iterated the number of words per view (set in this.model.defaults)
  * and calls updateLines to display the correct lines.
  * updateCurrent also adds a 'currentWord' class to the current word which
  *   highlights that word for the user.
  */
  updateCurrent: function () {  
    var index = this.model.get('currentIndex');
    var lineIndex = index % this.model.get('wordsPerView');
    var currentLine = this.model.get('currentLine').slice();
    var wordsPerView = this.model.get('wordsPerView');

    if ((lineIndex % wordsPerView === 0)) {
      this.updateLines();
      currentLine = this.model.get('currentLine').slice();
    }
    currentLine[lineIndex] = "<span class='currentWord'>" + currentLine[lineIndex] + "</span>";
    this.$el.html([
      "<p>" + currentLine.join(" ") + "</p>"
      ]);
  }
});
/*
* GameDisplayView initializes the D3 used to display the user and opponent scores,
*   found in ../d3/raceVisuals.js.
* Also contains model event listeners for score changes which update the D3 visuals.
*/
var GameDisplayView = Backbone.View.extend({

  tagName: "div",

  className: "gameView",

  initialize: function ( params ) {
    this.model.on('correct', this.update, this);
    this.model.on('change:oppScore', this.update, this);
    this.model.on('change:gameOver', this.gameOver, this);
    this.game = new GameScreen(window.innerWidth, 100, 40);
    this.game.initialize();
    this.render();
  },

  render: function () {
    this.game.render(0, 0);
  },

  update: function() {
    this.game.render(this.model.get('numCorrect'), this.model.get('oppScore'));
  },

  /*
  * Attach these functions to model socket listeners to link d3 visuals to the start and end
  *   of the game.
  */
  gameStart: function() {

  },

  gameOver: function() {

  }

});
var GameContainerView = Backbone.View.extend({

  className: "gameContainer",

  initialize: function(params) {
    this.gameDisplayView = new GameDisplayView({model: this.model});
  },

  render: function(){

  }

});
/*
* SpeedTyperView is a container for the interactive player portion of the
*  game, which exist in statsView, inputView and paragraphView.
*/
var SpeedTyperView = Backbone.View.extend({

  tagName: "div",

  className: "speedTyperContainer",

  events: {
        "click .button" : "restart"
    },

  initialize: function ( params ) {
    this.statsView = new StatsView({ model: this.model });
    this.paragraphView = new ParagraphView({ model: this.model });
    this.inputView = new InputView({ model: this.model });
    this.render();

    this.model.on('beginGame', function(){ this.changeText('beginGame'); }, this);
    this.model.on('gameWin', function(){ this.changeText('win'); }, this);
    this.model.on('gameLose', function(){ this.changeText('lose'); }, this);

  },

  render: function () {
    var $typingView = $('<div class="typing-view"></div>');
    var $statsView = $('<div class="stats-view"></div>');
    return this.$el.html([
      '<h2>Waiting for Opponent...</h2>',
      '<h3 class="practice">In the meantime practice your typing skills!</h3>',
      $typingView.append([
        this.paragraphView.$el,
        this.inputView.$el,
      ]),
      $statsView.append([
        this.statsView.$el
      ])
    ]); 
  }, 

  changeText: function (status) {
    if(status === 'beginGame'){
      $('h2').text('Start Typing!');
      $('h3.practice').remove();
    } else if(status === 'win'){
      $('h2').text('You win!');
      $('h2').append('<p><a href="#" class="button">New Game</a></p>');
    } else if(status === 'lose'){
      $('h2').text('You lose!');
      $('h2').append('<p><a href="#" class="button">New Game</a></p>');
    }
  },

  restart: function() {
    this.model.get('socket').emit('login');
    this.initialize();
  }

});
