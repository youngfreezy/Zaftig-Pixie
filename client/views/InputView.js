var InputView = Backbone.View.extend({
  
  tagName: "input",

  className: "noOutline",

  initialize: function () {
    this.render();
  }, 

  events: {
    'input': function (e) {
      var currentInput = e.target.value;
      if( currentInput[currentInput.length-1] === " " ){
        this.spacePressHandler(e);
      }
      else {
        this.$el.removeClass(this.model.get("prevResult"));
        this.$el.addClass("noOutline");
        this.spellChecker(currentInput);
      }
    },
  },

  render: function () {
    return this.$el;
  }, 

  spacePressHandler: function (e) {
    var currentInput = e.target.value;
    this.model.spaceHandler(currentInput.substring(0, currentInput.length-1));
    this.$el.removeClass("warning noOutline"); 
    this.$el.addClass(this.model.get("prevResult"));
    e.target.value = "";
    this.$el.attr('placeholder', this.model.getCurrentWord());
  },

  spellChecker: function (currentInput) {
    var currentWord = this.model.getCurrentWord();
    if( currentInput !== currentWord.substring(0, currentInput.length)) {
      this.$el.addClass("warning");      
    } else {
      this.$el.removeClass("warning");
    }
  }

});