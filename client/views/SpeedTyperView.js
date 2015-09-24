var SpeedTyperView = Backbone.View.extend({
  
  tagName: "div",

  className: "speedTyperContainer",

  initialize: function ( params ) {
    this.inputView = new InputView({model: this.model});
    this.paragraphView = new ParagraphView({ model: this.model })
    this.render();
  },

  render: function () {
    return this.$el.html([
      this.inputView.$el, 
      this.paragraphView.$el
      ])
  }
});