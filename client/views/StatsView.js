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
    var $statsWpm = $('<div class="wpm stats-box"></div>');
    var $statsCorrect = $('<div class="correct stats-box"></div>');
    var $statsMissed = $('<div class="missed stats-box"></div>');
    return this.$el.html([
      $statsWpm.append('<span class="num">' + Math.floor(this.model.get('wpm')) + '</span><span class="desc">wpm</span>' ),
      $statsCorrect.append('<span class="num">' + this.model.get('numCorrect') + '</span><span class="desc">correct</span>' ),
      $statsMissed.append('<span class="num">' + this.model.get('numMissed') + '</span><span class="desc">missed</span>' ),
    ]);
  }
});