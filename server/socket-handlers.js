var server = require('./server');
var _ = require('./node_modules/underscore/underscore');

var loginUser = function (socket) {
  // assign a new, uniquely ID'd user object
  var keys = Object.keys(server.users);
  var socketId = 'user' + (keys.length + 1);
  // save a new userID to the server's user cache
  server.users[socketId] = {score: 0, username: socketId};
  // create a userData property which points to this
  // socket's data in the server's user cache
  socket.userData = server.users[socketId];
  console.log('\n\nThis is the socket we\'ve made! \n', socket.userData);
}

var updateScore = function (socket, data, callback) {
  // update score
  server.users[socket.userData.username].score = data.score;
  // console.log('\n\nThis is the socket from the updateScore function: \n', socket.userData);
  // run the callback to keep asynchronous execution in order
  callback(socket);
}

var checkForEndGame = function (socket) {
  // determine which user data this socket is bound to
  var username = socket.userData.username;
  var usernames = Object.keys(server.users);
  var indexOfUsername = usernames.indexOf(username);
  var opponentUserName = indexOfUsername === 0 ? usernames[1] : usernames[0];
  // save scores for comparison - console.logs only make sense when
  // viewed from the perspective of user1
  var user1Score = server.users[username].score;
  var user2Score = server.users[opponentUserName].score;
  console.log('user1score is ' + user1Score + ' and user2Score is ' + user2Score);
  console.log('This is the socket name: ', socket.id);

  // compare scores, emit proper events to proper clients
  // ** BUG ** socket.broadcast.emit emitting to both sockets instead of expected behavior
  // ** BUG ** socket.emit not emitting to origin socket, as would be expected
  if (user1Score - user2Score >= 4) {
    socket.emit('win');
    socket.broadcast.emit('lose');
    return 'user1Winner';
  } else if (user2Score - user1Score >= 4) { // else if socket 2 is + 20 over socket 1
    socket.emit('lose');
    socket.broadcast.emit('win');
    return 'user2Winner';
  }
  return 'noWinner'
}



module.exports.loginUser = loginUser;
module.exports.updateScore = updateScore;
module.exports.checkForEndGame = checkForEndGame;