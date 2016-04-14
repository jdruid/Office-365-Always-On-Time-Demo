/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
var express = require('express');
var router = express.Router();
var io = require('../helpers/socketHelper.js');
var requestHelper = require('../helpers/requestHelper.js');
var emailer = require('../emailer.js');
var dbHelper = new (require('../helpers/dbHelper'))();
var http = require('http');
var clientStateValueExpected = require('../constants').subscriptionConfiguration.clientState;

/* Default listen route */
router.post('/', function (req, res, next) {
  var status;
  var clientStatesValid;
  var i;
  var resource;
  var subscriptionId;
  // If there's a validationToken parameter in the query string,
  // then this is the request that Office 365 sends to check
  // that this is a valid endpoint.
  // Just send the validationToken back.
  if (req.query && req.query.validationToken) {
    res.send(req.query.validationToken);
    // Send a status of 'Ok'
    status = 200;
  } else {
    clientStatesValid = false;

    // First, validate all the clientState values in array
    for (i = 0; i < req.body.value.length; i++) {
      if (req.body.value[i].clientState !== clientStateValueExpected) {
        // If just one clientState is invalid, we discard the whole batch
        clientStatesValid = false;
        break;
      } else {
        clientStatesValid = true;
      }
    }

    // If all the clientStates are valid, then
    // process the notification
    if (clientStatesValid) {
      for (i = 0; i < req.body.value.length; i++) {
        resource = req.body.value[i].resource;
        subscriptionId = req.body.value[i].subscriptionId;
        processNotification(subscriptionId, resource, res, next);
      }
      // Send a status of 'Accepted'
      status = 202;
    } else {
      // Since the clientState field doesn't have the expected value,
      // this request might NOT come from Microsoft Graph.
      // However, you should still return the same status that you'd
      // return to Microsoft Graph to not alert possible impostors
      // that you have discovered them.
      status = 202;
    }
  }
  res.status(status).end(http.STATUS_CODES[status]);
});


//ADD CODE HERE
//NEED to update for GREG
function processTravelTime(startTime, location) {
    
    ///gregs magic goes here
    console.log("StartTime is: " + startTime);
    console.log("Location is: " + location);
    
    return '{/"startime/":{/"1200/"},/"endtime/": {/"'+startTime+'/"},/"subject/": {/"Travel Time/"},/"body/": {/"this is your travel time/"} }'
}


//ADD CODE HERE
//Semd an email to the user
function sendDecisionEmail(travelApptData, tokenRequest, res, req) {
    //take gregs data
    
    //build outlook email message
    
    //hardcode email for now
    //var destinationEmailAddress = "admin@MOD571321.onmicrosoft.com";
    var destinationEmailAddress = "joshdrew@outlook.com";
    console.log(destinationEmailAddress);
   
    // send the mail with a callback and report back that page...
    var postBody = emailer.generatePostBody(
        "Joshua Drew",
        destinationEmailAddress
    );
    
    console.log(postBody);
    
    
     requestHelper.postData(
         'graph.microsoft.com',
         '/v1.0/me/microsoft.graph.sendMail',
         tokenRequest,
         JSON.stringify(postBody),
         
        function (result) {
            var templateData = {
                title: 'Microsoft Graph Connect',
                data: "Joshua Drew",
                actual_recipient: destinationEmailAddress
            };
            console.log('Send mail status code: ' + result.statusCode);
            console.log('\n\ntoken: ' + tokenRequest);
            if (result.statusCode >= 400) {
                templateData.status_code = result.statusCode;
            }
            res.render('sendMail', templateData);
        });
    
}




// Get subscription data from the database
// Retrieve the actual mail message data from Office 365.
// Send the message data to the socket.

//UPDATE: This is the processor for EVENTS
function processNotification(subscriptionId, resource, res, next, req) {
  dbHelper.getSubscription(subscriptionId, function (dbError, subscriptionData) {
    if (subscriptionData) {
      requestHelper.getData(
        '/beta/' + resource, subscriptionData.accessToken,
        function (requestError, endpointData) {
          if (endpointData) {
           
            //We get the event object and now we try to determine the actual travel time to the appointment
            var travelApptData = processTravelTime(endpointData.start.dateTime, endpointData.location.displayName);
           
            console.log(travelApptData);
            
            //Keep existing polling for display purposes
            io.to(subscriptionId).emit('notification_received', endpointData);
            
            //Send an email to the user for options
            sendDecisionEmail(travelApptData, subscriptionData.accessToken, res, req);            
           
           
          } else if (requestError) {
            res.status(500);
            next(requestError);
          }
        }
      );
    } else if (dbError) {
      res.status(500);
      next(dbError);
    }
  });
}

module.exports = router;
