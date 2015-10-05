/*
* SpeedTyperView is a container for the interactive player portion of the
*  game, which exist in statsView, inputView and paragraphView.
*/
var SpeedTyperView = Backbone.View.extend({
  
  tagName: "div",

  className: "speedTyperContainer",

  initialize: function ( params ) {
    this.statsView = new StatsView({ model: this.model });
    this.inputView = new InputView({ model: this.model });
    this.paragraphView = new ParagraphView({ model: this.model })
    this.render();

    this.model.on('beginGame', function(){ this.changeText('beginGame'); }, this);
    this.model.on('gameWin', function(){ this.changeText('win'); }, this);
    this.model.on('gameLose', function(){ this.changeText('lose'); }, this);

  },

  render: function () {
    return this.$el.html([
      '<h2>Waiting for Opponent...</h2>',
      this.statsView.$el,
      this.inputView.$el, 
      this.paragraphView.$el
    ]); 
  }, 

  changeText: function (status) {
    if(status === 'beginGame'){
      $('h2').text('Start Typing!');
    } else if(status === 'win'){
      $('h2').text('You win!');
    } else if(status === 'lose'){
      $('h2').text('You lose!');
    }
  }

});