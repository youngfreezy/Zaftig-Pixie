var AppModel = Backbone.Model.extend({

  initialize: function(params) {
    this.set('gameDisplay', new GameDisplayModel());
    this.set('speedTyper', new SpeedTyperModel());
  }

});