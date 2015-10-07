/*
* ParagraphView contains the two lines of text shown to the user
*   as the text to be typed.
*/

var ParagraphView = Backbone.View.extend({

  tagName: "div",

  className: "paragraphText",

  initialize: function () {
    this.model.on('change:currentIndex', this.updateCurrent, this);
    this.model.on('change:currentLine', this.render, this);
    this.model.on('change:nextLine', this.render, this);
    this.model.fetchText();
    this.render();
  },

  /*
  * render grabs the current and next lines from the model and
  *   displays the in the html.
  */
  render: function () {
    return this.$el.html([
      "<p>" + this.model.get('currentLine').join(" ") + "</p>",
      "<p>" + this.model.get('nextLine').join(" ") + "</p>"
    ]);
  },


  /*
  * updateLines tells the model to recalculate the current and next line.
  * updateLines is called by 'updateCurrent' every five iterations, when
  *   the end of the current line is reached.
  */
  updateLines: function () {
    this.model.updateCurrentLine();
    this.model.updateNextLine();
  },

  /*
  * updateCurrent checks if we've iterated five words and calls
  *   updateLines to display the correct lines.
  * updateCurrent also adds a 'currentWord' class to the current word which
  *   highlights that word for the user.
  */
  updateCurrent: function () {
    var index = this.model.get('currentIndex');
    var lineIndex = index % 5;
    if (lineIndex % 5 === 0) {
      this.updateLines();
    }
    var currentLine = this.model.get('currentLine').slice();
    var nextLine = this.model.get('nextLine').slice();

    currentLine[lineIndex] = "<span class='currentWord'>" + currentLine[lineIndex] + "</span>";
    this.$el.html([
      "<p>" + currentLine.join(" ") + "</p>",
      "<p>" + nextLine.join(" ") + "</p>"
      ]);
  }
});