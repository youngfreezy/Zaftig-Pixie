var ParagraphView = Backbone.View.extend({ 

  tagName: "div",

  className: "paragraphText",

  initialize: function () { 
    this.model.on('change:currentIndex', this.updateCurrent, this);

    this.render();
  },

  render: function () {
    // return this.$el.html([
    //   this.model.get('paragraphArray')[this.model.get('currentIndex')] + " ",
    //   this.model.get('paragraphArray')[this.model.get('currentIndex') + 1] + " ",
    //   this.model.get('paragraphArray')[this.model.get('currentIndex') + 2] + " ",
    //   this.model.get('paragraphArray')[this.model.get('currentIndex') + 3] + " ",
    //   this.model.get('paragraphArray')[this.model.get('currentIndex') + 4]
    //   ]);
    return this.$el.html([
      "<p>" + this.model.get('currentLine').join(" ") + "</p>",
      "<p>" + this.model.get('nextLine').join(" ") + "</p>"
      ]);
  }, 

  updateLines: function () {
    this.model.updateCurrentLine();
    this.model.updateNextLine();
  }, 

  updateCurrent: function () {
    var index = this.model.get('currentIndex');
    var lineIndex = index % 5;
    if (lineIndex % 5 === 0) {
      this.updateLines();
    }
    var currentLine = this.model.get('currentLine').slice();
    var nextLine = this.model.get('nextLine').slice();

    currentLine[lineIndex] = "<span class='currentWord'>" + currentLine[lineIndex] + "</span>"
    this.$el.html([
      "<p>" + currentLine.join(" ") + "</p>",
      "<p>" + nextLine.join(" ") + "</p>"
      ]);
  }
});