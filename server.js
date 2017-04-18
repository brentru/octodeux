'use strict'

// requires
const Hapi = require('hapi');
const Request = require('request');
const Vision = require('vision');
const Handlebars = require('handlebars');
const LodashFilter = require('lodash.filter');
const LodashTake = require('lodash.take');
// create new hapi server
const server = new Hapi.Server();
server.connection({
    host: '127.0.0.1',
    port: 3000
});
 
// view handler
server.register(Vision, (err) => {
    server.views({
        engines: {
            html: Handlebars
        },
        relativeTo: __dirname,
        path: './views',
    });
});
var request = require('request');

// global info variable, WORK IN PROGRESS
var info = 'infovar';
var pinfo = 'PRINTERINFOVAR';


// API Key
var apikey = '653288ED7823456E8F820AF3F15E2343';
// API URL
var apiURL = 'http://134.88.136.194:5000/api/'

// Job Operations 
// http://docs.octoprint.org/en/master/api/job.html
var job = {
  url: apiURL + 'job',
  headers: {
    'X-Api-Key': apikey
  }
};

// Printer Operations
// TODO: test /printer
// http://docs.octoprint.org/en/master/api/printer.html
var printer = {
  url: apiURL + 'printer/sd',
  headers: {
    'X-Api-Key': apikey
  }
};

// Job Callback + JSON Parse
function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    info = JSON.parse(body);
    // DEBUG 
    console.log(info);
  }
}

// Printer Callback + JSON Parse
function callbackP(error, response, body) {
  if (!error && response.statusCode == 200) {
    pinfo = JSON.parse(body);
    // DEBUG 
    console.log(pinfo);
  }
}


// request printer status
request(printer, callbackP);
console.log(pinfo);
// request job status
request(job, callback);
console.log(info);



// START Happi Routes //
// https://hapijs.com/tutorials/routing?lang=en_US

// Main Dashboard
server.route({
    method: 'GET',
    path: '/index',
    handler: function (request, reply) {
        reply.view('index', 
        { title: info });
    }
});

// printer 1 status
server.route({
    method: 'GET',
    path: '/p1op',
    handler: function (request, reply) {
        reply.view('p1op', 
        { title: pinfo });
    }
});



// END Happi Routes //

// Server Info
server.start((err) => {
    if (err) {
        throw err;
    }
 
    console.log(`Server running at: ${server.info.uri}`);
});
 
