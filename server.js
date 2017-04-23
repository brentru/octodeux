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

// global info variables
// printer 1
var info = 'infovar';
var info2 = 'infovar2';
// printer 2
var pinfo = 'infovar3';
var pinfo2 = 'infovar3';

// Printer 1 API Key
var apikey = '6CF25166630647CD8D2C7F94A4804BCD';
// Printer 1 API URL
var apiURL = 'http://192.168.1.100/api/'

// Printer 2 API Key
var apikey2 = '6CF25166630647CD8D2C7F94A4804BCD';
// Printer 1 API URL
var apiURL2 = 'http://192.168.1.100:5001/api/'

// Printer 1 Job Operations 
// http://docs.octoprint.org/en/master/api/job.html
var job = {
  url: apiURL + 'job',
  headers: {
    'X-Api-Key': apikey
  }
};

// Printer 1 Operations
// http://docs.octoprint.org/en/master/api/printer.html
var printer = {
  url: apiURL + 'printer',
  headers: {
    'X-Api-Key': apikey
  }
};

// Printer 2 Job Operations 
// http://docs.octoprint.org/en/master/api/job.html
var job2 = {
  url: apiURL2 + 'job',
  headers: {
    'X-Api-Key': apikey2
  }
};

// Printer 2 Operations
// http://docs.octoprint.org/en/master/api/printer.html
var printer2 = {
  url: apiURL2 + 'printer',
  headers: {
    'X-Api-Key': apikey2
  }
};

// Operational Callback + JSON Parse
function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    info = JSON.parse(body);
    // DEBUG 
    console.log(info);
  }
}

// Printer /printer + JSON Parse
function callbackP(error, response, body) {
  if (!error && response.statusCode == 200) {
    pinfo = JSON.parse(body);
    // DEBUG 
    console.log(pinfo);
  }
}

// PRINTER 2 JOB CALLBACK and PARSE
function callback2(error, response, body) {
  if (!error && response.statusCode == 200) {
    info2 = JSON.parse(body);
    // DEBUG 
    console.log(info);
  }
}

// Printer 2 /printer + JSON Parse
function callbackP2(error, response, body) {
  if (!error && response.statusCode == 200) {
    pinfo2 = JSON.parse(body);
    // DEBUG 
    console.log(pinfo2);
  }
}

// request printer 1 operational status
request(job, callback);
console.log(info);

// request printer 1 job status
request(printer, callbackP);
console.log(pinfo);

// request printer 2 operational status
request(job2, callback2);
console.log(info2);

//  request printer 1 job status
request(printer2, callbackP2);
console.log(pinfo2);



// START Happi Routes //
// https://hapijs.com/tutorials/routing?lang=en_US

// Main Dashboard
server.route({
    method: 'GET',
    path: '/index',
    handler: function (request, reply) {
        reply.view('index');
    }
});

// printer 1 operational status
server.route({
    method: 'GET',
    path: '/p1op',
    handler: function (request, reply) {
        reply.view('p1op', 
        { title: info });
    }
});

// printer 2 operational status
server.route({
    method: 'GET',
    path: '/p2op',
    handler: function (request, reply) {
        reply.view('p2op', 
        { p2: info2 });
    }
});

// printer 1 printer status
server.route({
    method: 'GET',
    path: '/p1printer',
    handler: function (request, reply) {
        reply.view('p1printer', 
        { p1: pinfo });
    }
});

// printer 2 printer status
server.route({
    method: 'GET',
    path: '/p2printer',
    handler: function (request, reply) {
        reply.view('p2printer', 
        { p2: pinfo2 });
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
 
