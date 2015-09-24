var InputView = Backbone.View.extend({
  
  tagName: "input",

  initialize: function () {
    this.render();
  }, 

  events: {
    'input': function (e) {
      if(e.target.value[e.target.value.length-1] === " "){
        console.log("space pressed");
      }
    }
  },

  render: function () {
    return this.$el;
  }

});