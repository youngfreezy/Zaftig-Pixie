// exports.isLoggedIn = function(request, response) {
//   return request.session ? !!request.session.user : false;
// };

// exports.checkUser = function(request, response, next) {
//   if (!exports.isLoggedIn(request)) {
//     response.redirect('/');
//   } else {
//     next();
//   }
// };

// exports.createSession = function(request, response, newUser) {
//   return request.session.regenerate(function() {
//       request.session.user = newUser;
//       response.redirect('/');
//     });
// };