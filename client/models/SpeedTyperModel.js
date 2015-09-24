var SpeedTyperModel = Backbone.Model.extend({
  defaults: {
    paragraph: "hello world I am fast typer",
    // splitParagraph: this.get('paragraph').split(" "),
    numMissed: 0,
    numCorrect: 0,
    currentIndex: 0

  },

  initialize: function () {
  
  }


  // startGame: function() {
  //   set startTimer: ___,
  //   finishTimer: ___
  // }


})