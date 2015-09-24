var ParagraphView = Backbone.View.extend({ 

  tagName: "div",

  className: "paragraphText",

  initialize: function () {
    this.model.on('change:currentIndex', function () {
      this.render();
    }, this);

    this.render();
  },

  render: function () {
    return this.$el.html([
      this.model.get('paragraphArray')[this.model.get('currentIndex')] + " ",
      this.model.get('paragraphArray')[this.model.get('currentIndex') + 1] + " ",
      this.model.get('paragraphArray')[this.model.get('currentIndex') + 2] + " ",
      this.model.get('paragraphArray')[this.model.get('currentIndex') + 3] + " ",
      this.model.get('paragraphArray')[this.model.get('currentIndex') + 4]
      ]);
  }

});
