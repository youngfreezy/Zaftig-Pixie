var server = require('./server');
var _ = require('./node_modules/underscore/underscore');

var loginUser = function (socket) {
  // assign a new, uniquely ID'd user object
  var keys = Object.keys(server.users);
  var username = 'user' + (keys.length);
  // save a new userID to the server's user cache
  server.users[username] = {score: 0, socketId: socket.id};
  // create a userData property which points to this
  // socket's data in the server's user cache
  socket.userData = server.users[username];
}

var updateScore = function (socket, data, callback) {
  // update score
  socket.userData.score = data.score;
  console.log('\n\n This is the server cache after socket update: \n', server.users);
  // run the callback, specified in the 'update' listener on server.js
  callback(socket);
}

var checkForEndGame = function (socket) {
  // save each user's data object
  var currentSocketData = socket.userData;
  var opponentSocketData;
  // populate opponentSocketData from the server cache
  for (var user in server.users) {
    if (server.users[user].socketId !== currentSocketData.socketId) {
      opponentSocketData = server.users[user];
    }
  }
  // compare scores, emit proper events to proper clients
  if (currentSocketData.score - opponentSocketData.score >= 20) {
    socket.emit('win');
    socket.broadcast.emit('lose');
    return 'user1Winner';
  } else if (opponentSocketData.score - currentSocketData.score >= 20) {
    socket.emit('lose');
    socket.broadcast.emit('win');
    return 'user2Winner';
  }
  return 'noWinner'
}



module.exports.loginUser = loginUser;
module.exports.updateScore = updateScore;
module.exports.checkForEndGame = checkForEndGame;