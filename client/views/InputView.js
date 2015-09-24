var InputView = Backbone.View.extend({
  
  tagName: "input",

  initialize: function () {
    this.render();
  }, 

  events: {
    'input': spacePressHandler
  },

  render: function () {
    return this.$el;
  }, 

  spacePressHandler: function (e) {
    var currentInput = e.target.value;
    if(currentInput[currentInput.length-1] === " "){
      this.model.set('currentWord', currentInput.substring(0, currentInput.length-1));
      e.target.value = "";
    }
  }

});