/*
* User Model contains the logic for handling users
*/

var UserModel = Backbone.Model.extend({

  defaults: {

    isLoggedIn: false

  },

  initialize: function () {
    console.log("Is the user Logged In?!?!", this.get("isLoggedIn"));
  },

  loginUser: function() {
    if (!this.get('isLoggedIn')) {
      window.location.href = '/auth/twitter';
      this.set('isLoggedIn', true);
    }
  }


});



