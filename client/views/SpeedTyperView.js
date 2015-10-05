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
  },

  render: function () {
    return this.$el.html([
      this.statsView.$el,
      this.inputView.$el, 
      this.paragraphView.$el
    ]); 
  }
});