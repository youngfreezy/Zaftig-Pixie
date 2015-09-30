var GameDisplayView = Backbone.View.extend({

  tagName: "div",

  className: "gameView",

  // game: ,

  initialize: function ( params ) {
    this.model.on('change:numCorrect', this.update, this);
    this.model.on('change:oppScore', this.update, this);
    this.model.on('change:gameOver', this.gameOver, this);
    this.game = new GameScreen(600, 100, 40);
    this.game.initialize();
    this.render();
  },

  render: function () {
    this.game.render(0, 0);
  }, 

  update: function() {
    this.game.render(this.model.get('numCorrect'), this.model.get('oppScore'));
  },

  gameStart: function() {

  },

  gameOver: function() {
    //render something on game over
  }
  
});