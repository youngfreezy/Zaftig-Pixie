var AppView = Backbone.View.extend({
  
  initialize: function(params) {
    this.gameContainerView = new GameContainerView({model: this.model.get('speedTyper')});
    this.speedTyperView = new SpeedTyperView({model: this.model.get('speedTyper')});
  },

  render: function(){
    this.model.get('speedTyper').get('socket').emit('login');
    return this.$el.html([
      "<p>Hello</p>",
      this.gameContainerView.$el,
      this.speedTyperView.$el
      ]);
  }

});