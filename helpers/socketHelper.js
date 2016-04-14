/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
var express = require('express');
var socketServer = require('http').createServer(express);
var io = require('socket.io')(socketServer);

socketServer.listen(3001);

// Socket event
io.on('connection', function (socket) {
  socket.on('create_room', function (subscriptionId) {
    socket.join(subscriptionId);
  });
});

module.exports = io;
