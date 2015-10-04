var expect = require('../../node_modules/chai/chai').expect;
var server = require('../../server/server');
// var sinon = require('sinon');
var mocha = require('mocha');
var chai = require('chai');
var should = chai.should();
var io = require('socket.io-client');





describe("login", function() {

  var socket,
      options = {
      'force new connection': true
    };

  beforeEach(function(done) {
    // prime the server with 1 user so that adding another will cause it to emit 'match'
    server.numberOfUsers = 1;
    // instantiate a fake client
    socket = io.connect("http://localhost:3000", options);

    // console.log('This is the socket we think is connected:\n', socket.io);
    // add listener to fake client
    socket.on('connect', function () {
      console.log('This is server.numberOfUsers in the before hook: \n', server.numberOfUsers);
      done();
    });
  });

  afterEach(function(done) {
    // disconnect fake client socket if it is still connected
    if (socket.connected) {
      socket.disconnect();
    }

    // reset server cache information
    server.numberOfUsers = 0;
    done();
  });

  it("creates a new user", function(done) {
    
    console.log('This is server.numberOfUsers in the test: \n',server.numberOfUsers);
    expect(server.numberOfUsers).to.equal(2);
    done();
  });

});