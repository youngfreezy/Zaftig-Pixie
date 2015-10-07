var GameContainerView = Backbone.View.extend({

  className: "gameContainer",

  initialize: function(params) {
    this.gameDisplayView = new GameDisplayView({model: this.model});
  },

  render: function(){

  }

});