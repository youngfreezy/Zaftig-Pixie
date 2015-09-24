var SpeedTyperView = Backbone.View.extend({
  
  tagName: "div",

  className: "speedTyperContainer",

  initialize: function ( params ) {
    this.inputView = new InputView();
    this.render();
  },

  render: function () {
    return this.$el.html([
      this.inputView.$el
      ])
  }
});