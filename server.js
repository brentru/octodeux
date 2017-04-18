'use strict'
 
const Hapi = require('hapi');
const Request = require('request');
const Vision = require('vision');
const Handlebars = require('handlebars');
const LodashFilter = require('lodash.filter');
const LodashTake = require('lodash.take');
 
const server = new Hapi.Server();
 
server.connection({
    host: '127.0.0.1',
    port: 3000
});
 
// Register vision for our views
server.register(Vision, (err) => {
    server.views({
        engines: {
            html: Handlebars
        },
        relativeTo: __dirname,
        path: './views',
    });
});

// global info variable, WORK IN PROGRESS
var info = 'infovar';
var info2 = 'infovar2';

var request = require('request');
var apikey = '653288ED7823456E8F820AF3F15E2343';


var job = {
  url: 'http://134.88.136.194:5000/api/job',
  headers: {
    'X-Api-Key': apikey
  }
};

var connection = {
  url: 'http://134.88.136.194:5000/api/printer',
  headers: {
    'X-Api-Key': apikey
  }
};



function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    info = JSON.parse(body);
    // DEBUG 
    console.log(info);
  }
}




//request(job, callback);
request(job, callback);
console.log(info);

server.route({
    method: 'GET',
    path: '/index',
    handler: function (request, reply) {
        reply.view('index', 
        { title: info });
    }
});




server.start((err) => {
    if (err) {
        throw err;
    }
 
    console.log(`Server running at: ${server.info.uri}`);
});
 
