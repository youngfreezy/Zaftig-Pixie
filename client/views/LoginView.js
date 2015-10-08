/*
* LoginView contains the buttons to login to Facebook and Twitter
*/

var LoginView = Backbone.View.extend({

  tagName: "div",

  className: "login-container",

  initialize: function () {
    this.render();
  },

  /*
  * render grabs the current and next lines from the model and
  *   displays the in the html.
  */
  render: function () {
    console.log('Is the user logged in? ', this.model.get('isLoggedIn'));
    if (!this.model.get('isLoggedIn')) {
      this.$el.append(
        '<p>Login or Register with Facebook or Twitter:</p>\
        <a href="/auth/facebook">Facebook</a>\
        <a href="/auth/twitter">Twitter</a>'
      );
    } else {
      this.$el.append(
        '<p>Logged in as: ' + this.model.get('name') + '</p>'
      );
    }
    return this;
  }

});