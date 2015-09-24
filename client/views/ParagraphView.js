var ParagraphView = Backbone.View.extend({ 

  tagName: "div",

  className: "paragraphText",

  initialize: function () {
    this.render();
  },

  render: function () {
    return this.$el.html([this.model.get('paragraph')]);
  }

});
