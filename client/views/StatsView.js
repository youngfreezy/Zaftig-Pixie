var StatsView = Backbone.View.extend({
  
  tagName: "div",

  className: "statsView", 

  initialize: function ( params ) {
    this.model.on('update', this.render, this);
    console.log("initalize");
    this.render();
  },

  render: function () {
    console.log('wpm changed');
    return this.$el.html([
      'wpm: ' + Math.floor(this.model.get('wpm')),
      ', correct: ' + this.model.get('numCorrect'),
      ', missed: ' + this.model.get('numMissed')
    ]);
  }
});