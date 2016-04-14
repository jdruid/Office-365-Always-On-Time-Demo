/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
var https = require('https');
var host = 'graph.microsoft.com';

/**
 * Generates a POST request (of Content-type ```application/json```)
 * @param {string} path the path, relative to the host, to which this request will be sent
 * @param {string} token the access token with which the request should be authenticated
 * @param {string} data the data which will be 'POST'ed
 * @param {callback} callback
 */
function postData(host, path, token, data, callback) {
  var outHeaders = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
    'Content-Length': data.length
  };
  var options = {
    host: host,
    path: path,
    method: 'POST',
    headers: outHeaders
  };

  // Set up the request
  var post = https.request(options, function (res) {
    console.log(res.statusCode);
    console.log(res.statusMessage);
    res.on('data', function (chunk) {
      console.log('Response: ' + chunk);
    });
    res.on('end', function () {
      callback(res);
    });
  });

  // write the outbound data to it
  post.write(data);
  // we're done!
  post.end();

  post.on('error', function (e) {
    console.log('Request error: ' + e.message);
  });
}

/**
 * Generates a GET request (of Content-type ```application/json```)
 * @param {string} path the path, relative to the host, to which this request will be sent
 * @param {string} token the acess token with which the request should be authenticated
 * @param {callback} callback
 */
function getData(path, token, callback) {
  var options = {
    host: host,
    path: path,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json;odata.metadata=minimal;' +
              'odata.streaming=true;IEEE754Compatible=false',
      Authorization: 'Bearer ' + token
    }
  };

  var req = https.request(options, function (res) {
    var endpointData = '';
    res.on('data', function (chunk) {
      endpointData += chunk;
    });
    res.on('end', function () {
      callback(null, JSON.parse(endpointData));
    });
  });

  req.write('');
  req.end();

  req.on('error', function (error) {
    callback(error, null);
  });
}

/**
 * Generates a DELETE request
 * @param {string} path the path, relative to the host, to which this request will be sent
 * @param {string} token the acess token with which the request should be authenticated
 * @param {callback} callback
 */
function deleteData(path, token, callback) {
  var options = {
    host: host,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'X-HTTP-Method': 'DELETE',
      Authorization: 'Bearer ' + token
    }
  };

  var req = https.request(options, function (res) {
    var endpointData = '';
    res.on('data', function (chunk) {
      endpointData += chunk;
    });
    res.on('end', function () {
      callback(null);
    });
  });

  req.end();

  req.on('error', function (error) {
    callback(error);
  });
}

exports.postData = postData;
exports.getData = getData;
exports.deleteData = deleteData;
