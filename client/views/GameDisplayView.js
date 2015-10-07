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