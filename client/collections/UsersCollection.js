var UsersCollection = Backbone.Collection.extend({
  model: UserModel,

  url: '/users',
 
  initialize : function() {
    var response = this.fetch();
    console.log(response);
  }
});