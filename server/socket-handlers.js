var server = require('./server');
var _ = require('./node_modules/underscore/underscore');

var loginUser = function (socket) {
  // assign a new, uniquely ID'd user object
  var keys = Object.keys(server.users);
  var username = 'user' + (keys.length + 1);
  // save a new userID to the server's user cache
  server.users[username] = {score: 0, socketId: socket.id};
  // create a userData property which points to this
  // socket's data in the server's user cache
  socket.userData = server.users[username];
  console.log('\n\nThis is the socket we\'ve made! \n', socket.userData.socketId);
}

var updateScore = function (socket, data, callback) {
  // update score
  // server.users[socket.userData.username].score = data.score;
  socket.userData.score = data.score;
  console.log('\n\n This is the server cache after socket update: \n', server.users);
  // run the callback to keep asynchronous execution in order
  callback(socket);
}

var checkForEndGame = function (socket) {
  // save socket ids
  var currentSocketId = socket.userData.socketId;
  var opponentSocketId;
  // save scores for comparison
  var currentUserScore = socket.userData.score;
  var opponentScore;
  // save opponent data
  for (var user in server.users) {
    if (server.users[user].socketId !== currentSocketId) {
      opponentSocketId = server.users[user].socketId;
      opponentScore = server.users[user].score;
    }
  }

  console.log('This is the current socket.id:\n',socket.id);
  // compare scores, emit proper events to proper clients
  if (currentUserScore - opponentScore >= 4) {
    socket.emit('win');
    socket.broadcast.emit('lose');
    return 'user1Winner';
  } else if (opponentScore - currentUserScore >= 4) {
    socket.emit('lose');
    socket.broadcast.emit('win');
    return 'user2Winner';
  }
  return 'noWinner'
}



module.exports.loginUser = loginUser;
module.exports.updateScore = updateScore;
module.exports.checkForEndGame = checkForEndGame;