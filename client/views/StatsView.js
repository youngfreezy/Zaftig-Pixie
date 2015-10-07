/*
* StatsView listens to the model and displays the current
*   player statistics on the page as they are updated.
*/
var StatsView = Backbone.View.extend({

  tagName: "div",

  className: "statsView",

  initialize: function ( params ) {
    this.model.on('update', this.render, this);
    this.render();
  },

  render: function () {
    return this.$el.html([
      'wpm: ' + Math.floor(this.model.get('wpm')),
      ', correct: ' + this.model.get('numCorrect'),
      ', missed: ' + this.model.get('numMissed')
    ]);
  }
});