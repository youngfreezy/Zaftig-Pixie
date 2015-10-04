var expect = require('../../node_modules/chai/chai').expect;
var request = require('request');
var server = require('../../server/server');
// var sinon = require('sinon');
var mocha = require('mocha');
var chai = require('chai');
var should = chai.should();
var io = require('socket.io-client');


// Server serves statics

// Server cache is instantiated


describe('server functionality tests', function() {

  it('should respond to GET requests for "/" with a 200 status code', function(done) {
    request('http://127.0.0.1:3000', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should instantiate the server cache', function(done) {
    request('http://127.0.0.1:3000', function(error, response, body) {
      expect(server.users).to.eql({numberOfUsers: 0});
      expect(server.users.numberOfUsers).to.equal(0);
      done();
    });
  });

});










/*----------  Socket testing - currently sockets do not connect, can't test!  ----------*/




describe("login behavior tests", function() {

  var socket,
      options = {
      'force new connection': true
    };

  beforeEach(function(done) {
    // instantiate a fake client
    socket = io.connect("http://localhost:3000", options);

    // console.log('This is the socket we think is connected:\n', socket.io);
    // add listener to fake client
    socket.on('connect', function () {
      console.log('This is server.users.numberOfUsers in the before hook: \n', server.users.numberOfUsers);
      socket.emit('login');
      done();
    });
  });

  afterEach(function(done) {
    // disconnect fake client socket if it is still connected
    if (socket.connected) {
      socket.disconnect();
    }

    // reset server cache information
    server.users.numberOfUsers = 0;
    done();
  });

  it("creates a new user", function(done) {
    
    console.log('This is server.users.numberOfUsers in the test: \n', server.users.numberOfUsers);
    expect(server.users.numberOfUsers).to.equal(0);
    done();
  });

});

