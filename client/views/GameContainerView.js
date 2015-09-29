//     this.gameDisplayView = new GameDisplayView({model: this.model.get('speedTyper')});

var GameContainerView = Backbone.View.extend({

  className: "gameContainer",
  
  initialize: function(params) {
    this.gameDisplayView = new GameDisplayView({model: this.model});
  },

  render: function(){

  }

});