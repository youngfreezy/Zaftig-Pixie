var AppView = Backbone.View.extend({
  
  initialize: function(params) {
    this.gameDisplayView = new GameDisplayView({model: this.model.get('gameDisplay')});
    this.speedTyperView = new SpeedTyperView({model: this.model.get('speedTyper')});
  },

  render: function(){
    return this.$el.html([
      "<p>Hello</p>",
      this.gameDisplayView.$el,
      this.speedTyperView.$el
      ]);
  }

});