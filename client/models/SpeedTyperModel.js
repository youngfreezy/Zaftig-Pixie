var SpeedTyperModel = Backbone.Model.extend({

  urlRoot: '/',

  defaults: { 
    paragraph: 'hello world I am fast typer hello world I am fast typer hello world I am fast typer hello world I am fast typer hello world I am fast typer hello world I am fast typer hello world I am fast typer hello world I am fast typer hello world I am fast typer hello world I am fast typer hello world I am fast typer hello world I am fast typer ',
    // splitParagraph: this.get('paragraph').split(' '),
    numMissed: 0,
    numCorrect: 0,
    currentIndex: 0,
    wpm: 0
  },

  initialize: function () {
    // TODO: GET request to server for paragraph text
    this.startGame();

    this.set('paragraphArray', this.get('paragraph').split(' '));
    this.updateCurrentLine();
    this.updateNextLine();
  },

  startGame: function() {

    this.set('startTime', Date.now());
  },

  spaceHandler: function (inputWord) {
    this.set( 'inputWord', inputWord );
    if( inputWord === this.get('paragraphArray')[this.get('currentIndex')] ){
      this.set( 'numCorrect', this.get('numCorrect') + 1 );
      this.set( 'prevResult', 'correct');
    } else {
      this.set( 'numMissed', this.get('numMissed') + 1 );
      this.set( 'prevResult', 'incorrect');
    }

    this.set( 'currentIndex', this.get('currentIndex') + 1 );
    this.updateWordsPerMinute();
    // this.trigger('updateWord', this);
  },

  getCurrentWord: function () {
    return this.get('paragraphArray')[this.get('currentIndex')];
  },

  updateWordsPerMinute: function () {
    var start = this.get('startTime');
    var now = Date.now();
    var elapsed = (now - start) / (1000 * 60);
    var wpm = this.get('numCorrect') / elapsed;
    this.set('wpm', wpm);
    this.trigger('update');
  },

  updateCurrentLine: function () {
    var index = this.get('currentIndex');
    this.set('currentLine', this.get('paragraphArray').slice(index, index + 5));
  },

  updateNextLine: function () {
    var index = this.get('currentIndex') + 5;
    this.set('nextLine', this.get('paragraphArray').slice(index, index + 5));
  },

  saveGame: function () {
    //TODO submit post request with game statistics
  }

})