/*

Title: OCTODEUX
File: Server.js
Desc: P.O.C of botfarm "dashboard" with 2x 3D Printers
running Octoprint from 1x Raspberry Pi

Licensing Info: 
Copyright 2017 github.com/brentru
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS 
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR 
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

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
 
// handle views
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
var info = 'infovar';
var pinfo = 'infovar3';
var info2 = 'infovar2';
var pinfo2 = 'infovar3';
/* API Config */
//  Printer 1
var apikey = 'OCTOPRINT-API-KEY-1';
var apiURL = 'http://IP-ADDRESS/api/'
//  Printer 2
var apikey2 = 'OCTOPRINT-API-KEY-2';
var apiURL2 = 'http://IP-ADDRESS:SUBNET/api/'
/* END API Config */


/* OCTOPRINT FUNCTIONS */

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
/* END FUNCTIONS */


/* STATUS REQUESTS */ 
request(job, callback);
request(printer, callbackP);
request(job2, callback2);
request(printer2, callbackP2);
/* END STATUS REQUESTS */


/* Server Routing */
// https://hapijs.com/tutorials/routing?lang=en_US
// Main Dashboard
server.route({
    method: 'GET',
    path: '/index',
    handler: function (request, reply) {
        reply.view('index');
    }
});

// P1 OPERATIONAL 
server.route({
    method: 'GET',
    path: '/p1op',
    handler: function (request, reply) {
        reply.view('p1op', 
        { title: info });
    }
});

// P2 OPERATIONAL
server.route({
    method: 'GET',
    path: '/p2op',
    handler: function (request, reply) {
        reply.view('p2op', 
        { p2: info2 });
    }
});

// P1 STATUS
server.route({
    method: 'GET',
    path: '/p1printer',
    handler: function (request, reply) {
        reply.view('p1printer', 
        { p1: pinfo });
    }
});

// P2 STATUS
server.route({
    method: 'GET',
    path: '/p2printer',
    handler: function (request, reply) {
        reply.view('p2printer', 
        { p2: pinfo2 });
    }
});

/* END SERVER ROUTING */

// Server Info
server.start((err) => {
    if (err) {
        throw err;
    }
 
    console.log(`Server running at: ${server.info.uri}`);
});
 
