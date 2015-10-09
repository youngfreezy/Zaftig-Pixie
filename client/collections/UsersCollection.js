var UsersCollection = Backbone.Collection.extend({
  model: UserModel,

  url: '/user',
 
  initialize : function() {
    var response = this.fetch();
    console.log("response from /user", response);
  }
});


